import { createApi, enhancedBaseQuery } from "./base-api";
import {
  IStudentEvaluation,
  IStudentEvaluationsResponse,
  IStudentEvaluationsApiResponse,
  IStudentsByEvaluationIdApiResponse,
  IStudentAnswersApiResponse,
  IStudentStatisticsApiResponse,
  ISecretaryStatisticsApiResponse,
  ISecretaryStatisticsFilters,
  MarkingStatus,
  IMarkingStatusApiResponse,
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
    getStudentStatistics: builder.query<IStudentStatisticsApiResponse, { sessionId: string }>({
      query: ({ sessionId }) => `studentevaluation/student/session/${sessionId}/statistics`,
      providesTags: ["StudentEvaluations"],
    }),

    /*###############################################################################
    ######################### ADMIN ACCESS ########################################
    #################################################################################*/

    // Add admin-specific endpoints here if needed

    /*###############################################################################
    ######################### SECRETARY ACCESS ########################################
    #################################################################################*/

    getSecretaryStudentEvaluationStatistics: builder.query<
      ISecretaryStatisticsApiResponse,
      ISecretaryStatisticsFilters
    >({
      query: (filters) => {
        const searchParams = new URLSearchParams();
        if (filters.trainingId) searchParams.append("trainingId", filters.trainingId);
        if (filters.trainingsessionId)
          searchParams.append("trainingsessionId", filters.trainingsessionId);
        if (filters.sessioncoursId) searchParams.append("sessioncoursId", filters.sessioncoursId);
        if (filters.lessonId) searchParams.append("lessonId", filters.lessonId);
        if (filters.studentId) searchParams.append("studentId", filters.studentId);

        const queryString = searchParams.toString();
        return `studentevaluation/secretary/statistics${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["StudentEvaluations"],
    }),

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

    updateMarkingStatus: builder.mutation<
      void,
      { evaluationId: string; markingStatus: MarkingStatus }
    >({
      query: ({ evaluationId, markingStatus }) => ({
        url: `studentevaluation/${evaluationId}/marking-status`,
        method: "PATCH",
        body: { markingStatus },
      }),
      invalidatesTags: ["StudentEvaluations"],
    }),

    getMarkingStatus: builder.query<IMarkingStatusApiResponse, { evaluationId: string }>({
      query: ({ evaluationId }) =>
        `studentevaluation/instructor/evaluation/${evaluationId}/marking-status`,
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
  useGetStudentStatisticsQuery,

  /*###############################################################################
    ######################### ADMIN ACCESS ########################################
    #################################################################################*/

  /*###############################################################################
    ######################### SECRETARY ACCESS ########################################
    #################################################################################*/
  useGetSecretaryStudentEvaluationStatisticsQuery,
  useCreateStudentEvaluationMutation,
  useDeleteStudentEvaluationMutation,
  useUpdateStudentEvaluationMutation,

  /*###############################################################################
    ######################### INSTRUCTOR ACCESS ########################################
    #################################################################################*/
  useGetStudentEvaluationsBySessionCourseInstructorSecretaryQuery,
  useGetStudentsByEvaluationIdQuery,
  useGetStudentAnswersByEvaluationAndStudentQuery,
  useUpdateMarkingStatusMutation,
  useGetMarkingStatusQuery,
} = studentEvaluationsApi;
