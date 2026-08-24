import { apiSlice } from "@/lib/api/client";
import { apiTransformer } from "@/lib/api/api-transformer";

import type {
  Consultant,
  CreateConsultantRequest,
  UpdateConsultantRequest,
} from "../types/consultant.types";

const consultantsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConsultants: builder.query<Consultant[], undefined>({
      query: () => ({
        url: "/consultants",
        method: "GET",
      }),
      transformResponse: apiTransformer.unwrapData<Consultant[]>,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Consultant" as const, id })),
              { type: "Consultant", id: "LIST" },
            ]
          : [{ type: "Consultant", id: "LIST" }],
    }),
    getConsultantById: builder.query<Consultant, string>({
      query: (id) => ({
        url: `/consultants/${id}`,
        method: "GET",
      }),
      transformResponse: apiTransformer.unwrapData<Consultant>,
      providesTags: (_result, _error, id) => [{ type: "Consultant", id }],
    }),
    createConsultant: builder.mutation<Consultant, CreateConsultantRequest>({
      query: (data) => ({
        url: "/consultants",
        method: "POST",
        body: data,
      }),
      transformResponse: apiTransformer.unwrapData<Consultant>,
      invalidatesTags: [{ type: "Consultant", id: "LIST" }],
    }),
    updateConsultant: builder.mutation<
      Consultant,
      { id: string; data: UpdateConsultantRequest }
    >({
      query: ({ id, data }) => ({
        url: `/consultants/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: apiTransformer.unwrapData<Consultant>,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Consultant", id },
        { type: "Consultant", id: "LIST" },
      ],
    }),
    deleteConsultant: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/consultants/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Consultant", id },
        { type: "Consultant", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetConsultantsQuery,
  useGetConsultantByIdQuery,
  useCreateConsultantMutation,
  useUpdateConsultantMutation,
  useDeleteConsultantMutation,
} = consultantsApiSlice;
