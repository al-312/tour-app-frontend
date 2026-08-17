import { combineReducers, configureStore, type EnhancedStore } from "@reduxjs/toolkit";

import { apiSlice } from "./services/apiSlice";
import "./services/bookingsApiSlice";

const rootReducer = combineReducers({
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
