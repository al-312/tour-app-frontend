"use client";

import * as React from "react";

import AuthGuard from "@/components/shared/auth-guard";
import { AuthHeader } from "@/components/layout/header";
import { Sidebar, SidebarProvider, useSidebar } from "@/components/layout/sidebar";

function DashboardContent({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? "lg:ml-20" : "lg:ml-64"
      }`}
    >
      <AuthHeader />
      <main className="grow p-6 sm:p-8 max-w-7xl w-full mx-auto animate-fade-in">
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="min-h-screen bg-app-bg text-app-fg">
          <Sidebar />
          <DashboardContent>{children}</DashboardContent>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
