import type { Hotel } from "@/features/hotels/types/hotel.types";
import type { Client } from "@/features/clients/types/client.types";
import type { Consultant } from "@/features/consultants/types/consultant.types";
import type { Destination } from "@/features/destinations/types/destination.types";

export type PackageStatus = "CONFIRMED" | "CANCELLED";

export interface PackageDay {
  id: string;
  dayNumber: number;
  hotelId: string | null;
  hotel?: Hotel | null | undefined;
  notes?: string | undefined;
}

export interface Package {
  id: string;
  packageName: string;
  clientId: string | null;
  client?: Client | null | undefined;
  destinationId: string | null;
  destination?: Destination | null | undefined;
  consultantId: string | null;
  consultant?: Consultant | null | undefined;
  startDate?: string | null | undefined;
  numberOfDays: number;
  adults: number;
  children: number;
  status: PackageStatus;
  packageDays: PackageDay[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePackageDayInput {
  dayNumber: number;
  hotelId: string;
  notes?: string | undefined;
}

export interface CreatePackageRequest {
  packageName: string;
  clientId?: string | undefined;
  destinationId?: string | undefined;
  consultantId?: string | undefined;
  startDate?: string | undefined;
  numberOfDays: number;
  adults: number;
  children?: number | undefined;
  status?: PackageStatus | undefined;
  packageDays?: CreatePackageDayInput[] | undefined;
}

export interface UpdatePackageRequest {
  packageName?: string | undefined;
  clientId?: string | null | undefined;
  destinationId?: string | null | undefined;
  consultantId?: string | null | undefined;
  startDate?: string | null | undefined;
  numberOfDays?: number | undefined;
  adults?: number | undefined;
  children?: number | undefined;
  status?: PackageStatus | undefined;
  packageDays?: CreatePackageDayInput[] | undefined;
}
