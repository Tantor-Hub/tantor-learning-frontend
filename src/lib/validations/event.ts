import { z } from "zod";

export const createEventSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    id_cible_session: z.array(z.string().uuid()).min(1, "At least one session must be selected"),
    begining_date: z.string().datetime("Invalid start date format"),
    ending_date: z.string().datetime("Invalid end date format"),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.begining_date);
      const endDate = new Date(data.ending_date);
      return endDate >= startDate;
    },
    {
      message: "End date must be after start date",
      path: ["ending_date"],
    }
  );

export const updateEventSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string().min(3, "Title must be at least 3 characters").optional(),
    description: z.string().min(10, "Description must be at least 10 characters").optional(),
    begining_date: z.string().datetime("Invalid start date format").optional(),
    ending_date: z.string().datetime("Invalid end date format").optional(),
  })
  .refine(
    (data) => {
      if (data.begining_date && data.ending_date) {
        const startDate = new Date(data.begining_date);
        const endDate = new Date(data.ending_date);
        return endDate >= startDate;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["ending_date"],
    }
  );

export type CreateEventFormData = z.infer<typeof createEventSchema>;
export type UpdateEventFormData = z.infer<typeof updateEventSchema>;
