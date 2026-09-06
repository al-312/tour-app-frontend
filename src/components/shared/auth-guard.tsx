"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAppSelector } from "@/store/hooks";
import { isClient } from "@/lib/utils/is-client";

const noop = (): void => undefined;
const emptySubscribe = (): (() => void) => noop;
const getSnapshot = (): boolean => true;
const getServerSnapshot = (): boolean => false;

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element | null {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isHydrated } = useAppSelector((state) => state.auth);
  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    getSnapshot,
    getServerSnapshot
  );

  React.useEffect((): void => {
    if (isMounted && isHydrated) {
      if (!isAuthenticated) {
        if (isClient()) {
          sessionStorage.setItem(
            "auth_restricted_message",
            "Access restricted. Please sign in to view your dashboard."
          );
        }
        router.replace("/login");
        return;
      }

      if (user?.mustChangePassword && pathname !== "/change-password") {
        router.replace("/change-password");
        return;
      }

      if (pathname === "/dashboard" || pathname === "/") {
        if (user?.role === "CONSULTANT") {
          router.replace("/packages/search");
          return;
        }
        if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
          router.replace("/consultants");
          return;
        }
      }
    }
  }, [isMounted, isHydrated, isAuthenticated, user, pathname, router]);

  if (!isMounted || !isHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-app-brand/20 border-t-app-brand rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
