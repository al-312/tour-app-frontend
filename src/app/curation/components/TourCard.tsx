import Image from "next/image";
import * as React from "react";
import { MapPin, Calendar, Compass } from "lucide-react";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";

import type { Tour } from "../types/tour";

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps): React.JSX.Element {
  return (
    <Card className="p-0 overflow-hidden flex flex-col h-full group hover:shadow-md hover:border-app-brand/20 transition-all duration-300">
      {/* Cover Image */}
      <div className="h-48 relative overflow-hidden bg-app-surface-variant">
        {tour.image ? (
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            className="object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-app-muted">
            <Compass className="w-8 h-8 opacity-40 animate-pulse" />
          </div>
        )}
        <div className="absolute top-4 right-4 z-10">
          <Badge variant={tour.status === "active" ? "brand" : "muted"}>
            {tour.status === "active" ? "Active" : "Draft"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-grow justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-app-brand uppercase tracking-wider font-label-caps flex items-center gap-1">
            {tour.category}
          </span>
          <h3 className="text-base font-bold text-app-fg line-clamp-1 group-hover:text-app-brand transition-colors duration-200">
            {tour.title}
          </h3>
          <p className="text-xs text-app-muted line-clamp-2 leading-relaxed">
            {tour.description}
          </p>
        </div>

        {/* Card Footer Meta */}
        <div className="flex items-center justify-between border-t border-app-border/40 pt-4 mt-2 text-[11px] text-app-muted font-medium">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-app-brand" />
            {tour.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-app-brand" />
            {tour.duration}
          </span>
        </div>
      </div>
    </Card>
  );
}
