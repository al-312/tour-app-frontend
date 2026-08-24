import { z } from "zod";

export const packageSchema = z.object({
  packageName: z.string().min(1, "Package name is required"),
  clientId: z.string().optional(),
  destinationId: z.string().optional(),
  consultantId: z.string().optional(),
  startDate: z.string().optional(),
  numberOfDays: z.string().min(1, "Number of days is required"),
  adults: z.string().min(1, "Adult count is required"),
  children: z.string().optional(),
  status: z.enum(["DRAFT", "CONFIRMED", "CANCELLED"] as const),
});

export type PackageFormData = z.infer<typeof packageSchema>;
