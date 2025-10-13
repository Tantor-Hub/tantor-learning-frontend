import { createApi, enhancedBaseQuery } from "./base-api";
import { IEvaluationQuestionsResponse } from "@/types/evaluation-questions";

export const evaluationQuestionsApi = createApi({
  reducerPath: "evaluationQuestionsApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["EvaluationQuestion"],
  endpoints: (builder) => ({
    getEvaluationQuestionsByEvaluationId: builder.query<IEvaluationQuestionsResponse, string>({
      query: (evaluationId) => `evaluationquestion/student/evaluation/${evaluationId}`,
      providesTags: ["EvaluationQuestion"],
    }),
  }),
});

export const { useGetEvaluationQuestionsByEvaluationIdQuery } = evaluationQuestionsApi;
