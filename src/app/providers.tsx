"use client";

import * as React from "react";
import { Provider } from "react-redux";

import { store } from "@/store";
import { ThemeProvider } from "@/components/shared/theme-context";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
}
