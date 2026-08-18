import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { storage } from "@/lib/utils/storage";
import { isClient } from "@/lib/utils/is-client";
import { STORAGE_KEYS } from "@/lib/constants/app.constants";

import type { AuthResponse, User } from "@/features/auth/types/auth.types";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const getStoredAuth = (): {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
} => {
  if (!isClient()) {
    return { token: null, refreshToken: null, user: null };
  }
  const token = storage.getItemDecoded(STORAGE_KEYS.AUTH_TOKEN) as string | null;
  const refreshToken = storage.getItemDecoded(STORAGE_KEYS.REFRESH_TOKEN) as
    string | null;
  const user = storage.getItemDecoded(STORAGE_KEYS.USER) as User | null;
  return { token, refreshToken, user };
};

const initialStored = getStoredAuth();

const initialState: AuthState = {
  user: initialStored.user,
  token: initialStored.token,
  refreshToken: initialStored.refreshToken,
  isAuthenticated: Boolean(initialStored.token),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;

      storage.setItemEncoded(STORAGE_KEYS.AUTH_TOKEN, accessToken);
      storage.setItemEncoded(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      storage.setItemEncoded(STORAGE_KEYS.USER, user);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      storage.removeItem(STORAGE_KEYS.USER);
      storage.clearStorage();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
