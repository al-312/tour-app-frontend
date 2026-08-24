"use client";

import * as React from "react";
import { Toaster } from "sonner";

import AuthSync from "../shared/auth-sync";

export function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <>
      <AuthSync />
      <Toaster position="top-right" theme="system" closeButton />
      {children}
    </>
  );
}
