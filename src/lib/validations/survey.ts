import { z } from "zod";

const optionSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(1, "Option text cannot be empty"),
});

const questionSchema = z
  .object({
    id: z.string().uuid(),
    type: z.enum(["multiple_choice", "text"]),
    question: z.string().min(5, "Question must be at least 5 characters"),
    required: z.boolean(),
    order: z.number().positive(),
    options: z.optional(z.array(optionSchema).min(2, "Multiple choice needs at least 2 options")),
    maxSelections: z.optional(z.number().min(1)),
  })
  .refine(
    (data) => {
      if (data.type === "multiple_choice" && data.options) {
        return (data.maxSelections ?? 1) <= data.options.length;
      }
      return true;
    },
    {
      message: "Max selections cannot exceed options count",
      path: ["maxSelections"],
    }
  );

export const createSurveySchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    id_session: z.string().uuid("Select a valid session"),
    categories: z.enum(["before", "during", "after"]),
    questions: z.array(questionSchema).min(1, "Add at least one question"),
  })
  .transform((data) => ({
    ...data,
    questions: data.questions.map((q, index) => ({ ...q, order: index + 1 })),
  }));

export type CreateSurveyFormData = z.infer<typeof createSurveySchema>;
