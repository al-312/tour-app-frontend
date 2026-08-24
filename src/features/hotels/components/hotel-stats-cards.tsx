"use client";

import * as React from "react";
import { Building2, Star, Award, MapPin } from "lucide-react";

import Card from "@/components/ui/card";

import type { Hotel } from "../types/hotel.types";

interface HotelStatsCardsProps {
  hotels: Hotel[];
}

export function HotelStatsCards({ hotels }: HotelStatsCardsProps): React.JSX.Element {
  const totalHotels = hotels.length;
  const avgRating =
    totalHotels > 0
      ? (hotels.reduce((acc, h) => acc + h.starRating, 0) / totalHotels).toFixed(1)
      : "0.0";
  const luxuryCount = hotels.filter((h) => h.starRating === 5).length;

  const destinationsCount = new Set(
    hotels.map((h) => h.destinationId).filter((id): id is string => Boolean(id))
  ).size;

  const stats = [
    {
      title: "Total Hotels",
      value: totalHotels,
      description: "Registered accommodations",
      icon: Building2,
      color: "text-app-brand",
      bg: "bg-app-brand/10",
    },
    {
      title: "Average Rating",
      value: `${avgRating} ★`,
      description: "Overall star rating",
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "5-Star Hotels",
      value: luxuryCount,
      description: "Luxury hotel accommodations",
      icon: Award,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Destinations Covered",
      value: destinationsCount,
      description: "Linked travel destinations",
      icon: MapPin,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
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
