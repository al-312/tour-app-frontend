import { apiSlice } from "@/lib/api/client";
import { apiTransformer } from "@/lib/api/api-transformer";

import type {
  Package,
  PackageStatus,
  CreatePackageRequest,
  UpdatePackageRequest,
} from "../types/package.types";

const packagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPackages: builder.query<Package[], PackageStatus | undefined>({
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
    updatePackage: builder.mutation<Package, { id: string; data: UpdatePackageRequest }>({
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
  useGetPackageByIdQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packagesApiSlice;
