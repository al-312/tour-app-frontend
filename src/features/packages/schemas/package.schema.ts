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

export const step1Schema = z
  .object({
    packageName: z.string().min(1, "Package name is required"),
    source: z.string().optional(),
    destinationId: z.string().optional(),
    clientId: z.string().optional(),
    startDate: z.string().optional(),
    validFrom: z.string().min(1, "Valid From date is required"),
    validTo: z.string().min(1, "Valid To date is required"),
    numberOfDays: z.number().min(1, "Number of days must be at least 1"),
  })
  .refine(
    (data) => {
      if (data.validFrom && data.validTo) {
        return new Date(data.validTo) >= new Date(data.validFrom);
      }
      return true;
    },
    {
      message: "Valid To date cannot be earlier than Valid From date",
      path: ["validTo"],
    }
  );

export type Step1FormData = z.infer<typeof step1Schema>;

export const searchPackageSchema = z.object({
  destinationId: z.string().optional(),
  source: z.string().optional(),
  travelDate: z.string().optional(),
  days: z.number().optional(),
  adults: z.number().optional(),
  children: z.number().optional(),
});

export type SearchPackageFormData = z.infer<typeof searchPackageSchema>;

export const step3Schema = z.object({
  adults: z.number().min(1, "Adult travelers must be at least 1"),
  childrenCount: z.number().optional(),
});

export type Step3FormData = z.infer<typeof step3Schema>;
