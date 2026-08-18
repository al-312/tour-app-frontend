"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useAppSelector } from "@/store/hooks";
import { isClient } from "@/lib/utils/is-client";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element | null {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  React.useEffect((): void => {
    if (!isAuthenticated) {
      if (isClient()) {
        sessionStorage.setItem(
          "auth_restricted_message",
          "Access restricted. Please sign in to view your dashboard."
        );
      }
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-app-brand/20 border-t-app-brand rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
