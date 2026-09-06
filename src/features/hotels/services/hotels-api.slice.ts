import { apiSlice } from "@/lib/api/client";
import { apiTransformer } from "@/lib/api/api-transformer";

import type {
  Hotel,
  RoomType,
  CreateHotelRequest,
  UpdateHotelRequest,
  CreateRoomTypeRequest,
} from "../types/hotel.types";

export interface RoomAllocationResponse {
  numberOfRooms: number;
  numberOfExtraBeds: number;
  roomPrice: number;
  extraBedPrice: number;
  nights: number;
  perNightTotal: number;
  calculatedTotal: number;
}

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

    // Independent Room Types Master Catalog Endpoints
    getRoomTypes: builder.query<RoomType[], undefined>({
      query: () => ({
        url: "/hotels/room-types",
        method: "GET",
      }),
      transformResponse: apiTransformer.unwrapData<RoomType[]>,
      providesTags: [{ type: "Hotel", id: "LIST" }],
    }),
    createIndependentRoomType: builder.mutation<RoomType, CreateRoomTypeRequest>({
      query: (data) => ({
        url: "/hotels/room-types",
        method: "POST",
        body: data,
      }),
      transformResponse: apiTransformer.unwrapData<RoomType>,
      invalidatesTags: [{ type: "Hotel", id: "LIST" }],
    }),
    updateIndependentRoomType: builder.mutation<
      RoomType,
      { id: string; data: Partial<CreateRoomTypeRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/hotels/room-types/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: apiTransformer.unwrapData<RoomType>,
      invalidatesTags: [{ type: "Hotel", id: "LIST" }],
    }),
    deleteIndependentRoomType: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/hotels/room-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Hotel", id: "LIST" }],
    }),

    // Hotel-specific Room Types Endpoints (Backward compatibility)
    createRoomType: builder.mutation<
      RoomType,
      { hotelId: string; data: CreateRoomTypeRequest }
    >({
      query: ({ hotelId, data }) => ({
        url: `/hotels/room-types?hotelId=${hotelId}`,
        method: "POST",
        body: data,
      }),
      transformResponse: apiTransformer.unwrapData<RoomType>,
      invalidatesTags: (_res, _err, { hotelId }) => [
        { type: "Hotel", id: hotelId },
        { type: "Hotel", id: "LIST" },
      ],
    }),
    updateRoomType: builder.mutation<
      RoomType,
      { hotelId: string; roomTypeId: string; data: Partial<CreateRoomTypeRequest> }
    >({
      query: ({ roomTypeId, data }) => ({
        url: `/hotels/room-types/${roomTypeId}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: apiTransformer.unwrapData<RoomType>,
      invalidatesTags: (_res, _err, { hotelId }) => [
        { type: "Hotel", id: hotelId },
        { type: "Hotel", id: "LIST" },
      ],
    }),
    deleteRoomType: builder.mutation<
      { message: string },
      { hotelId: string; roomTypeId: string }
    >({
      query: ({ roomTypeId }) => ({
        url: `/hotels/room-types/${roomTypeId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, { hotelId }) => [
        { type: "Hotel", id: hotelId },
        { type: "Hotel", id: "LIST" },
      ],
    }),
    calculateAllocation: builder.mutation<
      RoomAllocationResponse,
      { hotelId: string; roomTypeId: string; adults: number; nights?: number }
    >({
      query: ({ hotelId, ...body }) => ({
        url: `/hotels/${hotelId}/calculate-allocation`,
        method: "POST",
        body,
      }),
      transformResponse: apiTransformer.unwrapData<RoomAllocationResponse>,
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelByIdQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
  useGetRoomTypesQuery,
  useCreateIndependentRoomTypeMutation,
  useUpdateIndependentRoomTypeMutation,
  useDeleteIndependentRoomTypeMutation,
  useCreateRoomTypeMutation,
  useUpdateRoomTypeMutation,
  useDeleteRoomTypeMutation,
  useCalculateAllocationMutation,
} = hotelsApiSlice;
