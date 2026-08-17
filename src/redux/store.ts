import { combineReducers, configureStore, type EnhancedStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import { apiSlice } from "./services/apiSlice";
import "./services/authApiSlice";
import "./services/bookingsApiSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  api: apiSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (): EnhancedStore<RootState> => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
