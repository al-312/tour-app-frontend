"use client";

import * as React from "react";
import { Provider } from "react-redux";

import { makeStore, type AppStore } from "./store";

interface StoreProviderProps {
  children: React.ReactNode;
}

export default function StoreProvider({
  children,
}: StoreProviderProps): React.JSX.Element {
  const [store] = React.useState<AppStore>(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
