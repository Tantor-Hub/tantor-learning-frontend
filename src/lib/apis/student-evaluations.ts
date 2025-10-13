import { createApi, enhancedBaseQuery } from "./base-api";
import { IStudentEvaluation } from "@/types/student-evaluations";

export const studentEvaluationsApi = createApi({
  reducerPath: "studentEvaluationsApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["StudentEvaluations"],
  endpoints: (builder) => ({
    /*###############################################################################
    ######################### STUDENT ACCESS ########################################
    #################################################################################*/

    getStudentEvaluationsBySession: builder.query<any, { sessionCoursId: string }>({
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
} = studentEvaluationsApi;
