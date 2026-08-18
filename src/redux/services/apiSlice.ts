import { Mutex } from "async-mutex";
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryApi,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { isClient, storage } from "@/utils";
import { API_URL, STORAGE_KEYS } from "@/constants";

import { logout, setCredentials } from "../slices/authSlice";

import type { RootState } from "../store";
import type { AuthResponse } from "@/types/auth";

const mutex = new Mutex();

const getAuthToken = (state: RootState): string | null => {
  if (state.auth.token) return state.auth.token;
  return isClient()
    ? (storage.getItemDecoded(STORAGE_KEYS.TOKEN) as string | null)
    : null;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
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

  const data = refreshResult.data as {
    accessToken: string;
    refreshToken?: string;
    user?: AuthResponse["user"];
  };
  const currentUser = (api.getState() as RootState).auth.user;

  if (currentUser) {
    api.dispatch(
      setCredentials({
        user: currentUser,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken ?? refreshToken,
      })
    );
  }

  return true;
};

const performTokenRefresh = async (
  api: BaseQueryApi,
  extraOptions: object
): Promise<boolean> => {
  const release = await mutex.acquire();
  try {
    const refreshToken = getStoredRefreshToken(api.getState() as RootState);
    if (!refreshToken) {
      api.dispatch(logout());
      return false;
    }
    const success = await handleRefreshAttempt(api, extraOptions, refreshToken);
    if (!success) api.dispatch(logout());
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

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status !== 401) return result;

  return handle401Error(args, api, extraOptions);
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "User", "Bookings", "Analytics", "Tours"],
  endpoints: () => ({}),
});
