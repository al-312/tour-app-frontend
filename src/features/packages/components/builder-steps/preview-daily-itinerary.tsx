"use client";

import * as React from "react";
import { Building2, BedDouble } from "lucide-react";

import type { DayItineraryItem } from "./step-2-itinerary";
import type { Hotel } from "@/features/hotels/types/hotel.types";

interface PreviewDailyItineraryProps {
  daysData: DayItineraryItem[];
  hotels: Hotel[];
}

export function PreviewDailyItinerary({
  daysData,
  hotels,
}: PreviewDailyItineraryProps): React.JSX.Element {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground">
        Daily Itinerary & Accommodation Schedule
      </h3>

      <div className="space-y-3">
        {daysData.map((d) => {
          const hotelObj = d.hotelId ? hotels.find((h) => h.id === d.hotelId) : undefined;
          const roomTypeObj = d.roomTypeId
            ? hotelObj?.roomTypes?.find((rt) => rt.id === d.roomTypeId)
            : undefined;

          return (
            <div
              key={d.dayNumber}
              className="p-4 border border-border rounded-xl bg-card space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-primary">
                  Day {String(d.dayNumber)}
                </span>
                {hotelObj ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{hotelObj.name}</span>
                      {hotelObj.starRating ? (
                        <span className="text-amber-600 dark:text-amber-400 font-bold">
                          ({"★".repeat(hotelObj.starRating)})
                        </span>
                      ) : null}
                    </span>

                    {roomTypeObj ? (
                      <span className="text-xs font-medium text-app-brand bg-app-brand/10 border border-app-brand/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                        <BedDouble className="w-3.5 h-3.5" />
                        <span>{roomTypeObj.name}</span>
                      </span>
                    ) : null}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    No hotel selected
                  </span>
                )}
              </div>

              {d.notes ? (
                <p className="text-xs text-muted-foreground italic pt-1">
                  Note: {d.notes}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
