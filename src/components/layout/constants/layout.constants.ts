import {
  Building2,
  MapPin,
  UserCheck,
  Briefcase,
  PackageCheck,
  FileText,
  ShieldCheck,
  Search,
  User,
} from "lucide-react";

import type { NavigationItem } from "../types/layout.types";
import type { UserRole } from "@/features/auth/types/auth.types";

export const GET_NAVIGATION_ITEMS = (role?: UserRole): NavigationItem[] => {
  if (role === "CONSULTANT") {
    return [
      { name: "Package Search", href: "/packages/search", icon: Search },
      { name: "Inquiries", href: "/inquiries", icon: FileText },
      { name: "Clients", href: "/clients", icon: UserCheck },
      { name: "Account Profile", href: "/profile", icon: User },
    ];
  }

  const items: NavigationItem[] = [
    { name: "Consultants", href: "/consultants", icon: Briefcase },
    { name: "Hotels", href: "/hotels", icon: Building2 },
    { name: "Destinations", href: "/destinations", icon: MapPin },
    { name: "Packages", href: "/packages", icon: PackageCheck },
    { name: "Inquiries", href: "/inquiries", icon: FileText },
  ];

  if (role === "SUPER_ADMIN") {
    items.push({ name: "Audit Logs", href: "/audit-logs", icon: ShieldCheck });
  }

  return items;
};

export const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/packages/search": {
    title: "Package Search",
    subtitle: "Search travel packages by destination, dates, and guests",
  },
  "/destinations": {
    title: "Destination Management",
    subtitle: "Manage travel destinations, countries, and cover imagery",
  },
  "/hotels": {
    title: "Hotel & Room Management",
    subtitle: "Manage hotel accommodations, room types, and pricing rules",
  },
  "/clients": {
    title: "Client Management",
    subtitle: "Manage client contacts and customer profiles",
  },
  "/consultants": {
    title: "Consultant Management",
    subtitle: "Manage travel consultants and temporary account credentials",
  },
  "/packages": {
    title: "Tour Package Management",
    subtitle: "Curate custom itinerary packages and multi-day hotel plans",
  },
  "/inquiries": {
    title: "Inquiry & Approval Management",
    subtitle:
      "Review consultant package customization requests and generate approved vouchers",
  },
  "/audit-logs": {
    title: "System Audit Logs",
    subtitle: "View encrypted and redacted administrative system event logs",
  },
  "/profile": {
    title: "Account Profile",
    subtitle: "Manage your personal profile details & account security",
  },
};
