"use client";

import * as React from "react";
import { Users, ShieldAlert, UserCheck, User } from "lucide-react";

import Card from "@/components/ui/card";

import type { User as UserType } from "../types/user.types";

interface UserStatsCardsProps {
  users: UserType[];
}

export function UserStatsCards({ users }: UserStatsCardsProps): React.JSX.Element {
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const consultantCount = users.filter((u) => u.role === "CONSULTANT").length;
  const clientCount = users.filter((u) => u.role === "CLIENT").length;

  const stats = [
    {
      title: "Total Accounts",
      value: totalUsers,
      description: "Active platform users",
      icon: Users,
      color: "text-app-brand",
      bg: "bg-app-brand/10",
    },
    {
      title: "Administrators",
      value: adminCount,
      description: "Full system access",
      icon: ShieldAlert,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      title: "Consultants",
      value: consultantCount,
      description: "Itinerary curations",
      icon: UserCheck,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Clients",
      value: clientCount,
      description: "Registered travelers",
      icon: User,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card
            key={idx}
            className="p-5 sm:p-6 flex flex-col justify-between gap-3 transition-all duration-300 hover:shadow-md hover:border-app-brand/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-app-muted uppercase tracking-wider font-label-caps">
                {stat.title}
              </span>
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-app-fg tracking-tight font-display-lg">
                {stat.value}
              </span>
              <p className="text-xs text-app-muted mt-1 font-medium">
                {stat.description}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
