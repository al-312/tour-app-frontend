"use client";

import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import {
  Grid,
  BarChart3,
  Ticket,
  Settings,
  HelpCircle,
  LogOut,
  LogIn,
  Sun,
  Moon,
} from "lucide-react";

import Button from "@/components/ui/button";
import { logout } from "@/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

interface SidebarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  { href: "/", label: "Dashboard", icon: Grid },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/bookings", label: "Bookings", icon: Ticket },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ theme, toggleTheme }: SidebarProps): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const isActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = (e: React.MouseEvent): void => {
    e.preventDefault();
    dispatch(logout());
    toast.success("Signed out successfully");
    router.push("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AT";

  return (
    <aside className="w-64 bg-app-surface border-r border-app-border/40 hidden lg:flex flex-col p-6 gap-3 fixed left-0 top-0 h-full z-50 shadow-[20px_0_40px_rgba(0,0,0,0.01)] animate-slide-in">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-app-brand to-emerald-600 flex items-center justify-center shadow-lg shadow-app-brand/20 text-white font-black text-lg">
          T
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-app-fg font-display-lg">
            Artisan Admin
          </h1>
          <p className="text-app-muted text-xs">
            {user ? `${user.role} Tier` : "Guest Tier"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1 flex-grow">
        {NAVIGATION_ITEMS.map((item: NavigationItem): React.JSX.Element => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ease-out hover:translate-x-1 ${
                active
                  ? "bg-app-brand text-white font-semibold"
                  : "text-app-muted hover:bg-app-surface-variant"
              }`}
            >
              <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <Button
        variant="primary"
        className="w-full py-3 mb-4 text-xs font-bold font-label-caps uppercase tracking-wider"
      >
        Create New Tour
      </Button>

      <div className="flex flex-col gap-1 border-t border-app-border/40 pt-4 pb-2">
        <Link
          className="group flex items-center gap-3 px-4 py-2 text-app-muted hover:bg-app-surface-variant rounded-xl text-sm transition-all duration-300 hover:translate-x-1"
          href="/support"
        >
          <HelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Support</span>
        </Link>

        {isAuthenticated ? (
          <button
            type="button"
            onClick={handleSignOut}
            className="group flex items-center gap-3 px-4 py-2 text-app-muted hover:bg-app-surface-variant hover:text-app-error rounded-xl text-sm transition-all duration-300 hover:translate-x-1 w-full text-left"
          >
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Sign Out</span>
          </button>
        ) : (
          <Link
            className="group flex items-center gap-3 px-4 py-2 text-app-brand hover:bg-app-brand-bg rounded-xl text-sm font-semibold transition-all duration-300 hover:translate-x-1"
            href="/login"
          >
            <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Sign In</span>
          </Link>
        )}
      </div>

      {/* User details and theme toggler at the bottom */}
      <div className="flex items-center justify-between border-t border-app-border/40 pt-4 mt-auto">
        <div className="flex items-center gap-2 px-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-app-brand to-emerald-600 border border-app-border flex items-center justify-center text-[10px] font-bold text-white shadow-sm shrink-0">
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-app-fg leading-none truncate">
              {user ? user.name : "Guest User"}
            </span>
            <span className="text-[10px] text-app-muted mt-0.5 truncate">
              {user ? user.email : "Not signed in"}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="w-8 h-8 p-0 flex items-center justify-center rounded-lg border-app-border shrink-0"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-450 animate-spin-slow" />
          ) : (
            <Moon className="w-4 h-4 text-app-brand hover:rotate-12 transition-transform duration-300" />
          )}
        </Button>
      </div>
    </aside>
  );
}
