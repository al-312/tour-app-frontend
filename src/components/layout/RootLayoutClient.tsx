"use client";

import * as React from "react";
import { Toaster } from "sonner";

import StoreProvider from "@/redux/StoreProvider";
import AuthSync from "@/components/auth/AuthSync";
import { ThemeProvider, useTheme } from "@/components/theme/ThemeContext";

interface RootLayoutClientProps {
  children: React.ReactNode;
}

function ToasterWrapper(): React.JSX.Element {
  const { theme } = useTheme();
  return <Toaster closeButton position="top-right" theme={theme} />;
}

export default function RootLayoutClient({
  children,
}: RootLayoutClientProps): React.JSX.Element {
  return (
    <StoreProvider>
      <ThemeProvider>
        <AuthSync />
        <div className="min-h-screen bg-app-bg text-app-fg transition-colors duration-300">
          {children}
        </div>
        <ToasterWrapper />
      </ThemeProvider>
    </StoreProvider>
  );
}
