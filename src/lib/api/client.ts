import { Mutex } from "async-mutex";
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type BaseQueryApi,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { storage } from "@/lib/utils/storage";
import { isClient } from "@/lib/utils/is-client";
import { apiTransformer } from "@/lib/api/api-transformer";
import { logout, setCredentials } from "@/store/auth.store";
import { API_BASE_URL, STORAGE_KEYS } from "@/lib/constants/app.constants";

import type { RootState } from "@/store";
import type { AuthResponse } from "@/features/auth/types/auth.types";

const mutex = new Mutex();

const getAuthToken = (state: RootState): string | null => {
  if (state.auth.token) return state.auth.token;
  return isClient()
    ? (storage.getItemDecoded(STORAGE_KEYS.AUTH_TOKEN) as string | null)
    : null;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getAuthToken(getState() as RootState);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const getStoredRefreshToken = (state: RootState): string | null => {
  if (state.auth.refreshToken) return state.auth.refreshToken;
  return isClient()
    ? (storage.getItemDecoded(STORAGE_KEYS.REFRESH_TOKEN) as string | null)
    : null;
};

interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

const handleRefreshAttempt = async (
  api: BaseQueryApi,
  extraOptions: object,
  refreshToken: string
): Promise<boolean> => {
  const refreshResult = await rawBaseQuery(
    { url: "/auth/refresh", method: "POST", body: { refreshToken } },
    api,
    extraOptions
  );

  if (!refreshResult.data) return false;

  const rawPayload = apiTransformer.unwrapData<unknown>(refreshResult.data);

  if (!rawPayload || typeof rawPayload !== "object") {
    return false;
  }

  const payload = rawPayload as RefreshResponse;

  if (!payload.accessToken) {
    return false;
  }

  const currentUser = (api.getState() as RootState).auth.user;
  const user =
    currentUser ??
    (isClient()
      ? (storage.getItemDecoded(STORAGE_KEYS.USER) as AuthResponse["user"])
      : null);

  if (!user) return false;

  api.dispatch(
    setCredentials({
      user,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken ?? refreshToken,
    })
  );

  return true;
};

const handleUnauthenticatedSignOut = (api: BaseQueryApi): void => {
  if (isClient()) sessionStorage.setItem("is_signing_out", "true");
  api.dispatch(logout());
};

const performTokenRefresh = async (
  api: BaseQueryApi,
  extraOptions: object
): Promise<boolean> => {
  const release = await mutex.acquire();
  try {
    const refreshToken = getStoredRefreshToken(api.getState() as RootState);
    if (!refreshToken) {
      handleUnauthenticatedSignOut(api);
      return false;
    }
    const success = await handleRefreshAttempt(api, extraOptions, refreshToken);
    if (!success) handleUnauthenticatedSignOut(api);
    return success;
  } finally {
    release();
  }
};

const handle401Error = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
): Promise<Awaited<ReturnType<typeof rawBaseQuery>>> => {
  if (mutex.isLocked()) {
    await mutex.waitForUnlock();
    return rawBaseQuery(args, api, extraOptions);
  }
  const success = await performTokenRefresh(api, extraOptions);
  if (success) {
    return rawBaseQuery(args, api, extraOptions);
  }
  return { error: { status: 401, data: "Unauthorized" } };
};

const getRequestUrl = (args: string | FetchArgs): string => {
  return typeof args === "string" ? args : args.url;
};

const isAuthEndpoint = (url: string): boolean => {
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/refresh")
  );
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  const url = getRequestUrl(args);

  if (result.error?.status === 401 && !isAuthEndpoint(url)) {
    return handle401Error(args, api, extraOptions);
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Bookings", "Analytics", "Auth"],
  endpoints: () => ({}),
});
