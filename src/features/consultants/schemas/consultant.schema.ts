import { z } from "zod";

import { validatePhoneForCountry } from "@/lib/utils/phone.utils";

export const phoneSchema = z
  .object({
    countryCode: z.string().optional(),
    number: z.string().optional(),
    phoneNumber: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const num = data.number ?? data.phoneNumber;
    if (num?.trim()) {
      const res = validatePhoneForCountry(num, data.countryCode);
      if (!res.isValid && res.error) {
        ctx.addIssue({
          code: "custom",
          message: res.error,
          path: ["number"],
        });
      }
    }
  })
  .optional();

export const consultantSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  designation: z.string().min(1, "Designation is required"),
  phone: phoneSchema,
  email: z.email({ message: "Invalid email" }).optional().or(z.literal("")),
});

export type ConsultantFormData = z.infer<typeof consultantSchema>;
