"use client";

import Link from "next/link";
import * as React from "react";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";

import StoreProvider from "@/redux/StoreProvider";
import AuthSync from "@/components/auth/AuthSync";

import Sidebar from "./Sidebar";

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export default function RootLayoutClient({
  children,
}: RootLayoutClientProps): React.JSX.Element {
  const pathname = usePathname();
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");

  React.useEffect((): void => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = (): void => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <StoreProvider>
      <AuthSync />
      <div className="min-h-screen bg-app-bg text-app-fg flex transition-colors duration-300">
        {isAuthPage ? (
          <main className="flex-1 w-full min-h-screen">{children}</main>
        ) : (
          <>
            {/* Sidebar Navigation */}
            <Sidebar theme={theme} toggleTheme={toggleTheme} />

            {/* Main Dashboard Space */}
            <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
              <main className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-8 max-w-7xl w-full mx-auto">
                {children}
              </main>

              {/* Global Footer */}
              <footer className="mt-auto border-t border-app-border py-6 px-6 bg-app-surface flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300">
                <span className="text-xs text-app-muted">
                  © 2026 AuraTours Technologies. All rights reserved. Strict-safety travel
                  certified.
                </span>
                <div className="flex gap-4">
                  <Link
                    href="/privacy"
                    className="text-xs text-app-muted hover:text-app-fg transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="text-xs text-app-muted hover:text-app-fg transition-colors"
                  >
                    Terms of Service
                  </Link>
                </div>
              </footer>
            </div>
          </>
        )}

        {/* Dynamic Theme-aware Sonner Toaster */}
        <Toaster closeButton position="top-right" theme={theme} />
      </div>
    </StoreProvider>
  );
}
