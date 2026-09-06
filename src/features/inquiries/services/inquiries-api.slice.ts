import { apiSlice } from "@/lib/api/client";
import { apiTransformer } from "@/lib/api/api-transformer";

export interface Inquiry {
  id: string;
  inquiryNumber: string;
  consultantId: string;
  consultant?: {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
  clientId: string;
  client?: {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    country?: string;
  };
  packageId: string;
  package?: { id: string; packageName: string };
  packageSnapshot?: unknown;
  hotelSelections?: InquiryHotelSelectionItem[];
  source: string;
  destinationId: string;
  destination?: { id: string; name: string };
  travelDate: string;
  days: number;
  adults: number;
  children: number;
  calculatedTotal: number;
  approvedTotal?: number | null;
  status:
    | "DRAFT"
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "CHANGES_REQUESTED"
    | "APPROVED"
    | "REJECTED";
  notes?: string | null;
  submittedAt?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryHotelSelectionItem {
  id?: string;
  dayNumber: number;
  destinationId?: string;
  hotelId?: string;
  hotel?: { id: string; name: string };
  hotelName?: string;
  roomTypeId?: string;
  roomType?: { id: string; name: string; price: number; extraBedPrice: number };
  roomTypeName?: string;
  numberOfRooms: number;
  numberOfExtraBeds: number;
  roomPrice: number;
  extraBedPrice: number;
  nights: number;
  calculatedTotal: number;
}

export interface CreateInquiryInput {
  packageId: string;
  clientId: string;
  source: string;
  destinationId: string;
  travelDate: string;
  days: number;
  adults: number;
  children?: number;
  calculatedTotal?: number;
  packageSnapshot?: Record<string, unknown>;
  hotelSelections?: {
    dayNumber: number;
    destinationId: string;
    hotelId: string;
    roomTypeId: string;
    nights?: number;
  }[];
}

const inquiriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInquiries: builder.query<Inquiry[], undefined>({
      query: () => ({
        url: "/inquiries",
        method: "GET",
      }),
      transformResponse: apiTransformer.unwrapData<Inquiry[]>,
      providesTags: ["Inquiry"],
    }),
    getInquiryById: builder.query<Inquiry, string>({
      query: (id) => ({
        url: `/inquiries/${id}`,
        method: "GET",
      }),
      transformResponse: apiTransformer.unwrapData<Inquiry>,
      providesTags: (_result, _err, id) => [{ type: "Inquiry", id }],
    }),
    createInquiry: builder.mutation<Inquiry, CreateInquiryInput>({
      query: (body) => ({
        url: "/inquiries",
        method: "POST",
        body,
      }),
      transformResponse: apiTransformer.unwrapData<Inquiry>,
      invalidatesTags: ["Inquiry"],
    }),
    updateInquiryStatus: builder.mutation<
      Inquiry,
      { id: string; status: string; approvedTotal?: number; notes?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/inquiries/${id}/status`,
        method: "PATCH",
        body,
      }),
      transformResponse: apiTransformer.unwrapData<Inquiry>,
      invalidatesTags: (_result, _err, { id }) => [{ type: "Inquiry", id }, "Inquiry"],
    }),
  }),
});

export const {
  useGetInquiriesQuery,
  useGetInquiryByIdQuery,
  useCreateInquiryMutation,
  useUpdateInquiryStatusMutation,
} = inquiriesApiSlice;
