import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Mobile must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  status: z.enum(["active", "inactive"]),
});

export type UserFormSchema = z.infer<typeof userSchema>;

export const adminChangePasswordSchema = z.object({
  username: z.string().min(1, "Name is required"),
  oldpassword: z.string().min(6, "Password must be at least 6 characters").optional(),
  newpassword: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export type AdminChangePasswordFormSchema = z.infer<typeof adminChangePasswordSchema>;