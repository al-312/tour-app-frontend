"use client";

import * as React from "react";
import { toast } from "sonner";
import { Calendar, Hotel as HotelIcon, ChevronLeft, ChevronRight } from "lucide-react";

import Card from "@/components/ui/card";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";

import { DayHeaderTabs } from "./day-header-tabs";
import { validateStep2Data } from "../../utils/package-builder-validation";

import type { Hotel } from "@/features/hotels/types/hotel.types";

export interface DayItineraryItem {
  dayNumber: number;
  hotelId: string;
  notes: string;
}

interface Step2ItineraryProps {
  numberOfDays: number;
  activeDay: number;
  setActiveDay: (day: number) => void;
  daysData: DayItineraryItem[];
  setDaysData: React.Dispatch<React.SetStateAction<DayItineraryItem[]>>;
  hotels: Hotel[];
  onBack: () => void;
  onNext: () => void;
}

export function Step2Itinerary({
  numberOfDays,
  activeDay,
  setActiveDay,
  daysData,
  setDaysData,
  hotels,
  onBack,
  onNext,
}: Step2ItineraryProps): React.JSX.Element {
  const [touched, setTouched] = React.useState(false);

  const validation = validateStep2Data(daysData, numberOfDays);

  const firstHotelId = hotels[0]?.id ?? "";

  const currentDayData = daysData.find((d) => d.dayNumber === activeDay) ?? {
    dayNumber: activeDay,
    hotelId: firstHotelId,
    notes: "",
  };

  const activeHotelId = currentDayData.hotelId || firstHotelId;

  const updateActiveDayHotel = (hotelId: string): void => {
    setDaysData((prev) => {
      const exists = prev.some((d) => d.dayNumber === activeDay);
      if (!exists) {
        const full: DayItineraryItem[] = [];
        for (let i = 1; i <= numberOfDays; i += 1) {
          const item = prev.find((d) => d.dayNumber === i);
          full.push(
            item ?? {
              dayNumber: i,
              hotelId: i === activeDay ? hotelId : firstHotelId,
              notes: "",
            }
          );
        }
        return full;
      }
      return prev.map((d) => (d.dayNumber === activeDay ? { ...d, hotelId } : d));
    });
  };

  const updateActiveDayNotes = (notes: string): void => {
    setDaysData((prev) => {
      const exists = prev.some((d) => d.dayNumber === activeDay);
      if (!exists) {
        const full: DayItineraryItem[] = [];
        for (let i = 1; i <= numberOfDays; i += 1) {
          const item = prev.find((d) => d.dayNumber === i);
          full.push(
            item ?? {
              dayNumber: i,
              hotelId: firstHotelId,
              notes: i === activeDay ? notes : "",
            }
          );
        }
        return full;
      }
      return prev.map((d) => (d.dayNumber === activeDay ? { ...d, notes } : d));
    });
  };

  const handleNextStep = (): void => {
    setTouched(true);
    if (!validation.isValid) {
      if (validation.firstError) {
        toast.error(validation.firstError);
      }
      if (validation.emptyDays.length > 0 && validation.emptyDays[0] !== undefined) {
        setActiveDay(validation.emptyDays[0]);
      }
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <DayHeaderTabs
        numberOfDays={numberOfDays}
        activeDay={activeDay}
        setActiveDay={setActiveDay}
        daysData={daysData}
        touched={touched}
      />

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Day {String(activeDay)} Accommodation & Details
              </h2>
              <p className="text-xs text-muted-foreground">
                Assign hotel stay (required) and optional day notes/instructions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Select Hotel Accommodation *"
              value={activeHotelId}
              error={touched && !activeHotelId ? "Hotel is required" : undefined}
              onChange={(e) => {
                updateActiveDayHotel(e.target.value);
              }}
              icon={HotelIcon}
            >
              {hotels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({String(h.starRating)} Stars)
                </option>
              ))}
            </Select>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Day Notes / Instructions
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none"
                placeholder="e.g. Breakfast at hotel, sightseeing, transfer at 3 PM"
                value={currentDayData.notes}
                onChange={(e) => {
                  updateActiveDayNotes(e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6 mt-6 border-t border-border">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <Button onClick={handleNextStep} className="gap-2">
            Next: Select Consultant
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
