"use client";

import * as React from "react";
import { Calendar, AlertCircle } from "lucide-react";

import type { DayItineraryItem } from "./step-2-itinerary";

interface DayHeaderTabsProps {
  numberOfDays: number;
  activeDay: number;
  setActiveDay: (day: number) => void;
  daysData: DayItineraryItem[];
  touched: boolean;
}

export function DayHeaderTabs({
  numberOfDays,
  activeDay,
  setActiveDay,
  daysData,
  touched,
}: DayHeaderTabsProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
      {Array.from({ length: numberOfDays }).map((_, idx) => {
        const dayNum = idx + 1;
        const dData = daysData.find((d) => d.dayNumber === dayNum);
        const hasData = Boolean(dData?.hotelId ?? dData?.notes.trim());
        const isMissing = touched && !hasData;

        return (
          <button
            key={dayNum}
            type="button"
            onClick={() => {
              setActiveDay(dayNum);
            }}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeDay === dayNum
                ? "bg-primary text-primary-foreground shadow-md"
                : isMissing
                  ? "bg-destructive/10 text-destructive border border-destructive/30 animate-pulse"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
            }`}
          >
            {isMissing ? (
              <AlertCircle className="w-3.5 h-3.5 text-destructive" />
            ) : (
              <Calendar className="w-3.5 h-3.5" />
            )}
            Day {String(dayNum)}
            {isMissing ? (
              <span className="text-[10px] bg-destructive text-white px-1.5 py-0.2 rounded-full font-bold">
                Empty
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
