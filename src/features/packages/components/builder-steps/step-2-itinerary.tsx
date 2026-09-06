"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Calendar,
  Hotel as HotelIcon,
  BedDouble,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Card from "@/components/ui/card";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";

import { DayHeaderTabs } from "./day-header-tabs";
import { validateStep2Data } from "../../utils/package-builder-validation";

import type { Hotel } from "@/features/hotels/types/hotel.types";

export interface DayItineraryItem {
  dayNumber: number;
  hotelId: string;
  roomTypeId?: string | undefined;
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
  nextButtonText?: string | undefined;
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
  nextButtonText = "Next: Consultant & Travelers",
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

  const selectedHotel = React.useMemo(
    () => hotels.find((h) => h.id === activeHotelId),
    [hotels, activeHotelId]
  );

  const availableRoomTypes = React.useMemo(
    () => selectedHotel?.roomTypes ?? [],
    [selectedHotel]
  );

  const activeRoomTypeId = currentDayData.roomTypeId ?? availableRoomTypes[0]?.id ?? "";

  const updateActiveDayHotel = (hotelId: string): void => {
    const newHotel = hotels.find((h) => h.id === hotelId);
    const defaultRoomTypeId = newHotel?.roomTypes?.[0]?.id;

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
              roomTypeId: i === activeDay ? defaultRoomTypeId : undefined,
              notes: "",
            }
          );
        }
        return full;
      }
      return prev.map((d) =>
        d.dayNumber === activeDay ? { ...d, hotelId, roomTypeId: defaultRoomTypeId } : d
      );
    });
  };

  const updateActiveDayRoomType = (roomTypeId: string): void => {
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
              roomTypeId: i === activeDay ? roomTypeId : undefined,
              notes: "",
            }
          );
        }
        return full;
      }
      return prev.map((d) => (d.dayNumber === activeDay ? { ...d, roomTypeId } : d));
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
                Assign hotel stay and select room type (required) along with optional day
                notes.
              </p>
            </div>
          </div>

          <div className="space-y-4">
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

              {availableRoomTypes.length > 0 ? (
                <Select
                  label="Select Room Type *"
                  value={activeRoomTypeId}
                  onChange={(e) => {
                    updateActiveDayRoomType(e.target.value);
                  }}
                  icon={BedDouble}
                >
                  {availableRoomTypes.map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {rt.name} - ${String(rt.roomPrice)}/night ({String(rt.maxAdults)}{" "}
                      Adults
                      {rt.maxChildren > 0 ? `, ${String(rt.maxChildren)} Children` : ""})
                    </option>
                  ))}
                </Select>
              ) : (
                <div className="flex flex-col justify-center px-4 py-2.5 rounded-xl border border-app-border/40 bg-app-surface-variant/30 text-xs text-app-muted">
                  <span className="font-semibold text-app-fg">Room Type</span>
                  <span className="text-[11px] text-app-muted mt-0.5">
                    No specific room types configured for this hotel.
                  </span>
                </div>
              )}
            </div>

            <Textarea
              label="Day Notes / Instructions"
              rows={4}
              placeholder="e.g. Breakfast at hotel, sightseeing tours, transfer at 3 PM..."
              value={currentDayData.notes}
              onChange={(e) => {
                updateActiveDayNotes(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="flex justify-between pt-6 mt-6 border-t border-border">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <Button onClick={handleNextStep} className="gap-2">
            {nextButtonText}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
