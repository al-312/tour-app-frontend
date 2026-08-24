import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CLIENT", "CONSULTANT", "ADMIN"]),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
