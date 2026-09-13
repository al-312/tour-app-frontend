import { apiSlice } from "@/lib/api/client";
import { apiTransformer } from "@/lib/api/api-transformer";

import type {
  Package,
  CreatePackageRequest,
  SearchPackagesParams,
} from "../types/package.types";

const packagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPackages: builder.query<Package[], string | undefined>({
      query: (status) => ({
        url: status ? `/packages?status=${status}` : "/packages",
        method: "GET",
      }),
      transformResponse: apiTransformer.unwrapData<Package[]>,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Package" as const, id })),
              { type: "Package", id: "LIST" },
            ]
          : [{ type: "Package", id: "LIST" }],
    }),
    searchPackages: builder.query<Package[], SearchPackagesParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.destination) searchParams.append("destination", params.destination);
        if (params.travelDate) searchParams.append("travelDate", params.travelDate);
        if (params.days) searchParams.append("days", params.days.toString());
        if (params.adults) searchParams.append("adults", params.adults.toString());
        if (params.children) searchParams.append("children", params.children.toString());

        return {
          url: `/packages/search?${searchParams.toString()}`,
          method: "GET",
        };
      },
      transformResponse: apiTransformer.unwrapData<Package[]>,
      providesTags: [{ type: "Package", id: "LIST" }],
    }),
    getPackageById: builder.query<Package, string>({
      query: (id) => ({
        url: `/packages/${id}`,
        method: "GET",
      }),
      transformResponse: apiTransformer.unwrapData<Package>,
      providesTags: (_result, _error, id) => [{ type: "Package", id }],
    }),
    createPackage: builder.mutation<Package, CreatePackageRequest>({
      query: (data) => ({
        url: "/packages",
        method: "POST",
        body: data,
      }),
      transformResponse: apiTransformer.unwrapData<Package>,
      invalidatesTags: [{ type: "Package", id: "LIST" }],
    }),
    updatePackage: builder.mutation<
      Package,
      { id: string; data: Partial<CreatePackageRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/packages/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: apiTransformer.unwrapData<Package>,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Package", id },
        { type: "Package", id: "LIST" },
      ],
    }),
    deletePackage: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/packages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Package", id },
        { type: "Package", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetPackagesQuery,
  useSearchPackagesQuery,
  useGetPackageByIdQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packagesApiSlice;
