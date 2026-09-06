"use client";

import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { logout } from "@/store/auth.store";
import { isClient } from "@/lib/utils/is-client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { useTheme } from "../shared/theme-context";
import { PAGE_TITLES } from "./constants/layout.constants";

function HeaderPageTitle({ pathname }: { pathname: string }): React.JSX.Element {
  const pageInfo = PAGE_TITLES[pathname] ?? {
    title: "Workspace",
  };

  return (
    <div className="flex flex-col min-w-0">
      <h2 className="text-base font-bold text-app-fg tracking-tight truncate font-display-lg">
        {pageInfo.title}
      </h2>
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
  userEmail,
  userRole,
  userInitial,
  onSignOut,
}: {
  userName: string;
  userEmail?: string | undefined;
  userRole?: string | undefined;
  userInitial: string;
  onSignOut: (e: React.MouseEvent) => void;
}): React.JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative pl-3 border-l border-app-border/40">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User account menu"
        className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-app-surface-variant/80 transition-all duration-200 cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-full bg-linear-to-tr from-app-brand to-emerald-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-app-brand/20 group-hover:scale-105 transition-transform shrink-0">
          {userInitial}
        </div>

        <div className="hidden md:flex flex-col text-left min-w-0">
          <span className="text-xs font-bold text-app-fg group-hover:text-app-brand truncate font-display-lg transition-colors">
            {userName}
          </span>
          <span className="text-[10px] font-medium text-app-muted tracking-wider uppercase font-label-caps">
            {userRole ?? "Authenticated"}
          </span>
        </div>

        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-app-muted transition-transform duration-200 ml-0.5 hidden md:block",
            isOpen && "rotate-180 text-app-fg"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-app-surface border border-app-border/80 rounded-2xl shadow-xl z-50 py-2 animate-fade-in flex flex-col">
          {/* User Info Header */}
          <div className="px-4 py-2.5 border-b border-app-border/40 flex flex-col gap-0.5">
            <span className="text-xs font-bold text-app-fg truncate font-display-lg">
              {userName}
            </span>
            {userEmail && (
              <span className="text-[11px] text-app-muted truncate font-mono">
                {userEmail}
              </span>
            )}
            {userRole && (
              <div className="mt-1">
                <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-app-brand/10 text-app-brand border border-app-brand/20">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  {userRole}
                </span>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => {
                setIsOpen(false);
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-app-fg hover:bg-app-surface-variant hover:text-app-brand transition-colors"
            >
              <UserIcon className="w-4 h-4 text-app-muted" />
              <span>View Profile</span>
            </Link>
          </div>

          <div className="border-t border-app-border/40 pt-1">
            <button
              type="button"
              onClick={(e) => {
                setIsOpen(false);
                onSignOut(e);
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
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
    <header className="sticky top-0 z-40 bg-app-surface/80 backdrop-blur-md border-b border-app-border/40 px-6 xl:px-10 py-4 transition-colors duration-300">
      <div className="flex items-center justify-between gap-4 max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto">
        <HeaderPageTitle pathname={pathname} />

        <div className="flex items-center gap-3">
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
            userEmail={user?.email}
            userRole={userRole}
            userInitial={userInitial}
            onSignOut={handleSignOut}
          />
        </div>
      </div>
    </header>
  );
}
