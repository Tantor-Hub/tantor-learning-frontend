import { IAddTrainingRequest, ITrainingListResponse } from "@/types/secretary/training-secretary";
import { createApi, enhancedBaseQuery } from "../base-api";

// Training Secretary API
export const trainingSecretaryApi = createApi({
  reducerPath: "trainingSecretaryApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["TrainingSecretary"],
  endpoints: (builder) => ({
    trainingList: builder.query<ITrainingListResponse, void>({
      query: () => "/api/formations/list",
      providesTags: ["TrainingSecretary"],
    }),
    addTraining: builder.mutation<void, IAddTrainingRequest>({
      query: (body) => ({
        url: "/api/formations/formation/add",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["TrainingSecretary"],
    }),
    listTrainingByCategory: builder.query<ITrainingListResponse, { id: string }>({
      query: ({ id }) => `/api/formations/list/bycategory/${id}`,
      providesTags: ["TrainingSecretary"],
    }),
    listTrainingById: builder.query<ITrainingListResponse, { id: string }>({
      query: ({ id }) => `/api/formations/formation/${id}`,
      providesTags: ["TrainingSecretary"],
    }),
    deleteTrainingById: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/api/formations/formation/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TrainingSecretary"],
    }),
  }),
});

export const {
  useTrainingListQuery,
  useAddTrainingMutation,
  useDeleteTrainingByIdMutation,
  useListTrainingByIdQuery,
} = trainingSecretaryApi;
