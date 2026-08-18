import Link from "next/link";
import * as React from "react";

import Sidebar from "@/components/layout/Sidebar";
import AuthGuard from "@/components/auth/AuthGuard";
import AuthHeader from "@/components/layout/AuthHeader";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps): React.JSX.Element {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-app-bg text-app-fg flex transition-colors duration-300">
        {/* Fixed Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
          {/* Top Sticky Header */}
          <AuthHeader />

          {/* Page Body */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-8 max-w-7xl w-full mx-auto">
            {children}
          </main>

          {/* Authenticated Workspace Footer */}
          <footer className="mt-auto border-t border-app-border/40 py-5 px-8 bg-app-surface flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300">
            <span className="text-xs text-app-muted font-medium">
              © 2026 AuraTours Technologies. Strict-safety travel & VIP data certified.
            </span>
            <div className="flex gap-6">
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
              <span className="text-xs text-app-brand font-semibold">
                System Status: Operational
              </span>
            </div>
          </footer>
        </div>
      </div>
    </AuthGuard>
  );
}
