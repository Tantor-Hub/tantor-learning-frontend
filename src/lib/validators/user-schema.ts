import { z } from "zod";

export const userSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(50, { message: "Username must be less than 50 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, { message: "You must accept the terms and conditions" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type UserFormValues = z.infer<typeof userSchema>;
