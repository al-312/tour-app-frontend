import { z } from "zod";

export const destinationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  country: z.string().min(1, "Country is required"),
  description: z.string().optional(),
  coverImage: z.string().optional(),
});

export type DestinationFormData = z.infer<typeof destinationSchema>;
