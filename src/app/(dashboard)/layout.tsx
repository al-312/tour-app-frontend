"use client";

import * as React from "react";

import AuthGuard from "@/components/shared/auth-guard";
import { AuthHeader } from "@/components/layout/header";
import { Sidebar, SidebarProvider } from "@/components/layout/sidebar";

function DashboardContent({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-screen transition-all duration-300 ease-in-out">
      <AuthHeader />
      <main className="grow p-6 sm:p-8 xl:p-10 2xl:p-12  w-full  animate-fade-in">
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
        <div className="flex min-h-screen bg-app-bg text-app-fg relative">
          <Sidebar />
          <DashboardContent>{children}</DashboardContent>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
