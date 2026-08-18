"use client";

import * as React from "react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, Sun, Moon, LogOut } from "lucide-react";

import { logout } from "@/store/auth.store";
import { isClient } from "@/lib/utils/is-client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { useTheme } from "../shared/theme-context";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Dashboard Overview",
    subtitle: "AuraTours Portal",
  },
  "/analytics": {
    title: "Analytics & Performance",
    subtitle: "AuraTours Intelligence",
  },
  "/bookings": {
    title: "Itinerary Bookings",
    subtitle: "Portfolio Management",
  },
  "/settings": {
    title: "Workspace Settings",
    subtitle: "Configuration & Safety",
  },
};

function HeaderPageTitle({ pathname }: { pathname: string }): React.JSX.Element {
  const pageInfo = PAGE_TITLES[pathname] ?? {
    title: "Workspace",
    subtitle: "AuraTours Portal",
  };

  return (
    <div className="flex flex-col min-w-0">
      <span className="text-[11px] font-semibold tracking-wider text-app-muted uppercase font-label-caps">
        {pageInfo.subtitle}
      </span>
      <h2 className="text-lg font-bold text-app-fg tracking-tight truncate font-display-lg">
        {pageInfo.title}
      </h2>
    </div>
  );
}

function HeaderSearchBar(): React.JSX.Element {
  return (
    <div className="relative hidden md:block w-72">
      <input
        type="text"
        placeholder="Search bookings, clients, or destinations... (Ctrl+K)"
        className="w-full pl-9 pr-4 py-2 bg-app-surface-variant/80 border border-app-border/60 rounded-xl text-xs text-app-fg placeholder:text-app-muted/60 transition-all duration-200 outline-none focus:border-app-brand focus:ring-2 focus:ring-app-brand/20"
      />
      <Search className="w-3.5 h-3.5 text-app-muted absolute left-3 top-3 pointer-events-none" />
    </div>
  );
}

function ThemeToggleButton({
  theme,
  onToggle,
}: {
  theme: string;
  onToggle: () => void;
}): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle Theme"
      className="p-2.5 rounded-xl text-app-muted hover:text-app-fg hover:bg-app-surface-variant transition-colors cursor-pointer"
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

function UserProfileMenu({
  userName,
  userRole,
  userInitial,
  onSignOut,
}: {
  userName: string;
  userRole?: string | undefined;
  userInitial: string;
  onSignOut: (e: React.MouseEvent) => void;
}): React.JSX.Element {
  return (
    <div className="flex items-center gap-3 pl-3 border-l border-app-border/40">
      <div className="w-9 h-9 rounded-full bg-linear-to-tr from-app-brand to-emerald-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-app-brand/20">
        {userInitial}
      </div>

      <div className="hidden md:flex flex-col text-left min-w-0">
        <span className="text-xs font-bold text-app-fg truncate font-display-lg">
          {userName}
        </span>
        <span className="text-[10px] font-medium text-app-muted tracking-wider uppercase font-label-caps">
          {userRole ?? "Authenticated"}
        </span>
      </div>

      <button
        type="button"
        onClick={onSignOut}
        title="Sign Out"
        className="p-2 rounded-xl text-app-muted hover:text-app-error hover:bg-app-surface-variant transition-all duration-200 cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}

export function AuthHeader(): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAppSelector((state) => state.auth);

  const userName = user?.name ?? "Admin User";
  const userRole = user?.role;
  const userInitial = userName.slice(0, 2).toUpperCase();

  const handleSignOut = (e: React.MouseEvent): void => {
    e.preventDefault();
    if (isClient()) {
      sessionStorage.setItem("is_signing_out", "true");
    }
    dispatch(logout());
    toast.success("Signed out successfully");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-app-surface/80 backdrop-blur-md border-b border-app-border/40 px-6 py-4 transition-colors duration-300">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        <HeaderPageTitle pathname={pathname} />

        <div className="flex items-center gap-3">
          <HeaderSearchBar />

          <button
            type="button"
            aria-label="Notifications"
            className="p-2.5 rounded-xl text-app-muted hover:text-app-fg hover:bg-app-surface-variant transition-colors cursor-pointer relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-app-brand" />
          </button>

          <ThemeToggleButton theme={theme} onToggle={toggleTheme} />

          <UserProfileMenu
            userName={userName}
            userRole={userRole}
            userInitial={userInitial}
            onSignOut={handleSignOut}
          />
        </div>
      </div>
    </header>
  );
}
