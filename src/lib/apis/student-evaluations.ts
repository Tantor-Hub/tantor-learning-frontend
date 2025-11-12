import { createApi, enhancedBaseQuery } from "./base-api";
import {
  IStudentEvaluation,
  IStudentEvaluationsResponse,
  IStudentEvaluationsApiResponse,
  IStudentsByEvaluationIdApiResponse,
  IStudentAnswersApiResponse,
} from "@/types/student-evaluations";

export const studentEvaluationsApi = createApi({
  reducerPath: "studentEvaluationsApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["StudentEvaluations"],
  endpoints: (builder) => ({
    /*###############################################################################
    ######################### STUDENT ACCESS ########################################
    #################################################################################*/

    getStudentEvaluationsBySession: builder.query<
      IStudentEvaluationsApiResponse,
      { sessionCoursId: string }
    >({
      query: ({ sessionCoursId }) => `studentevaluation/sessioncours/${sessionCoursId}`,
      providesTags: ["StudentEvaluations"],
    }),
    getStudentEvaluationById: builder.query<{ data: IStudentEvaluation }, { id: string }>({
      query: ({ id }) => `studentevaluation/${id}`,
      providesTags: ["StudentEvaluations"],
    }),

    /*###############################################################################
    ######################### ADMIN ACCESS ########################################
    #################################################################################*/

    // Add admin-specific endpoints here if needed

    /*###############################################################################
    ######################### SECRETARY ACCESS ########################################
    #################################################################################*/

    // Add secretary-specific endpoints here if needed

    createStudentEvaluation: builder.mutation<void, IStudentEvaluation>({
      query: (body) => ({
        url: "studentevaluation",
        method: "POST",
        body,
      }),
      invalidatesTags: ["StudentEvaluations"],
    }),
    deleteStudentEvaluation: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `studentevaluation/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["StudentEvaluations"],
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
      invalidatesTags: ["StudentEvaluations"],
    }),

    // instructor access
    getStudentEvaluationsBySessionCourseInstructorSecretary: builder.query<
      IStudentEvaluationsApiResponse,
      { sessionCoursId: string }
    >({
      query: ({ sessionCoursId }) => `studentevaluation/instructor/sessioncours/${sessionCoursId}`,
      providesTags: ["StudentEvaluations"],
    }),

    getStudentsByEvaluationId: builder.query<
      IStudentsByEvaluationIdApiResponse,
      { evaluationId: string }
    >({
      query: ({ evaluationId }) =>
        `studentevaluation/instructor/evaluation/${evaluationId}/students`,
      providesTags: ["StudentEvaluations"],
    }),

    getStudentAnswersByEvaluationAndStudent: builder.query<
      IStudentAnswersApiResponse,
      { evaluationId: string; studentId: string }
    >({
      query: ({ evaluationId, studentId }) =>
        `studentevaluation/instructor/evaluation/${evaluationId}/student/${studentId}/answers`,
      providesTags: ["StudentEvaluations"],
    }),
  }),
});

export const {
  /*###############################################################################
    ######################### STUDENT ACCESS ########################################
    #################################################################################*/
  useGetStudentEvaluationsBySessionQuery,
  useGetStudentEvaluationByIdQuery,

  /*###############################################################################
    ######################### ADMIN ACCESS ########################################
    #################################################################################*/

  /*###############################################################################
    ######################### SECRETARY ACCESS ########################################
    #################################################################################*/
  useCreateStudentEvaluationMutation,
  useDeleteStudentEvaluationMutation,
  useUpdateStudentEvaluationMutation,

  /*###############################################################################
    ######################### INSTRUCTOR ACCESS ########################################
    #################################################################################*/
  useGetStudentEvaluationsBySessionCourseInstructorSecretaryQuery,
  useGetStudentsByEvaluationIdQuery,
  useGetStudentAnswersByEvaluationAndStudentQuery,
} = studentEvaluationsApi;
