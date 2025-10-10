import { baseQuery, createApi, enhancedBaseQuery } from "../base-api";
import {
  IGetAllTrainingsResponse,
  ISessionDetailsResponse,
  IApplyToTrainingRequest,
  IListCourses,
  IGetMySessionsResponse,
  ICoursDetailsResponse,
  IGetUserSessionsResponse,
} from "@/types/student/traning-api";

// Including showing the student courses
export const trainingStudentApi = createApi({
  reducerPath: "trainingStudentApi",
  baseQuery,
  tagTypes: ["TrainingStudent"],
  endpoints: (builder) => ({
    getAllTrainings: builder.query<IGetAllTrainingsResponse, void>({
      query: () => "sessions/list",
      providesTags: ["TrainingStudent"],
    }),
    getTrainingsByCategory: builder.query<IGetAllTrainingsResponse, number>({
      query: (id_category) => `sessions/list/bycategory/${id_category}`,
      providesTags: ["TrainingStudent"],
    }),
    getTrainingsByThematicAndCategory: builder.query<
      IGetAllTrainingsResponse,
      { idThematic: number; idCategory: number }
    >({
      query: ({ idThematic, idCategory }) => `sessions/list/by/${idThematic}/${idCategory}`,
      providesTags: ["TrainingStudent"],
    }),
    getTrainingsByKeyword: builder.query<IGetAllTrainingsResponse, string>({
      query: (keyword) => `sessions/list/bykeyword/?keyword=${keyword}`,
      providesTags: ["TrainingStudent"],
    }),
    getTrainingsByGroup: builder.query<IGetAllTrainingsResponse, string>({
      query: (group) => `sessions/list/bygroups/${group}`,
      providesTags: ["TrainingStudent"],
    }),

    applyToTraining: builder.mutation<void, IApplyToTrainingRequest>({
      query: (request) => ({
        url: "sessions/session/apply",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["TrainingStudent"],
    }),

    getMySessions: builder.query<IGetMySessionsResponse, void>({
      query: () => `sessions/mylist`,
      providesTags: ["TrainingStudent"],
    }),

    getTrainingById: builder.query<ISessionDetailsResponse, { id_session: number }>({
      query: (request) => `sessions/session/${request.id_session}`,
      providesTags: ["TrainingStudent"],
    }),

    listCoursesBySessionId: builder.query<IListCourses, { id_session: string }>({
      query: (request) => `courses/listall/${request.id_session}`,
      providesTags: ["TrainingStudent"],
    }),
    getCoursesById: builder.query<ICoursDetailsResponse, { id_cours: string }>({
      query: (request) => `courses/course/${request.id_cours}`,
      providesTags: ["TrainingStudent"],
    }),

    getUserSessions: builder.query<IGetUserSessionsResponse, void>({
      query: () => `userinsession/user`,
      providesTags: ["TrainingStudent"],
    }),

    // Create CPF payment method (student access)
    createCpfPayment: builder.mutation<any, { id_session: string }>({
      query: (body) => ({
        url: `paymentmethodcpf/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["TrainingStudent"],
    }),

    // Create OPCO payment method (student access)
    createOpcoPayment: builder.mutation<
      any,
      {
        id_session: string;
        nom_entreprise: string;
        siren: string;
        nom_responsable: string;
        telephone_responsable: string;
        email_responsable: string;
      }
    >({
      query: (body) => ({
        url: `paymentmethodopco/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["TrainingStudent"],
    }),
  }),
});

export const {
  useGetAllTrainingsQuery,
  useGetTrainingsByCategoryQuery,
  useApplyToTrainingMutation,
  useListCoursesBySessionIdQuery,
  useGetMySessionsQuery,
  useGetCoursesByIdQuery,
  useGetTrainingByIdQuery,
  useCreateCpfPaymentMutation,
  useCreateOpcoPaymentMutation,
  useGetUserSessionsQuery,
} = trainingStudentApi;
