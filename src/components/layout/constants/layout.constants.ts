import { LayoutDashboard, Compass, Calendar, Settings } from "lucide-react";

import type { NavigationItem } from "../types/layout.types";

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analytics", href: "/analytics", icon: Compass, badge: "New" },
  { name: "Bookings", href: "/bookings", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
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
