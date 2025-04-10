import * as z from "zod";

export const contactUsFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  subject: z.string().min(2, {
    message: "Veuillez entrer un objet.",
  }),
  message: z.string().min(10, {
    message: "Le message doit contenir au moins 10 caractères.",
  }),
});

export type ContactUsFormValues = z.infer<typeof contactUsFormSchema>;
