import * as z from "zod";

export const subscribeNewsLetterSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse email valide"),
});

export type SubscribeNewsLetterSchemaFormValues = z.infer<typeof subscribeNewsLetterSchema>;
