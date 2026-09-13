"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Calendar,
  Hotel as HotelIcon,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";

import Card from "@/components/ui/card";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";

import { DayHeaderTabs } from "./day-header-tabs";
import { validateStep2Data } from "../../utils/package-builder-validation";

import type { Hotel } from "@/features/hotels/types/hotel.types";
import type { Destination } from "@/features/destinations/types/destination.types";

export interface DayItineraryItem {
  dayNumber: number;
  destinationId?: string | undefined;
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
  destinations?: Destination[] | undefined;
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
  destinations = [],
  hotels,
  onBack,
  onNext,
  nextButtonText = "Next: Consultant & Travelers",
}: Step2ItineraryProps): React.JSX.Element {
  const [touched, setTouched] = React.useState(false);

  const validation = validateStep2Data(daysData, numberOfDays);

  const currentDayData = daysData.find((d) => d.dayNumber === activeDay) ?? {
    dayNumber: activeDay,
    destinationId: "",
    hotelId: "",
    notes: "",
  };

  const activeDestinationId = currentDayData.destinationId ?? "";

  const availableHotelsForDay = React.useMemo(() => {
    if (!activeDestinationId) return [];
    return hotels.filter((h) => h.destinationId === activeDestinationId);
  }, [hotels, activeDestinationId]);

  const defaultHotelId = availableHotelsForDay[0]?.id ?? "";
  const activeHotelId =
    activeDestinationId &&
    availableHotelsForDay.some((h) => h.id === currentDayData.hotelId)
      ? currentDayData.hotelId
      : defaultHotelId;

  const selectedHotel = React.useMemo(
    () => hotels.find((h) => h.id === activeHotelId),
    [hotels, activeHotelId]
  );

  const availableRoomTypes = React.useMemo(
    () => selectedHotel?.roomTypes ?? [],
    [selectedHotel]
  );

  const activeRoomTypeId = currentDayData.roomTypeId ?? availableRoomTypes[0]?.id ?? "";

  const updateActiveDayDestination = (destId: string): void => {
    const destHotels = destId ? hotels.filter((h) => h.destinationId === destId) : [];
    const newHotelId = destHotels[0]?.id ?? "";
    const newHotel = destHotels.find((h) => h.id === newHotelId);
    const newRoomTypeId = newHotel?.roomTypes?.[0]?.id;

    setDaysData((prev) =>
      prev.map((d) =>
        d.dayNumber === activeDay
          ? {
              ...d,
              destinationId: destId,
              hotelId: newHotelId,
              roomTypeId: newRoomTypeId,
            }
          : d
      )
    );
  };

  const updateActiveDayHotel = (hotelId: string): void => {
    const newHotel = hotels.find((h) => h.id === hotelId);
    const defaultRoomTypeId = newHotel?.roomTypes?.[0]?.id;

    setDaysData((prev) =>
      prev.map((d) =>
        d.dayNumber === activeDay ? { ...d, hotelId, roomTypeId: defaultRoomTypeId } : d
      )
    );
  };

  const updateActiveDayRoomType = (roomTypeId: string): void => {
    setDaysData((prev) =>
      prev.map((d) => (d.dayNumber === activeDay ? { ...d, roomTypeId } : d))
    );
  };

  const updateActiveDayNotes = (notes: string): void => {
    setDaysData((prev) =>
      prev.map((d) => (d.dayNumber === activeDay ? { ...d, notes } : d))
    );
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
                Day {String(activeDay)} Destination & Accommodation
              </h2>
              <p className="text-xs text-muted-foreground">
                Select destination location, assign hotel stay, and set room type & notes.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Day Destination *"
                value={activeDestinationId}
                error={
                  touched && !activeDestinationId
                    ? "Destination is required for each itinerary day"
                    : undefined
                }
                onChange={(e) => {
                  updateActiveDayDestination(e.target.value);
                }}
                icon={MapPin}
              >
                <option value="">Select destination...</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.country})
                  </option>
                ))}
              </Select>

              <Select
                label="Hotel Accommodation *"
                value={activeHotelId}
                disabled={!activeDestinationId}
                error={
                  touched && !activeHotelId
                    ? !activeDestinationId
                      ? "Select destination first"
                      : "Hotel is required"
                    : undefined
                }
                onChange={(e) => {
                  updateActiveDayHotel(e.target.value);
                }}
                icon={HotelIcon}
              >
                {!activeDestinationId ? (
                  <option value="">Select destination first...</option>
                ) : availableHotelsForDay.length === 0 ? (
                  <option value="">No hotels available for this destination</option>
                ) : (
                  availableHotelsForDay.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({String(h.starRating)} Stars)
                    </option>
                  ))
                )}
              </Select>

              {!activeDestinationId ? (
                <div className="flex flex-col justify-center px-4 py-2.5 rounded-xl border border-app-border/40 bg-app-surface-variant/30 text-xs text-app-muted">
                  <span className="font-semibold text-app-fg">Room Type</span>
                  <span className="text-[11px] text-app-muted mt-0.5">
                    Select destination & hotel first.
                  </span>
                </div>
              ) : availableRoomTypes.length > 0 ? (
                <Select
                  label="Room Type *"
                  value={activeRoomTypeId}
                  onChange={(e) => {
                    updateActiveDayRoomType(e.target.value);
                  }}
                  icon={BedDouble}
                >
                  {availableRoomTypes.map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {rt.name} - ${String(rt.roomPrice)}/night
                    </option>
                  ))}
                </Select>
              ) : (
                <div className="flex flex-col justify-center px-4 py-2.5 rounded-xl border border-app-border/40 bg-app-surface-variant/30 text-xs text-app-muted">
                  <span className="font-semibold text-app-fg">Room Type</span>
                  <span className="text-[11px] text-app-muted mt-0.5">
                    No specific room types configured.
                  </span>
                </div>
              )}
            </div>

            <Textarea
              label="Day Notes / Instructions"
              rows={4}
              placeholder="e.g. Arrival in destination, city tour, resort check-in..."
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
