import type { Booking, BookingStatus } from "../types/booking.types";

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "BKG-101",
    destination: "Northern Fjords Private Super-Yacht Voyage",
    clientName: "Lord Harrison",
    clientEmail: "harrison@luxuryvoyages.co.uk",
    startDate: "Oct 12, 2026",
    endDate: "Oct 20, 2026",
    amount: 68500,
    status: "CONFIRMED",
  },
  {
    id: "BKG-102",
    destination: "Kyoto Heritage Villa & Tea Ceremony Masterclass",
    clientName: "Dr. Evelyn Vance",
    clientEmail: "vance@vanceresearch.org",
    startDate: "Nov 02, 2026",
    endDate: "Nov 08, 2026",
    amount: 32000,
    status: "CONFIRMED",
  },
  {
    id: "BKG-103",
    destination: "Patagonia Heli-Skiing & Eco-Lodge Sanctuary",
    clientName: "Marcus Sterling",
    clientEmail: "m.sterling@sterlingcap.com",
    startDate: "Dec 15, 2026",
    endDate: "Dec 22, 2026",
    amount: 42000,
    status: "PENDING",
  },
];

export const STATUS_VARIANT_MAP: Record<
  BookingStatus,
  "emerald" | "amber" | "rose" | "muted"
> = {
  CONFIRMED: "emerald",
  COMPLETED: "emerald",
  PENDING: "amber",
  CANCELLED: "rose",
};
