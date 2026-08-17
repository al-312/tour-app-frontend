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

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}/api`,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else if (isClient()) {
      const storedToken = storage.getItemDecoded(STORAGE_KEYS.TOKEN);
      if (typeof storedToken === "string" && storedToken !== "") {
        headers.set("Authorization", `Bearer ${storedToken}`);
      }
    }

    return headers;
  },
});

const getStoredRefreshToken = (state: RootState): string | null => {
  if (state.auth.refreshToken) return state.auth.refreshToken;
  if (isClient()) {
    return storage.getItemDecoded(STORAGE_KEYS.REFRESH_TOKEN) as string | null;
  }
  return null;
};

const handleRefreshAttempt = async (
  api: BaseQueryApi,
  extraOptions: object,
  refreshToken: string
): Promise<boolean> => {
  const refreshResult = await rawBaseQuery(
    {
      url: "/auth/refresh",
      method: "POST",
      body: { refreshToken },
    },
    api,
    extraOptions
  );

  if (!refreshResult.data) return false;

  const data = refreshResult.data as {
    accessToken: string;
    refreshToken?: string;
    user?: AuthResponse["user"];
  };
  const state = api.getState() as RootState;
  const currentUser = state.auth.user;

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

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) {
    return result;
  }

  if (mutex.isLocked()) {
    await mutex.waitForUnlock();
    return rawBaseQuery(args, api, extraOptions);
  }

  const release = await mutex.acquire();
  try {
    const state = api.getState() as RootState;
    const refreshToken = getStoredRefreshToken(state);

    if (refreshToken) {
      const success = await handleRefreshAttempt(api, extraOptions, refreshToken);
      if (success) {
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  } finally {
    release();
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "User", "Bookings", "Analytics", "Tours"],
  endpoints: () => ({}),
});
