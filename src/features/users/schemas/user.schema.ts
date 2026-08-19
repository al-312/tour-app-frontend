import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "CONSULTANT", "CLIENT"] as const),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.email("Invalid email address").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export const updateUserRoleSchema = z.object({
  role: z.enum(["ADMIN", "CONSULTANT", "CLIENT"] as const),
});

export type UpdateUserRoleFormData = z.infer<typeof updateUserRoleSchema>;
