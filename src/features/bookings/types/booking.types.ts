export type BookingStatus = "CONFIRMED" | "PENDING" | "CANCELLED" | "COMPLETED";

export interface Booking {
  id: string;
  destination: string;
  clientName: string;
  clientEmail?: string | undefined;
  startDate: string;
  endDate: string;
  amount: number;
  currency?: string | undefined;
  status: BookingStatus;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

export interface BookingsQueryArgs {
  status?: BookingStatus | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}
