"use client";

import * as React from "react";
import { MapPin, BedDouble } from "lucide-react";

import Card from "@/components/ui/card";

import type { Hotel } from "@/features/hotels/types/hotel.types";

export interface DaySelectionState {
  dayNumber: number;
  destinationId: string;
  destinationName: string;
  hotelId: string;
  roomTypeId: string;
  roomsCount: number;
  extraBedsCount: number;
  calculatedPrice: number;
  notes?: string | undefined;
}

interface CustomizeDayCardProps {
  dayNumber: number;
  notes?: string | undefined;
  destinationName?: string | undefined;
  dayDestinationId: string;
  mainDestinationName?: string | undefined;
  daySel: DaySelectionState;
  allHotels: Hotel[];
  initialAdults: number;
  onHotelOrRoomTypeChange: (
    dayNumber: number,
    hotelId: string,
    roomTypeId: string
  ) => Promise<void>;
}

export function CustomizeDayCard({
  dayNumber,
  notes,
  destinationName,
  dayDestinationId,
  mainDestinationName,
  daySel,
  allHotels,
  initialAdults,
  onHotelOrRoomTypeChange,
}: CustomizeDayCardProps): React.JSX.Element {
  const eligibleHotels = allHotels.filter((h) => h.destinationId === dayDestinationId);
  const selectedHotel = eligibleHotels.find((h) => h.id === daySel.hotelId);
  const eligibleRoomTypes = selectedHotel?.roomTypes ?? [];

  return (
    <Card className="p-6 border-app-border/80 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-app-border/40 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-app-brand/10 text-app-brand flex items-center justify-center font-bold text-xs">
            D{dayNumber}
          </div>
          <div>
            <span className="text-xs font-bold text-app-fg">Day {dayNumber}</span>
            <span className="text-[11px] text-app-muted block flex items-center gap-1">
              <MapPin className="w-3 h-3 text-app-brand" />
              {destinationName ?? mainDestinationName ?? "Main Destination"} (Read-Only)
            </span>
          </div>
        </div>

        {daySel.calculatedPrice > 0 && (
          <span className="text-xs font-bold text-app-brand bg-app-brand/10 px-2.5 py-1 rounded-full">
            +${daySel.calculatedPrice}/night
          </span>
        )}
      </div>

      {notes && (
        <p className="text-xs text-app-muted bg-app-surface-variant/40 p-2.5 rounded-xl italic">
          {notes}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-xs font-semibold text-app-fg mb-1">
            Hotel (Filtered by Day Destination)
          </label>
          <select
            value={daySel.hotelId}
            onChange={(e): void => {
              const newHotelId = e.target.value;
              const newHotel = eligibleHotels.find((h) => h.id === newHotelId);
              const firstRoomTypeId = newHotel?.roomTypes?.[0]?.id ?? "";
              void onHotelOrRoomTypeChange(dayNumber, newHotelId, firstRoomTypeId);
            }}
            className="w-full h-10 px-3 rounded-xl border border-app-border bg-app-surface text-xs text-app-fg focus:outline-none focus:border-app-brand"
          >
            <option value="">No Hotel (Optional Day)</option>
            {eligibleHotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.starRating}★)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-app-fg mb-1">
            Room Type
          </label>
          <select
            disabled={!daySel.hotelId}
            value={daySel.roomTypeId}
            onChange={(e): void => {
              void onHotelOrRoomTypeChange(dayNumber, daySel.hotelId, e.target.value);
            }}
            className="w-full h-10 px-3 rounded-xl border border-app-border bg-app-surface text-xs text-app-fg focus:outline-none focus:border-app-brand disabled:opacity-50"
          >
            <option value="">Select Room Type</option>
            {eligibleRoomTypes.map((rt) => (
              <option key={rt.id} value={rt.id}>
                {rt.name} (${rt.roomPrice}/night)
              </option>
            ))}
          </select>
        </div>
      </div>

      {daySel.hotelId && daySel.roomTypeId && (
        <div className="flex items-center gap-4 bg-app-brand/5 border border-app-brand/20 p-3 rounded-xl text-xs text-app-fg mt-1">
          <BedDouble className="w-4 h-4 text-app-brand flex-shrink-0" />
          <div className="flex-1 flex items-center justify-between">
            <span>
              Calculated Allocation for <strong>{initialAdults} Adults</strong>:
            </span>
            <span className="font-bold text-app-brand">
              {daySel.roomsCount} Room(s){" "}
              {daySel.extraBedsCount > 0
                ? `+ ${String(daySel.extraBedsCount)} Extra Bed`
                : ""}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
