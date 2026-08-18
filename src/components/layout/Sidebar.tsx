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
  Sun,
  Moon,
  LogIn,
} from "lucide-react";

import Button from "@/components/ui/button";
import { logout } from "@/redux/slices/authSlice";
import { useTheme } from "@/components/theme/ThemeContext";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Grid },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/bookings", label: "Bookings", icon: Ticket },
  { href: "/settings", label: "Settings", icon: Settings },
];

const getUserInitials = (name?: string): string => {
  const str = name ?? "AT";
  const words = str.split(" ");
  const firstWord = words[0];
  const secondWord = words[1];
  const firstChar = firstWord ? firstWord.charAt(0) : "A";
  const secondChar = secondWord ? secondWord.charAt(0) : "";
  return `${firstChar}${secondChar}`.toUpperCase();
};

function SidebarBrand({
  userRole,
}: {
  userRole?: string | undefined;
}): React.JSX.Element {
  const roleText = userRole ? `${userRole} Tier` : "Authenticated Tier";

  return (
    <div className="flex items-center gap-3 mb-6 px-2">
      <Link href="/dashboard" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-app-brand to-emerald-600 flex items-center justify-center shadow-lg shadow-app-brand/20 text-white font-black text-lg group-hover:scale-105 transition-transform duration-300">
          T
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-app-fg font-display-lg group-hover:text-app-brand transition-colors">
            Artisan Admin
          </h1>
          <p className="text-app-muted text-[11px] font-medium">{roleText}</p>
        </div>
      </Link>
    </div>
  );
}

function SidebarAuxLinks({
  isAuthenticated,
  onSignOut,
}: {
  isAuthenticated: boolean;
  onSignOut: (e: React.MouseEvent) => void;
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1 border-t border-app-border/40 pt-3 pb-2">
      <Link
        className="group flex items-center gap-3 px-4 py-2 text-app-muted hover:bg-app-surface-variant hover:text-app-fg rounded-xl text-sm transition-all duration-300 hover:translate-x-1"
        href="/login"
        title="Return to Login Portal"
      >
        <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform text-app-brand" />
        <span>Login Portal</span>
      </Link>

      <Link
        className="group flex items-center gap-3 px-4 py-2 text-app-muted hover:bg-app-surface-variant hover:text-app-fg rounded-xl text-sm transition-all duration-300 hover:translate-x-1"
        href="/support"
        onClick={(e): void => {
          e.preventDefault();
          toast.info("Customer support desk is active 24/7.");
        }}
      >
        <HelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span>Support Desk</span>
      </Link>

      {isAuthenticated && (
        <button
          type="button"
          onClick={onSignOut}
          className="group flex items-center gap-3 px-4 py-2 text-app-muted hover:bg-app-surface-variant hover:text-app-error rounded-xl text-sm transition-all duration-300 hover:translate-x-1 w-full text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Sign Out</span>
        </button>
      )}
    </div>
  );
}

function SidebarUserAvatar({
  name,
  email,
}: {
  name?: string | undefined;
  email?: string | undefined;
}): React.JSX.Element {
  const displayName = name ?? "Authenticated User";
  const displayEmail = email ?? "user@example.com";
  const initials = getUserInitials(name);

  return (
    <div className="flex items-center gap-2.5 px-1 min-w-0">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-app-brand to-emerald-600 border border-app-border flex items-center justify-center text-[11px] font-bold text-white shadow-sm shrink-0">
        {initials}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-bold text-app-fg leading-none truncate">
          {displayName}
        </span>
        <span className="text-[10px] text-app-muted mt-0.5 truncate">{displayEmail}</span>
      </div>
    </div>
  );
}

function SidebarUserProfile(): React.JSX.Element {
  const user = useAppSelector((state) => state.auth.user);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between border-t border-app-border/40 pt-4 mt-auto">
      <SidebarUserAvatar name={user?.name} email={user?.email} />

      <Button
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        aria-label="Toggle Theme"
        className="w-8 h-8 p-0 flex items-center justify-center rounded-lg border-app-border shrink-0 hover:bg-app-surface-variant"
      >
        {theme === "dark" ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-app-brand" />
        )}
      </Button>
    </div>
  );
}

export default function Sidebar(): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleSignOut = (e: React.MouseEvent): void => {
    e.preventDefault();
    dispatch(logout());
    toast.success("Signed out successfully");
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-app-surface border-r border-app-border/40 hidden lg:flex flex-col p-6 gap-3 fixed left-0 top-0 h-full z-50 shadow-[20px_0_40px_rgba(0,0,0,0.01)] transition-colors duration-300">
      <SidebarBrand userRole={user?.role} />

      <div className="flex flex-col gap-1 flex-grow">
        {NAVIGATION_ITEMS.map((item: NavigationItem): React.JSX.Element => {
          const Icon = item.icon;
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ease-out hover:translate-x-1 ${
                active
                  ? "bg-app-brand text-white font-semibold shadow-sm"
                  : "text-app-muted hover:bg-app-surface-variant hover:text-app-fg"
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
        className="w-full py-3 mb-3 text-xs font-bold font-label-caps uppercase tracking-wider shadow-md shadow-app-brand/20"
        onClick={(): void => {
          toast.info("Drafting new tour package modal opened");
        }}
      >
        Create New Tour
      </Button>

      <SidebarAuxLinks isAuthenticated={isAuthenticated} onSignOut={handleSignOut} />
      <SidebarUserProfile />
    </aside>
  );
}
