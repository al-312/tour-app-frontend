"use client";

import * as React from "react";

import { calculateRoomAllocationLocal } from "@/features/hotels/utils/room-allocation.util";
import { useCalculateAllocationMutation } from "@/features/hotels/services/hotels-api.slice";

import type { DaySelectionState } from "./customize-day-card";
import type { Hotel } from "@/features/hotels/types/hotel.types";
import type { Package } from "@/features/packages/types/package.types";

interface UseCustomizeInquiryStateParams {
  pkg?: Package | undefined;
  allHotels: Hotel[];
  adults: number;
  setAdults: (n: number) => void;
}

export function useCustomizeInquiryState({
  pkg,
  allHotels,
  adults,
  setAdults,
}: UseCustomizeInquiryStateParams): {
  daySelections: Record<number, DaySelectionState>;
  handleAdultsChange: (newAdults: number) => void;
  handleHotelOrRoomTypeChange: (
    dayNumber: number,
    hotelId: string,
    roomTypeId: string
  ) => Promise<void>;
  totalCalculatedPackagePrice: number;
} {
  const [daySelections, setDaySelections] = React.useState<
    Record<number, DaySelectionState>
  >({});

  const [calculateAllocation] = useCalculateAllocationMutation();

  React.useEffect(() => {
    if (pkg?.packageDays && pkg.packageDays.length > 0) {
      const initialMap: Record<number, DaySelectionState> = {};
      pkg.packageDays.forEach((pd) => {
        const destId = pd.destinationId ?? pkg.destinationId ?? "";
        const defaultHotel = allHotels.find((h) => h.destinationId === destId);
        const defaultRoomType = defaultHotel?.roomTypes?.[0];

        const alloc = defaultRoomType
          ? calculateRoomAllocationLocal(adults, defaultRoomType)
          : { numberOfRooms: 0, numberOfExtraBeds: 0, calculatedTotal: 0 };

        initialMap[pd.dayNumber] = {
          dayNumber: pd.dayNumber,
          destinationId: destId,
          destinationName: pd.destination?.name ?? pkg.destination?.name ?? "Destination",
          hotelId: defaultHotel?.id ?? "",
          roomTypeId: defaultRoomType?.id ?? "",
          roomsCount: alloc.numberOfRooms,
          extraBedsCount: alloc.numberOfExtraBeds,
          calculatedPrice: alloc.calculatedTotal,
          notes: pd.notes ?? undefined,
        };
      });
      queueMicrotask(() => {
        setDaySelections(initialMap);
      });
    }
  }, [allHotels, pkg, adults]);

  const handleAdultsChange = (newAdults: number): void => {
    setAdults(newAdults);
    setDaySelections((prev) => {
      const updated: Record<number, DaySelectionState> = {};
      for (const [dayNumStr, daySel] of Object.entries(prev)) {
        const dayNum = Number(dayNumStr);
        if (!daySel.hotelId || !daySel.roomTypeId) {
          updated[dayNum] = daySel;
          continue;
        }
        const selectedHotel = allHotels.find((h) => h.id === daySel.hotelId);
        const selectedRoom = selectedHotel?.roomTypes?.find(
          (rt) => rt.id === daySel.roomTypeId
        );
        if (selectedRoom) {
          const alloc = calculateRoomAllocationLocal(newAdults, selectedRoom);
          updated[dayNum] = {
            ...daySel,
            roomsCount: alloc.numberOfRooms,
            extraBedsCount: alloc.numberOfExtraBeds,
            calculatedPrice: alloc.calculatedTotal,
          };
        } else {
          updated[dayNum] = daySel;
        }
      }
      return updated;
    });
  };

  const handleHotelOrRoomTypeChange = async (
    dayNumber: number,
    hotelId: string,
    roomTypeId: string
  ): Promise<void> => {
    const current = daySelections[dayNumber];
    if (!current) return;

    if (!hotelId || !roomTypeId) {
      setDaySelections((prev) => ({
        ...prev,
        [dayNumber]: {
          ...current,
          hotelId,
          roomTypeId,
          roomsCount: 0,
          extraBedsCount: 0,
          calculatedPrice: 0,
        },
      }));
      return;
    }

    try {
      const res = await calculateAllocation({
        hotelId,
        roomTypeId,
        adults,
        nights: 1,
      }).unwrap();
      setDaySelections((prev) => ({
        ...prev,
        [dayNumber]: {
          ...current,
          hotelId,
          roomTypeId,
          roomsCount: res.numberOfRooms,
          extraBedsCount: res.numberOfExtraBeds,
          calculatedPrice: res.calculatedTotal,
        },
      }));
    } catch {
      const selectedHotel = allHotels.find((h) => h.id === hotelId);
      const selectedRoom = selectedHotel?.roomTypes?.find((rt) => rt.id === roomTypeId);
      if (selectedRoom) {
        const alloc = calculateRoomAllocationLocal(adults, selectedRoom);
        setDaySelections((prev) => ({
          ...prev,
          [dayNumber]: {
            ...current,
            hotelId,
            roomTypeId,
            roomsCount: alloc.numberOfRooms,
            extraBedsCount: alloc.numberOfExtraBeds,
            calculatedPrice: alloc.calculatedTotal,
          },
        }));
      }
    }
  };

  const totalCalculatedPackagePrice = React.useMemo(() => {
    return Object.values(daySelections).reduce(
      (sum, item) => sum + item.calculatedPrice,
      0
    );
  }, [daySelections]);

  return {
    daySelections,
    handleAdultsChange,
    handleHotelOrRoomTypeChange,
    totalCalculatedPackagePrice,
  };
}
