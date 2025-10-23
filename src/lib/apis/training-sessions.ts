import { createApi, enhancedBaseQuery } from "./base-api";
import type {
  TrainingSession,
  ApiResponse,
  UpdateTrainingSessionRequest,
} from "../../types/training-sessions";

// Training Session API
export const trainingSessionApi = createApi({
  reducerPath: "trainingSessionApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["TrainingSession"],
  endpoints: (builder) => ({
    // Get training session by ID
    getTrainingSessionById: builder.query<ApiResponse<TrainingSession>, { id: string }>({
      query: (request) => ({
        url: `/trainingssession/${request.id}`,
        method: "GET",
      }),
      providesTags: ["TrainingSession"],
    }),
    // Delete training session by ID
    deleteTrainingSession: builder.mutation<ApiResponse<TrainingSession>, { id: string }>({
      query: (request) => ({
        url: `/trainingssession/${request.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TrainingSession"],
    }),
    // Update training session
    updateTrainingSession: builder.mutation<
      ApiResponse<TrainingSession>,
      UpdateTrainingSessionRequest
    >({
      query: (request) => ({
        url: `/trainingssession/update`,
        method: "PATCH",
        body: request,
      }),
      invalidatesTags: ["TrainingSession"],
    }),
  }),
});

export const {
  useGetTrainingSessionByIdQuery,
  useDeleteTrainingSessionMutation,
  useUpdateTrainingSessionMutation,
} = trainingSessionApi;
