import { z } from "zod";

export const verifyAccountSchema = z.object({
  pin: z
    .string()
    .min(6, { message: "Le code doit contenir exactement 6 chiffres." })
    .max(6, { message: "Le code doit contenir exactement 6 chiffres." })
    .regex(/^\d{6}$/, {
      message:
        "Le code ne doit contenir que des chiffres (0-9), sans espaces ni caractères spéciaux.",
    }),
});

export type verifyAccountValues = z.infer<typeof verifyAccountSchema>;
