"use client";

import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  Shield,
  Grid,
  BarChart3,
  Ticket,
  Settings,
  LogOut,
} from "lucide-react";

import { isClient } from "@/utils/isClient";
import Button from "@/components/ui/button";
import { logout } from "@/redux/slices/authSlice";
import { useTheme } from "@/components/theme/ThemeContext";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const PATH_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard Overview",
  "/analytics": "Analytics & Insights",
  "/bookings": "Bookings Management",
  "/settings": "Account & App Settings",
};

const getPageTitle = (path: string): string => {
  const matchedKey = Object.keys(PATH_TITLES).find((key) => path.startsWith(key));
  return matchedKey
    ? (PATH_TITLES[matchedKey] ?? "Authenticated Workspace")
    : "Authenticated Workspace";
};

function AuthHeaderSearch(): React.JSX.Element {
  return (
    <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
      <div className="relative w-full">
        <Search className="w-4 h-4 text-app-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search bookings, clients, or destinations... (Ctrl+K)"
          className="w-full bg-app-bg/80 border border-app-border/60 rounded-xl pl-10 pr-4 py-2 text-xs text-app-fg placeholder:text-app-muted focus:outline-none focus:border-app-brand transition-all"
          onKeyDown={(e): void => {
            if (e.key === "Enter") {
              toast.info(`Searching for "${(e.target as HTMLInputElement).value}"...`);
            }
          }}
        />
      </div>
    </div>
  );
}

function AuthMobileNav({
  isOpen,
  pathname,
  onClose,
  onSignOut,
}: {
  isOpen: boolean;
  pathname: string;
  onClose: () => void;
  onSignOut: () => void;
}): React.JSX.Element | null {
  if (!isOpen) return null;

  const items = [
    { href: "/dashboard", label: "Dashboard", icon: Grid },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/bookings", label: "Bookings", icon: Ticket },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="lg:hidden mt-4 pt-4 border-t border-app-border/60 flex flex-col gap-2 animate-slide-down">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
              active
                ? "bg-app-brand text-white font-semibold"
                : "text-app-muted hover:bg-app-surface-variant"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}

      <button
        type="button"
        onClick={(): void => {
          onClose();
          onSignOut();
        }}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-app-error hover:bg-app-surface-variant w-full text-left"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </button>
    </div>
  );
}

function AuthUserBadge(): React.JSX.Element {
  const user = useAppSelector((state) => state.auth.user);
  const name = user ? user.name : "Alex Robinson";
  const role = user ? user.role : "ADMIN";
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-app-border/40">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-app-brand to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
        {initials}
      </div>
      <div className="flex flex-col text-left">
        <span className="text-xs font-bold text-app-fg leading-none truncate max-w-[120px]">
          {name}
        </span>
        <span className="text-[10px] text-app-muted mt-0.5 flex items-center gap-1">
          <Shield className="w-2.5 h-2.5 text-app-brand" />
          {role}
        </span>
      </div>
    </div>
  );
}

function AuthHeaderActions({
  unreadCount,
  onNotificationClick,
}: {
  unreadCount: number;
  onNotificationClick: () => void;
}): React.JSX.Element {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onNotificationClick}
        className="relative p-2.5 rounded-xl border border-app-border/60 bg-app-surface hover:bg-app-surface-variant text-app-fg transition-colors"
        aria-label="View Notifications"
      >
        <Bell className="w-4 h-4 text-app-muted hover:text-app-fg transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-app-brand text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <Button
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        aria-label="Toggle Theme"
        className="p-2.5 rounded-xl border-app-border/60 hover:bg-app-surface-variant"
      >
        {theme === "dark" ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-app-brand" />
        )}
      </Button>

      <AuthUserBadge />
    </div>
  );
}

export default function AuthHeader(): React.JSX.Element {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [unreadNotifications, setUnreadNotifications] = React.useState(3);

  const handleNotificationClick = (): void => {
    setUnreadNotifications(0);
    toast.info("Notifications cleared. You have 3 recent tour bookings updates.");
  };

  const handleSignOut = (): void => {
    if (isClient()) {
      sessionStorage.setItem("is_signing_out", "true");
    }
    dispatch(logout());
    toast.success("Signed out successfully");
  };

  return (
    <header className="sticky top-0 z-40 bg-app-surface/80 backdrop-blur-md border-b border-app-border/40 px-6 py-4 transition-colors duration-300">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(): void => {
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 rounded-xl border border-app-border bg-app-surface text-app-fg hover:bg-app-surface-variant transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div>
            <span className="text-[11px] font-semibold text-app-brand uppercase tracking-wider font-label-caps block">
              AuraTours Portal
            </span>
            <h2 className="text-lg font-bold text-app-fg font-headline-md leading-tight">
              {getPageTitle(pathname)}
            </h2>
          </div>
        </div>

        <AuthHeaderSearch />
        <AuthHeaderActions
          unreadCount={unreadNotifications}
          onNotificationClick={handleNotificationClick}
        />
      </div>

      <AuthMobileNav
        isOpen={mobileMenuOpen}
        pathname={pathname}
        onClose={(): void => {
          setMobileMenuOpen(false);
        }}
        onSignOut={handleSignOut}
      />
    </header>
  );
}
