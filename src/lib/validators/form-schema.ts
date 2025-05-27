import * as z from "zod";

export const contactUsFormSchema = z.object({
  fullName: z
    .string()
    .min(2, {
      message: "Le nom doit contenir au moins 2 caractères.",
    })
    .optional(),
  email: z
    .string()
    .email({
      message: "Veuillez entrer une adresse email valide.",
    })
    .optional(),
  subject: z.string().min(2, {
    message: "Veuillez entrer un objet.",
  }),
  message: z.string().min(10, {
    message: "Le message doit contenir au moins 10 caractères.",
  }),
  file: z.any().optional(),
});

export type ContactUsFormValues = z.infer<typeof contactUsFormSchema>;
