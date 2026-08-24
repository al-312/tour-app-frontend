import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { storage } from "@/lib/utils/storage";
import { STORAGE_KEYS } from "@/lib/constants/app.constants";

import type { AuthResponse, User } from "@/features/auth/types/auth.types";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isHydrated: false,
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
      state.isHydrated = true;

      storage.setItemEncoded(STORAGE_KEYS.AUTH_TOKEN, accessToken);
      storage.setItemEncoded(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      storage.setItemEncoded(STORAGE_KEYS.USER, user);
    },
    setHydrated: (state) => {
      state.isHydrated = true;
    },
    updateCurrentUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      storage.setItemEncoded(STORAGE_KEYS.USER, action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isHydrated = true;

      storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      storage.removeItem(STORAGE_KEYS.USER);
      storage.clearStorage();
    },
  },
});

export const { setCredentials, setHydrated, updateCurrentUser, logout } =
  authSlice.actions;

export default authSlice.reducer;
