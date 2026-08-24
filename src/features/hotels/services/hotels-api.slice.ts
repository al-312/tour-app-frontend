import { apiSlice } from "@/lib/api/client";
import { apiTransformer } from "@/lib/api/api-transformer";

import type { Hotel, CreateHotelRequest, UpdateHotelRequest } from "../types/hotel.types";

const hotelsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHotels: builder.query<Hotel[], string | undefined>({
      query: (destinationId) => ({
        url: destinationId ? `/hotels?destinationId=${destinationId}` : "/hotels",
        method: "GET",
      }),
      transformResponse: apiTransformer.unwrapData<Hotel[]>,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Hotel" as const, id })),
              { type: "Hotel", id: "LIST" },
            ]
          : [{ type: "Hotel", id: "LIST" }],
    }),
    getHotelById: builder.query<Hotel, string>({
      query: (id) => ({
        url: `/hotels/${id}`,
        method: "GET",
      }),
      transformResponse: apiTransformer.unwrapData<Hotel>,
      providesTags: (_result, _error, id) => [{ type: "Hotel", id }],
    }),
    createHotel: builder.mutation<Hotel, CreateHotelRequest>({
      query: (data) => ({
        url: "/hotels",
        method: "POST",
        body: data,
      }),
      transformResponse: apiTransformer.unwrapData<Hotel>,
      invalidatesTags: [{ type: "Hotel", id: "LIST" }],
    }),
    updateHotel: builder.mutation<Hotel, { id: string; data: UpdateHotelRequest }>({
      query: ({ id, data }) => ({
        url: `/hotels/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: apiTransformer.unwrapData<Hotel>,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Hotel", id },
        { type: "Hotel", id: "LIST" },
      ],
    }),
    deleteHotel: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/hotels/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Hotel", id },
        { type: "Hotel", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelByIdQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
} = hotelsApiSlice;
