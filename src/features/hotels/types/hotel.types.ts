import type { Destination } from "@/features/destinations/types/destination.types";

export interface RoomType {
  id: string;
  hotelId?: string | undefined;
  name: string;
  roomPrice: number;
  maxAdults: number;
  maxChildren: number;
  extraBedAvailable: boolean;
  extraBedPrice: number;
  maxExtraBeds: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Hotel {
  id: string;
  destinationId: string | null;
  destination?: Destination | null | undefined;
  name: string;
  address?: string;
  description?: string;
  starRating: number;
  status?: string;
  roomTypes?: RoomType[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateHotelRequest {
  name: string;
  destinationId?: string | undefined;
  address?: string;
  description?: string;
  starRating: number;
  status?: string;
  roomTypeIds?: string[] | undefined;
}

export interface UpdateHotelRequest {
  name?: string | undefined;
  destinationId?: string | null | undefined;
  address?: string;
  description?: string;
  starRating?: number | undefined;
  status?: string;
  roomTypeIds?: string[] | undefined;
}

export interface CreateRoomTypeRequest {
  name: string;
  roomPrice: number;
  maxAdults: number;
  maxChildren?: number;
  extraBedAvailable?: boolean;
  extraBedPrice?: number;
  maxExtraBeds?: number;
  hotelId?: string | undefined;
}
