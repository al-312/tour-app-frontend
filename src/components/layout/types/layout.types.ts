import type { LucideIcon } from "lucide-react";

export interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string | undefined;
}
