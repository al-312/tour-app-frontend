import { Users } from "lucide-react";

import type { NavigationItem } from "../types/layout.types";

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { name: "Users", href: "/dashboard", icon: Users },
];

export const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "User Management",
    subtitle: "Manage system accounts, roles, and user permissions",
  },
  "/profile": {
    title: "Account Profile",
    subtitle: "Manage your personal profile details & account security",
  },
};
