import { apiSlice } from "@/lib/api/client";
import { apiTransformer } from "@/lib/api/api-transformer";

import type {
  Destination,
  CreateDestinationRequest,
  UpdateDestinationRequest,
} from "../types/destination.types";

const destinationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDestinations: builder.query<Destination[], undefined>({
      query: () => ({
        url: "/destinations",
        method: "GET",
      }),
      transformResponse: apiTransformer.unwrapData<Destination[]>,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Destination" as const, id })),
              { type: "Destination", id: "LIST" },
            ]
          : [{ type: "Destination", id: "LIST" }],
    }),
    getDestinationById: builder.query<Destination, string>({
      query: (id) => ({
        url: `/destinations/${id}`,
        method: "GET",
      }),
      transformResponse: apiTransformer.unwrapData<Destination>,
      providesTags: (_result, _error, id) => [{ type: "Destination", id }],
    }),
    createDestination: builder.mutation<Destination, CreateDestinationRequest>({
      query: (data) => ({
        url: "/destinations",
        method: "POST",
        body: data,
      }),
      transformResponse: apiTransformer.unwrapData<Destination>,
      invalidatesTags: [{ type: "Destination", id: "LIST" }],
    }),
    updateDestination: builder.mutation<
      Destination,
      { id: string; data: UpdateDestinationRequest }
    >({
      query: ({ id, data }) => ({
        url: `/destinations/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: apiTransformer.unwrapData<Destination>,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Destination", id },
        { type: "Destination", id: "LIST" },
      ],
    }),
    deleteDestination: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/destinations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Destination", id },
        { type: "Destination", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetDestinationsQuery,
  useGetDestinationByIdQuery,
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
  useDeleteDestinationMutation,
} = destinationsApiSlice;
