import { createApi, enhancedBaseQuery } from "../base-api";

export enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
  TEXT = "text",
}

export interface IEvaluationQuestionOption {
  id?: string;
  text: string;
  isCorrect: boolean;
}

export interface IEvaluationQuestion {
  id?: string;
  evaluationId: string;
  type: QuestionType;
  text: string;
  isImmediateResult: boolean;
  points: number;
  options?: IEvaluationQuestionOption[];
  createdAt?: string;
  updatedAt?: string;
}

export const evaluationQuestionApi = createApi({
  reducerPath: "evaluationQuestionApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["EvaluationQuestion"],
  endpoints: (builder) => ({
    getEvaluationQuestionsByEvaluationId: builder.query<
      { data: IEvaluationQuestion[] },
      { evaluationId: string }
    >({
      query: ({ evaluationId }) => `evaluationquestion/evaluation/${evaluationId}`,
      providesTags: ["EvaluationQuestion"],
    }),
    createEvaluationQuestion: builder.mutation<void, IEvaluationQuestion>({
      query: (body) => ({
        url: "evaluationquestion",
        method: "POST",
        body,
      }),
      invalidatesTags: ["EvaluationQuestion"],
    }),
    updateEvaluationQuestion: builder.mutation<
      void,
      { id: string; body: Partial<IEvaluationQuestion> }
    >({
      query: ({ id, body }) => ({
        url: `evaluationquestion/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["EvaluationQuestion"],
    }),
    deleteEvaluationQuestion: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `evaluationquestion/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EvaluationQuestion"],
    }),
  }),
});

export const {
  useGetEvaluationQuestionsByEvaluationIdQuery,
  useCreateEvaluationQuestionMutation,
  useUpdateEvaluationQuestionMutation,
  useDeleteEvaluationQuestionMutation,
} = evaluationQuestionApi;
