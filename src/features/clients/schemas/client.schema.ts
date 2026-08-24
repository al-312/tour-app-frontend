import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  email: z.email({ message: "Invalid email" }).optional().or(z.literal("")),
  nationality: z.string().optional(),
  notes: z.string().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
