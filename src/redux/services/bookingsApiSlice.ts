import { apiSlice } from "./apiSlice";

import type { Booking } from "@/types/booking";

const MOCK_BOOKINGS: Booking[] = [
  {
    id: "B-9842",
    excursion: "Nordic Fjords Private Superyacht",
    client: "Eleanor Vance",
    date: "2026-09-12",
    amount: "$24,500",
    status: "confirmed",
  },
  {
    id: "B-9843",
    excursion: "Serengeti Helicopter & Safari Lodge",
    client: "Marcus Thorne",
    date: "2026-09-18",
    amount: "$18,200",
    status: "confirmed",
  },
  {
    id: "B-9844",
    excursion: "Kyoto Temple Garden Private Tea",
    client: "Sophia Chen",
    date: "2026-10-02",
    amount: "$9,800",
    status: "pending",
  },
  {
    id: "B-9845",
    excursion: "Amalfi Coast Yacht & Villa",
    client: "Julian Rossi",
    date: "2026-10-14",
    amount: "$15,400",
    status: "confirmed",
  },
  {
    id: "B-9846",
    excursion: "Patagonian Glaciers Charter",
    client: "Amara Okezie",
    date: "2026-11-01",
    amount: "$21,000",
    status: "cancelled",
  },
];

const bookingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query<Booking[], undefined>({
      queryFn: () => {
        return { data: MOCK_BOOKINGS };
      },
      providesTags: ["Bookings"],
    }),
    createBooking: builder.mutation<Booking, Omit<Booking, "id">>({
      queryFn: (newBooking) => {
        const randNum = String(Math.floor(1000 + Math.random() * 9000));
        const created: Booking = {
          ...newBooking,
          id: `B-${randNum}`,
        };
        MOCK_BOOKINGS.unshift(created);
        return { data: created };
      },
      invalidatesTags: ["Bookings"],
    }),
  }),
});

export const { useGetBookingsQuery, useCreateBookingMutation } = bookingsApiSlice;
