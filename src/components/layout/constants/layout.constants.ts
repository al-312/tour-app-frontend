import {
  Users,
  Building2,
  MapPin,
  UserCheck,
  Briefcase,
  PackageCheck,
} from "lucide-react";

import type { NavigationItem } from "../types/layout.types";

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { name: "Users", href: "/dashboard", icon: Users },
  { name: "Destinations", href: "/destinations", icon: MapPin },
  { name: "Hotels", href: "/hotels", icon: Building2 },
  { name: "Clients", href: "/clients", icon: UserCheck },
  { name: "Consultants", href: "/consultants", icon: Briefcase },
  { name: "Tour Packages", href: "/packages", icon: PackageCheck },
];

export const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "User Management",
    subtitle: "Manage system accounts, roles, and user permissions",
  },
  "/destinations": {
    title: "Destination Management",
    subtitle: "Manage travel destinations, countries, and cover imagery",
  },
  "/hotels": {
    title: "Hotel Management",
    subtitle: "Manage hotel accommodations, star ratings, and destination defaults",
  },
  "/clients": {
    title: "Client Management",
    subtitle: "Manage client contacts, nationalities, and traveler preferences",
  },
  "/consultants": {
    title: "Consultant Management",
    subtitle: "Manage travel consultants, designations, and branding logos",
  },
  "/packages": {
    title: "Tour Package Management",
    subtitle: "Curate custom itinerary packages, day plans, and booking statuses",
  },
  "/profile": {
    title: "Account Profile",
    subtitle: "Manage your personal profile details & account security",
  },
};
