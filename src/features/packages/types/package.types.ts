import type { Hotel } from "@/features/hotels/types/hotel.types";
import type { Client } from "@/features/clients/types/client.types";
import type { Consultant } from "@/features/consultants/types/consultant.types";
import type { Destination } from "@/features/destinations/types/destination.types";

export type PackageStatus = "DRAFT" | "ACTIVE" | "INACTIVE" | "CONFIRMED" | "CANCELLED";

export interface PackageDay {
  id: string;
  dayNumber: number;
  destinationId?: string | null;
  destination?: Destination | null;
  hotelId: string | null;
  hotel?: Hotel | null;
  roomTypeId?: string | null;
  sortOrder?: number;
  notes?: string;
}

export interface Package {
  id: string;
  packageName: string;
  source: string;
  destinationId: string | null;
  destination?: Destination | null;
  durationDays: number;
  numberOfDays?: number;
  fromDatetimeUtc?: string | null;
  toDatetimeUtc?: string | null;
  summary?: string;
  startingPrice?: number;
  clientId?: string | null;
  client?: Client | null;
  consultantId?: string | null;
  consultant?: Consultant | null;
  startDate?: string | null;
  adults?: number;
  children?: number;
  status: PackageStatus;
  packageDays: PackageDay[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePackageDayInput {
  dayNumber: number;
  destinationId?: string;
  hotelId?: string;
  roomTypeId?: string;
  notes?: string;
}

export interface CreatePackageRequest {
  packageName: string;
  source: string;
  destinationId: string;
  clientId?: string | undefined;
  durationDays: number;
  adults?: number | undefined;
  children?: number | undefined;
  fromDatetimeUtc?: string | undefined;
  toDatetimeUtc?: string | undefined;
  summary?: string | undefined;
  startingPrice?: number | undefined;
  status?: string | undefined;
  packageDays?: CreatePackageDayInput[] | undefined;
}

export interface SearchPackagesParams {
  destinationId?: string;
  source?: string;
  travelDate?: string;
  days?: number;
  adults?: number;
  children?: number;
}
