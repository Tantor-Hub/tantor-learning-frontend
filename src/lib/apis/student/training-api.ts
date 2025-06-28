import { baseQuery, createApi } from "../base-api";
import {
  IGetAllTrainingsResponse,
  ISessionDetailsResponse,
  IApplyToTrainingRequest,
} from "@/types/student/traning-api";

export const trainingStudentApi = createApi({
  reducerPath: "trainingStudentApi",
  baseQuery,
  tagTypes: ["TrainingStudent"],
  endpoints: (builder) => ({
    getAllTrainings: builder.query<IGetAllTrainingsResponse, void>({
      query: () => "/api/sessions/list",
      providesTags: ["TrainingStudent"],
    }),
    getTrainingsByCategory: builder.query<IGetAllTrainingsResponse, number>({
      query: (id_category) => `/api/sessions/list/bycategory/${id_category}`,
      providesTags: ["TrainingStudent"],
    }),
    getTrainingsByThematicAndCategory: builder.query<
      IGetAllTrainingsResponse,
      { idThematic: number; idCategory: number }
    >({
      query: ({ idThematic, idCategory }) => `/api/sessions/list/by/${idThematic}/${idCategory}`,
      providesTags: ["TrainingStudent"],
    }),
    getTrainingsByKeyword: builder.query<IGetAllTrainingsResponse, string>({
      query: (keyword) => `/api/sessions/list/bykeyword/?keyword=${keyword}`,
      providesTags: ["TrainingStudent"],
    }),
    getTrainingsByGroup: builder.query<IGetAllTrainingsResponse, string>({
      query: (group) => `/api/sessions/list/bygroups/${group}`,
      providesTags: ["TrainingStudent"],
    }),

    applyToTraining: builder.mutation<void, IApplyToTrainingRequest>({
      query: (request) => ({
        url: `/api/sessions/session/apply`,
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["TrainingStudent"],
    }),

    getMySessions: builder.query<IGetAllTrainingsResponse, void>({
      query: () => `/api/sessions/mylist`,
      providesTags: ["TrainingStudent"],
    }),

    getTrainingById: builder.query<ISessionDetailsResponse, number>({
      query: (id_session) => `/api/sessions/session/${id_session}`,
      providesTags: ["TrainingStudent"],
    }),
  }),
});

export const {
  useGetAllTrainingsQuery,
  useGetTrainingsByCategoryQuery,
  useApplyToTrainingMutation,
} = trainingStudentApi;
