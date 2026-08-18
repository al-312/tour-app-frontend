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
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { logout } from "@/store/auth.store";
import { isClient } from "@/lib/utils/is-client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Grid },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/bookings", label: "Bookings", icon: Ticket },
  { href: "/settings", label: "Settings", icon: Settings },
];

const isNavActive = (href: string, pathname: string): boolean => {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
};

const getNavLinkClassName = (isCollapsed: boolean, active: boolean): string => {
  const layoutStyle = isCollapsed
    ? "justify-center py-3 px-0"
    : "px-4 py-3 hover:translate-x-1";
  const activeStyle = active
    ? "bg-app-brand text-white font-semibold shadow-sm"
    : "text-app-muted hover:bg-app-surface-variant hover:text-app-fg";

  return `group w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-300 ease-out ${layoutStyle} ${activeStyle}`;
};

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(() => {
    if (isClient()) {
      return localStorage.getItem("sidebar_collapsed") === "true";
    }
    return false;
  });

  const toggleCollapse = React.useCallback((): void => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (isClient()) {
        localStorage.setItem("sidebar_collapsed", String(next));
      }
      return next;
    });
  }, []);

  const value = React.useMemo<SidebarContextType>(
    () => ({ isCollapsed, toggleCollapse }),
    [isCollapsed, toggleCollapse]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar(): SidebarContextType {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

function SidebarFloatingToggle({
  isCollapsed,
  onToggle,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
}): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute -right-3.5 top-6 w-7 h-7 rounded-full bg-app-surface border border-app-border/80 text-app-muted hover:text-app-fg hover:border-app-brand hover:bg-app-surface-variant shadow-md flex items-center justify-center transition-all duration-300 cursor-pointer z-50 hover:scale-110"
      aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
    >
      {isCollapsed ? (
        <ChevronRight className="w-4 h-4 text-app-brand" />
      ) : (
        <ChevronLeft className="w-4 h-4" />
      )}
    </button>
  );
}

function SidebarBrand({
  userRole,
  isCollapsed,
}: {
  userRole?: string | undefined;
  isCollapsed: boolean;
}): React.JSX.Element {
  const roleText = userRole ? `${userRole} Tier` : "Authenticated Tier";

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center gap-3 mb-6">
        <Link href="/dashboard" className="group" title="Artisan Admin">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-app-brand to-emerald-600 flex items-center justify-center shadow-lg shadow-app-brand/20 text-white font-black text-lg group-hover:scale-105 transition-transform duration-300">
            T
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mb-6 px-1 gap-2">
      <Link href="/dashboard" className="flex items-center gap-3 group min-w-0">
        <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-app-brand to-emerald-600 flex items-center justify-center shadow-lg shadow-app-brand/20 text-white font-black text-lg group-hover:scale-105 transition-transform duration-300 shrink-0">
          T
        </div>
        <div className="min-w-0 truncate">
          <h1 className="text-base font-bold tracking-tight text-app-fg font-display-lg group-hover:text-app-brand transition-colors truncate">
            Artisan Admin
          </h1>
          <p className="text-app-muted text-[11px] font-medium truncate">{roleText}</p>
        </div>
      </Link>
    </div>
  );
}

function SidebarNavLink({
  item,
  pathname,
  isCollapsed,
}: {
  item: NavigationItem;
  pathname: string;
  isCollapsed: boolean;
}): React.JSX.Element {
  const Icon = item.icon;
  const active = isNavActive(item.href, pathname);
  const linkClass = getNavLinkClassName(isCollapsed, active);

  return (
    <Link
      href={item.href}
      title={isCollapsed ? item.label : undefined}
      className={linkClass}
    >
      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 shrink-0" />
      {!isCollapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

function SidebarAuxLinks({
  isCollapsed,
  onSignOut,
}: {
  isCollapsed: boolean;
  onSignOut: (e: React.MouseEvent) => void;
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1 border-t border-app-border/40 pt-3 pb-2">
      <button
        type="button"
        onClick={onSignOut}
        title={isCollapsed ? "Sign Out" : undefined}
        className={`group flex items-center gap-3 text-app-muted hover:bg-app-surface-variant hover:text-app-error rounded-xl text-sm transition-all duration-300 w-full cursor-pointer ${
          isCollapsed
            ? "justify-center py-2.5 px-0"
            : "px-4 py-2 hover:translate-x-1 text-left"
        }`}
      >
        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform shrink-0" />
        {!isCollapsed && <span>Sign Out</span>}
      </button>
    </div>
  );
}

export function Sidebar(): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isCollapsed, toggleCollapse } = useSidebar();

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
    <aside
      className={`bg-app-surface border-r border-app-border/40 hidden lg:flex flex-col fixed left-0 top-0 h-full z-50 shadow-[20px_0_40px_rgba(0,0,0,0.01)] transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20 p-3 gap-2" : "w-64 p-6 gap-3"
      }`}
    >
      <SidebarFloatingToggle isCollapsed={isCollapsed} onToggle={toggleCollapse} />

      <SidebarBrand userRole={user?.role} isCollapsed={isCollapsed} />

      <div className="flex flex-col gap-1 flex-grow">
        {NAVIGATION_ITEMS.map((item) => (
          <SidebarNavLink
            key={item.href}
            item={item}
            pathname={pathname}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      <SidebarAuxLinks isCollapsed={isCollapsed} onSignOut={handleSignOut} />
    </aside>
  );
}
