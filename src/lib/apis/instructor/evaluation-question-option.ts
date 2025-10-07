import { createApi, enhancedBaseQuery } from "../base-api";

export interface IEvaluationQuestionOption {
  id?: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const evaluationQuestionOptionApi = createApi({
  reducerPath: "evaluationQuestionOptionApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["EvaluationQuestionOption"],
  endpoints: (builder) => ({
    getOptionsByQuestionId: builder.query<
      { data: IEvaluationQuestionOption[] },
      { questionId: string }
    >({
      query: ({ questionId }) => `evaluationquestionoption/question/${questionId}`,
      providesTags: (_result, _err, arg) => [
        { type: "EvaluationQuestionOption", id: arg.questionId },
      ],
    }),
    createOption: builder.mutation<void, IEvaluationQuestionOption>({
      query: (body) => ({
        url: "evaluationquestionoption",
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, body) => [
        { type: "EvaluationQuestionOption", id: body.questionId },
      ],
    }),
    updateOption: builder.mutation<void, { id: string; body: Partial<IEvaluationQuestionOption> }>({
      query: ({ id, body }) => ({
        url: `evaluationquestionoption/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["EvaluationQuestionOption"],
    }),
    deleteOption: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `evaluationquestionoption/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EvaluationQuestionOption"],
    }),
  }),
});

export const {
  useGetOptionsByQuestionIdQuery,
  useCreateOptionMutation,
  useUpdateOptionMutation,
  useDeleteOptionMutation,
} = evaluationQuestionOptionApi;
