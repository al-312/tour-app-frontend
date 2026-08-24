import { apiSlice } from "@/lib/api/client";
import { apiTransformer } from "@/lib/api/api-transformer";

import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
} from "../types/client.types";

const clientsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<Client[], undefined>({
      query: () => ({
        url: "/clients",
        method: "GET",
      }),
      transformResponse: apiTransformer.unwrapData<Client[]>,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Client" as const, id })),
              { type: "Client", id: "LIST" },
            ]
          : [{ type: "Client", id: "LIST" }],
    }),
    getClientById: builder.query<Client, string>({
      query: (id) => ({
        url: `/clients/${id}`,
        method: "GET",
      }),
      transformResponse: apiTransformer.unwrapData<Client>,
      providesTags: (_result, _error, id) => [{ type: "Client", id }],
    }),
    createClient: builder.mutation<Client, CreateClientRequest>({
      query: (data) => ({
        url: "/clients",
        method: "POST",
        body: data,
      }),
      transformResponse: apiTransformer.unwrapData<Client>,
      invalidatesTags: [{ type: "Client", id: "LIST" }],
    }),
    updateClient: builder.mutation<Client, { id: string; data: UpdateClientRequest }>({
      query: ({ id, data }) => ({
        url: `/clients/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: apiTransformer.unwrapData<Client>,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Client", id },
        { type: "Client", id: "LIST" },
      ],
    }),
    deleteClient: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/clients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Client", id },
        { type: "Client", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApiSlice;
