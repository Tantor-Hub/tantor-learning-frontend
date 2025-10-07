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
  createdBy?: string[];
  lecturer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  questions?: any[];
  createdAt?: string;
  updatedAt?: string;
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
    getStudentEvaluationById: builder.query<{ data: IStudentEvaluation }, { id: string }>({
      query: ({ id }) => `studentevaluation/${id}`,
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
    updateStudentEvaluation: builder.mutation<
      void,
      { id: string; body: Partial<IStudentEvaluation> }
    >({
      query: ({ id, body }) => ({
        url: `studentevaluation/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["StudentEvaluation"],
    }),
  }),
});

export const {
  useGetStudentEvaluationsBySessionQuery,
  useGetStudentEvaluationByIdQuery,
  useCreateStudentEvaluationMutation,
  useDeleteStudentEvaluationMutation,
  useUpdateStudentEvaluationMutation,
} = studentEvaluationApi;
