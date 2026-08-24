import { z } from "zod";

export const createHotelSchema = z.object({
  name: z.string().min(1, "Hotel name is required"),
  destinationId: z.string().optional(),
  starRating: z.string().min(1, "Star rating is required"),
});

export type CreateHotelFormData = z.infer<typeof createHotelSchema>;

export const updateHotelSchema = z.object({
  name: z.string().min(1, "Hotel name is required").optional(),
  destinationId: z.string().optional(),
  starRating: z.string().optional(),
});

export type UpdateHotelFormData = z.infer<typeof updateHotelSchema>;
