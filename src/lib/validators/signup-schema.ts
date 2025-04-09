import * as z from "zod";

export const signUpSchema = z
  .object({
    fullName: z.string().min(2, {
      message: "Le nom doit contenir au moins 2 caractères.",
    }),
    email: z.string().email({
      message: "Veuillez entrer une adresse email valide.",
    }),
    username: z
      .string()
      .min(3, {
        message: "Le nom d'utilisateur doit contenir au moins 3 caractères.",
      })
      .regex(/^[a-zA-Z0-9_-]+$/, {
        message:
          "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores.",
      }),
    password: z
      .string()
      .min(8, {
        message: "Le mot de passe doit contenir au moins 8 caractères.",
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre.",
      }),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "Vous devez accepter les termes et conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;
