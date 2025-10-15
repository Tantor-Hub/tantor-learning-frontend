import { createApi, enhancedBaseQuery } from "./base-api";
import type { TrainingSession, ApiResponse } from "../../types/training-sessions";

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
  }),
});

export const { useGetTrainingSessionByIdQuery } = trainingSessionApi;
