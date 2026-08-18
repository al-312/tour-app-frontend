import { apiSlice } from "@/lib/api/client";
import { apiTransformer } from "@/lib/api/api-transformer";

import type { Booking, BookingsQueryArgs } from "../types/booking.types";

const bookingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query<Booking[], BookingsQueryArgs | undefined>({
      query: (params) => ({
        url: "/bookings",
        ...(params ? { params: { ...params } } : {}),
      }),
      transformResponse: apiTransformer.unwrapData<Booking[]>,
      providesTags: ["Bookings"],
    }),
  }),
});

export const { useGetBookingsQuery } = bookingsApiSlice;
