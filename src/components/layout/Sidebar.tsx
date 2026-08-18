"use client";

import Link from "next/link";
import * as React from "react";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import Badge from "@/components/ui/badge";
import { isClient } from "@/lib/utils/is-client";

import { NAVIGATION_ITEMS } from "./constants/layout.constants";

import type { SidebarContextType } from "./types/layout.types";

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(() => {
    if (isClient()) {
      const saved = localStorage.getItem("sidebar_collapsed");
      return saved ? JSON.parse(saved) === true : false;
    }
    return false;
  });

  const toggleSidebar = React.useCallback((): void => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (isClient()) {
        localStorage.setItem("sidebar_collapsed", JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const value = React.useMemo(
    () => ({ isCollapsed, toggleSidebar }),
    [isCollapsed, toggleSidebar]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

function useSidebar(): SidebarContextType {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

function SidebarBrandLogo({ isCollapsed }: { isCollapsed: boolean }): React.JSX.Element {
  return (
    <div className="flex items-center gap-3 px-1">
      <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-app-brand via-brand-500 to-emerald-400 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-app-brand/25 flex-shrink-0 transition-transform hover:scale-105">
        A
      </div>
      {!isCollapsed && (
        <div className="flex flex-col">
          <span className="font-extrabold text-app-fg tracking-tight text-base font-display-lg">
            AuraTours
          </span>
          <span className="text-[10px] font-semibold tracking-wider text-app-muted uppercase font-label-caps">
            Executive Portal
          </span>
        </div>
      )}
    </div>
  );
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
      aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      className="absolute -right-3 top-7 z-50 p-1.5 rounded-full bg-app-surface border border-app-border text-app-muted hover:text-app-fg hover:bg-app-surface-variant transition-all duration-300 shadow-md cursor-pointer"
    >
      {isCollapsed ? (
        <ChevronRight className="w-3.5 h-3.5 text-app-brand" />
      ) : (
        <ChevronLeft className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

function SidebarBadge({
  badge,
  isActive,
}: {
  badge?: string | undefined;
  isActive: boolean;
}): React.JSX.Element | null {
  if (!badge) return null;
  return (
    <Badge
      variant={isActive ? "muted" : "brand"}
      className={cn(
        "text-[10px] px-1.5 py-0",
        isActive && "bg-white/20 text-white border-transparent"
      )}
    >
      {badge}
    </Badge>
  );
}

function SidebarItemDetails({
  name,
  badge,
  isActive,
}: {
  name: string;
  badge?: string | undefined;
  isActive: boolean;
}): React.JSX.Element {
  return (
    <>
      <span className="flex-1 truncate">{name}</span>
      <SidebarBadge badge={badge} isActive={isActive} />
      <ChevronRight
        className={cn(
          "w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200",
          isActive && "opacity-100 translate-x-0"
        )}
      />
    </>
  );
}

function getSidebarLinkClasses(isActive: boolean, isCollapsed: boolean): string {
  const base =
    "flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 group relative";
  const activeClass = isActive
    ? "bg-app-brand text-white shadow-md shadow-app-brand/25"
    : "text-app-muted hover:text-app-fg hover:bg-app-surface-variant/80";
  const collapseClass = isCollapsed ? "justify-center px-0 py-3" : "";
  return `${base} ${activeClass} ${collapseClass}`;
}

function SidebarNavLinkItem({
  item,
  pathname,
  isCollapsed,
}: {
  item: (typeof NAVIGATION_ITEMS)[number];
  pathname: string;
  isCollapsed: boolean;
}): React.JSX.Element {
  const isActive = pathname === item.href;
  const Icon = item.icon;
  const className = getSidebarLinkClasses(isActive, isCollapsed);
  const iconClass = isActive
    ? "w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 text-white"
    : "w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 text-app-muted group-hover:text-app-fg";

  return (
    <Link
      href={item.href}
      title={isCollapsed ? item.name : undefined}
      className={className}
    >
      <Icon className={iconClass} />
      {!isCollapsed && (
        <SidebarItemDetails name={item.name} badge={item.badge} isActive={isActive} />
      )}
    </Link>
  );
}

function SidebarFooterCard({ isCollapsed }: { isCollapsed: boolean }): React.JSX.Element {
  return (
    <div
      className={cn(
        "p-4 rounded-2xl border border-app-border/60 bg-linear-to-b from-app-surface-variant/50 to-app-surface-variant/20 transition-all duration-300",
        isCollapsed && "p-2 text-center"
      )}
    >
      {!isCollapsed ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-app-fg font-display-lg">
              Concierge Desk 24/7
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[11px] text-app-muted leading-relaxed">
            Direct priority hotline active for VIP client clearances.
          </p>
        </div>
      ) : (
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mx-auto" />
      )}
    </div>
  );
}

export function Sidebar(): React.JSX.Element {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen flex flex-col justify-between bg-app-surface/95 backdrop-blur-md border-r border-app-border/40 p-4 transition-all duration-300 z-30 flex-shrink-0 relative",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <SidebarFloatingToggle isCollapsed={isCollapsed} onToggle={toggleSidebar} />

      <div className="flex flex-col gap-6">
        <SidebarBrandLogo isCollapsed={isCollapsed} />

        <nav className="flex flex-col gap-1.5 pt-2">
          {NAVIGATION_ITEMS.map((item) => (
            <SidebarNavLinkItem
              key={item.href}
              item={item}
              pathname={pathname}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>

      <SidebarFooterCard isCollapsed={isCollapsed} />
    </aside>
  );
}
