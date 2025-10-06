import { createApi, enhancedBaseQuery } from "../base-api";

export interface IStudentEvaluation {
  id?: string;
  title: string;
  description: string;
  type: "exercise" | "homework" | "test" | "examen";
  points: number;
  submittiondate: string;
  ispublish: boolean;
  isImmediateResult: boolean;
}

export const studentEvaluationApi = createApi({
  reducerPath: "studentEvaluationApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["StudentEvaluation"],
  endpoints: (builder) => ({
    createStudentEvaluation: builder.mutation<void, IStudentEvaluation>({
      query: (body) => ({
        url: "studentevaluation",
        method: "POST",
        body,
      }),
      invalidatesTags: ["StudentEvaluation"],
    }),
    deleteStudentEvaluation: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `studentevaluation/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["StudentEvaluation"],
    }),
  }),
});

export const { useCreateStudentEvaluationMutation, useDeleteStudentEvaluationMutation } =
  studentEvaluationApi;
