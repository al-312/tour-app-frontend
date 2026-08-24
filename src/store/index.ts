import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "@/lib/api/client";

import authReducer from "./auth.store";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type { RootState } from "./types/store.types";
