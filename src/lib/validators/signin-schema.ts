import * as z from "zod";

const passwordValidation = z
  .string()
  .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
  .regex(/[A-Z]/, { message: "Le mot de passe doit contenir une majuscule" })
  .regex(/[a-z]/, { message: "Le mot de passe doit contenir une minuscule" })
  .regex(/[0-9]/, { message: "Le mot de passe doit contenir un chiffre" })
  .regex(/[^A-Za-z0-9]/, { message: "Le mot de passe doit contenir un caractère spécial" });

export const signInSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: passwordValidation,
  rememberMe: z.boolean().optional(),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
