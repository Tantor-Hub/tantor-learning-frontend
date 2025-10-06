import { createApi, enhancedBaseQuery } from "../base-api";

export enum StudentevaluationType {
  EXERCISE = "exercise",
  HOMEWORK = "homework",
  TEST = "test",
  QUIZ = "quiz",
  EXAMEN = "examen",
}

export interface IStudentEvaluation {
  id?: string;
  title: string;
  description: string;
  type: StudentevaluationType;
  points: number;
  sessionCoursId: string;
  lessonId: string[];
  submittiondate: string;
  beginningTime?: string;
  endingTime?: string;
  ispublish: boolean;
  isImmediateResult: boolean;
}

export const studentEvaluationApi = createApi({
  reducerPath: "studentEvaluationApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["StudentEvaluation"],
  endpoints: (builder) => ({
    getStudentEvaluationsBySession: builder.query<any, { sessionCoursId: string }>({
      query: ({ sessionCoursId }) => `studentevaluation/sessioncours/${sessionCoursId}`,
      providesTags: ["StudentEvaluation"],
    }),
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

export const {
  useGetStudentEvaluationsBySessionQuery,
  useCreateStudentEvaluationMutation,
  useDeleteStudentEvaluationMutation,
} = studentEvaluationApi;
