"use client";

import * as React from "react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

import { useAppSelector } from "@/redux/hooks";

interface AuthGuardProps {
  children: React.ReactNode;
}

const emptySubscribe = (): (() => void) => {
  return (): void => {
    // noop
  };
};

export default function AuthGuard({ children }: AuthGuardProps): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);

  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    (): boolean => true,
    (): boolean => false
  );

  React.useEffect((): void => {
    if (isMounted && (!isAuthenticated || !token)) {
      toast.error("Access restricted. Please sign in to view your dashboard.", {
        id: "auth-guard-toast",
      });
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(redirectUrl);
    }
  }, [isMounted, isAuthenticated, token, router, pathname]);

  if (!isMounted || !isAuthenticated || !token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-app-bg text-app-fg p-6">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-app-brand to-emerald-600 flex items-center justify-center shadow-xl shadow-app-brand/20 text-white font-black text-2xl">
            T
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-bold text-app-fg font-display-lg">
              Authenticating Session
            </span>
            <span className="text-xs text-app-muted font-medium">
              Verifying your security credentials...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
