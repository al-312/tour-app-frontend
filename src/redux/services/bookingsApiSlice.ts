import { apiSlice } from "./apiSlice";

import type { Booking } from "@/app/bookings/types/booking";

const bookingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query<Booking[], undefined>({
      queryFn() {
        const bookings: Booking[] = [
          {
            id: "B-2901",
            excursion: "The Nordic Nocturne",
            client: "Alex Robinson",
            date: "Aug 12, 2026",
            amount: "$142,500",
            status: "confirmed",
          },
          {
            id: "B-2902",
            excursion: "Kyoto Art Private Tour",
            client: "Eleanor V.",
            date: "Sep 02, 2026",
            amount: "$48,250",
            status: "confirmed",
          },
          {
            id: "B-2903",
            excursion: "Patagonia helicopter Lodge",
            client: "Marcus T.",
            date: "Oct 18, 2026",
            amount: "$18,990",
            status: "pending",
          },
          {
            id: "B-2904",
            excursion: "Balinese Luxury Villa Escape",
            client: "Sarah Jenkins",
            date: "Nov 05, 2026",
            amount: "$22,400",
            status: "confirmed",
          },
          {
            id: "B-2905",
            excursion: "Swiss Alps Private Helicopter",
            client: "David Miller",
            date: "Dec 10, 2026",
            amount: "$75,000",
            status: "cancelled",
          },
        ];
        return { data: bookings };
      },
      providesTags: ["Bookings"],
    }),
    createBooking: builder.mutation<Booking, Omit<Booking, "id">>({
      queryFn(newBooking) {
        const randomNumber = String(Math.floor(1000 + Math.random() * 9000));
        const created: Booking = {
          ...newBooking,
          id: `B-${randomNumber}`,
        };
        return { data: created };
      },
      invalidatesTags: ["Bookings"],
    }),
  }),
});

export const { useGetBookingsQuery, useCreateBookingMutation } = bookingsApiSlice;
