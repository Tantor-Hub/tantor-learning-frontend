import { createApi, enhancedBaseQuery } from "./base-api";
import { IStudentAnswer, IStudentAnswersResponse } from "@/types/student-answers";

export const studentAnswersApi = createApi({
  reducerPath: "studentAnswersApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["StudentAnswer"],
  endpoints: (builder) => ({
    getAllStudentAnswers: builder.query<IStudentAnswersResponse, void>({
      query: () => "studentanswer",
      providesTags: ["StudentAnswer"],
    }),
    createStudentAnswer: builder.mutation<
      { status: number; message: string; data: IStudentAnswer },
      { questionId: string; evaluationId: string; answerText: string }
    >({
      query: (body) => ({
        url: "studentanswer",
        method: "POST",
        body,
      }),
      invalidatesTags: ["StudentAnswer"],
    }),
    getStudentAnswerById: builder.query<
      { status: number; message: string; data: IStudentAnswer },
      string
    >({
      query: (id) => `studentanswer/${id}`,
      providesTags: ["StudentAnswer"],
    }),
    updateStudentAnswer: builder.mutation<
      { status: number; message: string; data: IStudentAnswer },
      { id: string; answerText: string }
    >({
      query: ({ id, ...body }) => ({
        url: `studentanswer/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["StudentAnswer"],
    }),
    deleteStudentAnswer: builder.mutation<{ status: number; message: string }, string>({
      query: (id) => ({
        url: `studentanswer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["StudentAnswer"],
    }),
    getStudentAnswersByEvaluationId: builder.query<IStudentAnswersResponse, string>({
      query: (evaluationId) => `studentanswer/evaluation/${evaluationId}`,
      providesTags: ["StudentAnswer"],
    }),
    getMyStudentAnswers: builder.query<IStudentAnswersResponse, void>({
      query: () => "studentanswer/student/my-answers",
      providesTags: ["StudentAnswer"],
    }),

    // student access
    getStudentAnswersByQuestionId: builder.query<IStudentAnswersResponse, string>({
      query: (questionId) => `studentanswer/question/${questionId}`,
      providesTags: ["StudentAnswer"],
    }),

    // instructor access
    updateStudentAnswerPoints: builder.mutation<
      { status: number; message: string; data: IStudentAnswer },
      { answerId: string; points: number }
    >({
      query: ({ answerId, points }) => ({
        url: `studentanswer/instructor/${answerId}/points`,
        method: "PATCH",
        body: { points },
      }),
      invalidatesTags: ["StudentAnswer"],
    }),
  }),
});

export const {
  useGetAllStudentAnswersQuery,
  useCreateStudentAnswerMutation,
  useGetStudentAnswerByIdQuery,
  useUpdateStudentAnswerMutation,
  useDeleteStudentAnswerMutation,
  useGetStudentAnswersByEvaluationIdQuery,
  useGetMyStudentAnswersQuery,
  // student access
  useGetStudentAnswersByQuestionIdQuery,
  useLazyGetStudentAnswersByQuestionIdQuery,
  // instructor access
  useUpdateStudentAnswerPointsMutation,
} = studentAnswersApi;
