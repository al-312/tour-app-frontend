"use client";

import * as React from "react";

import { calculateRoomAllocationLocal } from "@/features/hotels/utils/room-allocation.util";
import { useCalculateAllocationMutation } from "@/features/hotels/services/hotels-api.slice";

import type { DaySelectionState } from "./customize-day-card";
import type { Hotel } from "@/features/hotels/types/hotel.types";
import type { Package } from "@/features/packages/types/package.types";
import type { Destination } from "@/features/destinations/types/destination.types";

interface UseCustomizeInquiryStateParams {
  pkg?: Package | undefined;
  allHotels: Hotel[];
  destinations: Destination[];
  adults: number;
  setAdults: (n: number) => void;
}

export function useCustomizeInquiryState({
  pkg,
  allHotels,
  destinations,
  adults,
  setAdults,
}: UseCustomizeInquiryStateParams): {
  daySelections: Record<number, DaySelectionState>;
  handleAdultsChange: (newAdults: number) => void;
  handleDestinationChange: (dayNumber: number, destinationId: string) => void;
  handleHotelOrRoomTypeChange: (
    dayNumber: number,
    hotelId: string,
    roomTypeId: string
  ) => Promise<void>;
  handleRoomsOrBedsChange: (
    dayNumber: number,
    roomsCount: number,
    extraBedsCount: number
  ) => void;
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
        const destId = pd.destinationId ?? "";
        const destObj = destinations.find((d) => d.id === destId) ?? pd.destination;
        const destName = destObj ? `${destObj.name} (${destObj.country})` : "Destination";

        const defaultHotel = allHotels.find((h) => h.destinationId === destId);
        const defaultRoomType = defaultHotel?.roomTypes?.[0];

        const alloc = defaultRoomType
          ? calculateRoomAllocationLocal(Math.max(1, adults), defaultRoomType)
          : { numberOfRooms: 0, numberOfExtraBeds: 0, calculatedTotal: 0 };

        initialMap[pd.dayNumber] = {
          dayNumber: pd.dayNumber,
          destinationId: destId,
          destinationName: destName,
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
  }, [allHotels, destinations, pkg, adults]);

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
          const alloc = calculateRoomAllocationLocal(
            Math.max(1, newAdults),
            selectedRoom
          );
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

  const handleDestinationChange = (dayNumber: number, newDestinationId: string): void => {
    const current = daySelections[dayNumber];
    if (!current) return;

    const newDest = destinations.find((d) => d.id === newDestinationId);
    const newDestName = newDest ? `${newDest.name} (${newDest.country})` : "Destination";

    const eligibleHotels = allHotels.filter((h) => h.destinationId === newDestinationId);
    const defaultHotel = eligibleHotels[0];
    const defaultRoomType = defaultHotel?.roomTypes?.[0];

    const alloc = defaultRoomType
      ? calculateRoomAllocationLocal(Math.max(1, adults), defaultRoomType)
      : { numberOfRooms: 0, numberOfExtraBeds: 0, calculatedTotal: 0 };

    setDaySelections((prev) => ({
      ...prev,
      [dayNumber]: {
        ...current,
        destinationId: newDestinationId,
        destinationName: newDestName,
        hotelId: defaultHotel?.id ?? "",
        roomTypeId: defaultRoomType?.id ?? "",
        roomsCount: alloc.numberOfRooms,
        extraBedsCount: alloc.numberOfExtraBeds,
        calculatedPrice: alloc.calculatedTotal,
      },
    }));
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
        adults: Math.max(1, adults),
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
        const alloc = calculateRoomAllocationLocal(Math.max(1, adults), selectedRoom);
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

  const handleRoomsOrBedsChange = (
    dayNumber: number,
    roomsCount: number,
    extraBedsCount: number
  ): void => {
    const current = daySelections[dayNumber];
    if (!current?.hotelId || !current.roomTypeId) return;

    const selectedHotel = allHotels.find((h) => h.id === current.hotelId);
    const selectedRoom = selectedHotel?.roomTypes?.find(
      (rt) => rt.id === current.roomTypeId
    );

    const roomPrice = selectedRoom?.roomPrice ?? 0;
    const extraBedPrice = selectedRoom?.extraBedPrice ?? 0;
    const calculatedPrice = roomsCount * roomPrice + extraBedsCount * extraBedPrice;

    setDaySelections((prev) => ({
      ...prev,
      [dayNumber]: {
        ...current,
        roomsCount,
        extraBedsCount,
        calculatedPrice,
      },
    }));
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
    handleDestinationChange,
    handleHotelOrRoomTypeChange,
    handleRoomsOrBedsChange,
    totalCalculatedPackagePrice,
  };
}
