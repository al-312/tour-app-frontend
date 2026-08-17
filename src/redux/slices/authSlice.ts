import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { STORAGE_KEYS } from "@/constants";
import { isClient, storage } from "@/utils";

import type { AuthResponse, User } from "@/types/auth";

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
  const token = storage.getItemDecoded(STORAGE_KEYS.TOKEN) as string | null;
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

      storage.setItemEncoded(STORAGE_KEYS.TOKEN, accessToken);
      storage.setItemEncoded(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      storage.setItemEncoded(STORAGE_KEYS.USER, user);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      storage.setItemEncoded(STORAGE_KEYS.USER, action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      storage.removeItem(STORAGE_KEYS.TOKEN);
      storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      storage.removeItem(STORAGE_KEYS.USER);
      storage.clearStorage();
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;

export default authSlice.reducer;
