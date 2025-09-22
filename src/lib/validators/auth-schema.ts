import * as z from "zod";

/*
============================================================
SIGNIN SCHEMA -> Login
============================================================
*/

export const signInSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Veuillez entrer une adresse email valide"),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

/*
============================================================
SIGNUP SCHEMA -> Register
============================================================
*/

export const signUpSchema = z.object({
  firstName: z.string().min(3, "Minimum 3 caractères").min(1, "Nom requis"),
  lastName: z.string().min(3, "Minimum 3 caractères").min(1, "Prénom requis"),
  email: z.string().min(1, "Email requis").email("Email invalide"),
  // password: z
  //   .string()
  //   .min(6, "Le mot de passe doit contenir au moins 6 caractères")
  //   .regex(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule")
  //   .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
  //   .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre")
  //   .regex(/[@$!%*?&]/, "Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)"),
  // confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
  termsAccepted: z.boolean().refine((val) => val === true, ""),
});
// .refine((data) => data.password === data.confirmPassword, {
//   message: "Les mots de passe ne correspondent pas",
//   path: ["confirmPassword"],
// })
// .refine((data) => data.password === data.confirmPassword, {
//   message: "Les mots de passe ne correspondent pas",
//   path: ["password"],
// });

export type SignUpFormValues = z.infer<typeof signUpSchema>;

/*
============================================================
VERIFY ACCOUNT OR CODE SCHEMA -> Register
============================================================
*/

export const verifyAccountCodeSchema = z.object({
  pin: z
    .string()
    .min(6, { message: "Le code doit contenir exactement 6 chiffres." })
    .max(6, { message: "Le code doit contenir exactement 6 chiffres." })
    .regex(/^\d{6}$/, {
      message:
        "Le code ne doit contenir que des chiffres (0-9), sans espaces ni caractères spéciaux.",
    }),
});

export type verifyAccountCodeValues = z.infer<typeof verifyAccountCodeSchema>;
