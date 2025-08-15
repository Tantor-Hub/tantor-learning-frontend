import * as z from "zod";

/*
============================================================
SIGNIN SCHEMA -> Login
============================================================
*/

export const signInSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Veuillez entrer une adresse email valide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
    .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[@$!%*?&]/, "Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)"),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

/*
============================================================
SIGNUP SCHEMA -> Register
============================================================
*/

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Le nom complet doit contenir au moins 3 caractères")
      .min(1, "Le nom complet est requis"),
    email: z
      .string()
      .min(1, "L'email est requis")
      .email("Veuillez entrer une adresse email valide"),
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
      .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre")
      .regex(/[@$!%*?&]/, "Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)"),
    confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, "Vous devez accepter les termes et conditions"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["password"],
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;
