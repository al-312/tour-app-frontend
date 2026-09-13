"use client";

import * as React from "react";
import { MapPin, BedDouble, Plus, Minus } from "lucide-react";

import Card from "@/components/ui/card";

import type { Hotel } from "@/features/hotels/types/hotel.types";
import type { Destination } from "@/features/destinations/types/destination.types";

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
  daySel: DaySelectionState;
  destinations: Destination[];
  allHotels: Hotel[];
  initialAdults: number;
  onDestinationChange: (dayNumber: number, destinationId: string) => void;
  onHotelOrRoomTypeChange: (
    dayNumber: number,
    hotelId: string,
    roomTypeId: string
  ) => Promise<void>;
  onRoomsOrBedsChange: (
    dayNumber: number,
    roomsCount: number,
    extraBedsCount: number
  ) => void;
}

export function CustomizeDayCard({
  dayNumber,
  notes,
  daySel,
  destinations,
  allHotels,
  initialAdults,
  onDestinationChange,
  onHotelOrRoomTypeChange,
  onRoomsOrBedsChange,
}: CustomizeDayCardProps): React.JSX.Element {
  const eligibleHotels = allHotels.filter(
    (h) => h.destinationId === daySel.destinationId
  );
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
              {daySel.destinationName || "Destination"}
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div>
          <label className="block text-xs font-semibold text-app-fg mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-app-brand" />
            Destination
          </label>
          <select
            value={daySel.destinationId}
            onChange={(e): void => {
              onDestinationChange(dayNumber, e.target.value);
            }}
            className="w-full h-10 px-3 rounded-xl border border-app-border bg-app-surface text-xs text-app-fg focus:outline-none focus:border-app-brand"
          >
            <option value="" disabled>
              Select Destination
            </option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.country})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-app-fg mb-1">
            Hotel (Filtered by Destination)
          </label>
          <select
            disabled={!daySel.destinationId}
            value={daySel.hotelId}
            onChange={(e): void => {
              const newHotelId = e.target.value;
              const newHotel = eligibleHotels.find((h) => h.id === newHotelId);
              const firstRoomTypeId = newHotel?.roomTypes?.[0]?.id ?? "";
              void onHotelOrRoomTypeChange(dayNumber, newHotelId, firstRoomTypeId);
            }}
            className="w-full h-10 px-3 rounded-xl border border-app-border bg-app-surface text-xs text-app-fg focus:outline-none focus:border-app-brand disabled:opacity-50"
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-app-brand/5 border border-app-brand/20 p-4 rounded-2xl text-xs text-app-fg mt-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-app-brand/10 text-app-brand flex items-center justify-center font-bold">
              <BedDouble className="w-4 h-4 text-app-brand" />
            </div>
            <div>
              <span className="font-bold text-app-fg block">
                Room & Extra Bed Allocation ({initialAdults} Adults)
              </span>
              <span className="text-[11px] text-app-muted">
                Adjust rooms or extra beds below to add or customize room allocation.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-app-fg">Rooms:</label>
              <div className="flex items-center rounded-xl border border-app-border bg-app-surface overflow-hidden">
                <button
                  type="button"
                  onClick={(): void => {
                    const currentRooms = daySel.roomsCount === 0 ? 1 : daySel.roomsCount;
                    onRoomsOrBedsChange(
                      dayNumber,
                      Math.max(1, currentRooms - 1),
                      daySel.extraBedsCount
                    );
                  }}
                  disabled={daySel.roomsCount <= 1}
                  className="w-8 h-9 flex items-center justify-center text-app-fg hover:bg-app-surface-variant disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min={1}
                  value={daySel.roomsCount === 0 ? 1 : daySel.roomsCount}
                  onChange={(e): void => {
                    const val = parseInt(e.target.value, 10);
                    onRoomsOrBedsChange(
                      dayNumber,
                      Number.isNaN(val) ? 1 : Math.max(1, val),
                      daySel.extraBedsCount
                    );
                  }}
                  className="w-12 h-9 text-xs font-bold text-app-fg text-center focus:outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={(): void => {
                    const currentRooms = daySel.roomsCount === 0 ? 1 : daySel.roomsCount;
                    onRoomsOrBedsChange(
                      dayNumber,
                      currentRooms + 1,
                      daySel.extraBedsCount
                    );
                  }}
                  className="w-8 h-9 flex items-center justify-center text-app-fg hover:bg-app-surface-variant transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-app-fg">Extra Beds:</label>
              <div className="flex items-center rounded-xl border border-app-border bg-app-surface overflow-hidden">
                <button
                  type="button"
                  onClick={(): void => {
                    onRoomsOrBedsChange(
                      dayNumber,
                      daySel.roomsCount,
                      Math.max(0, daySel.extraBedsCount - 1)
                    );
                  }}
                  disabled={daySel.extraBedsCount <= 0}
                  className="w-8 h-9 flex items-center justify-center text-app-fg hover:bg-app-surface-variant disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min={0}
                  value={daySel.extraBedsCount}
                  onChange={(e): void => {
                    const val = parseInt(e.target.value, 10);
                    onRoomsOrBedsChange(
                      dayNumber,
                      daySel.roomsCount,
                      Number.isNaN(val) ? 0 : Math.max(0, val)
                    );
                  }}
                  className="w-12 h-9 text-xs font-bold text-app-fg text-center focus:outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={(): void => {
                    onRoomsOrBedsChange(
                      dayNumber,
                      daySel.roomsCount,
                      daySel.extraBedsCount + 1
                    );
                  }}
                  className="w-8 h-9 flex items-center justify-center text-app-fg hover:bg-app-surface-variant transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
