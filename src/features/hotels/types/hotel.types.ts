import type { Destination } from "@/features/destinations/types/destination.types";

export interface Hotel {
  id: string;
  destinationId: string | null;
  destination?: Destination | null | undefined;
  name: string;
  starRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHotelRequest {
  name: string;
  destinationId?: string | undefined;
  starRating: number;
}

export interface UpdateHotelRequest {
  name?: string | undefined;
  destinationId?: string | null | undefined;
  starRating?: number | undefined;
}
