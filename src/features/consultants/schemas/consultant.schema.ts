import { z } from "zod";

export const consultantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  designation: z.string().min(1, "Designation is required"),
  phone: z.string().optional(),
  email: z.email({ message: "Invalid email" }).optional().or(z.literal("")),
  logo: z.string().optional(),
});

export type ConsultantFormData = z.infer<typeof consultantSchema>;
