import { createApi, enhancedBaseQuery } from "../base-api";
import {
  IAddSessionRequest,
  IListSessionResponse,
  IUpdateSessionRequest,
  ISessionByIdResponse,
  ICreateSurveyRequest,
  ISurveyResponse,
  IListSurveysResponse,
} from "@/types/secretary/session-secretary";

// Session Secretary API
export const sessionSecretaryApi = createApi({
  reducerPath: "sessionSecretaryApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["SessionSecretary"],
  endpoints: (builder) => ({
    listSession: builder.query<IListSessionResponse, void>({
      query: () => "trainingssession/getall",
      providesTags: ["SessionSecretary"],
    }),
    addSession: builder.mutation<void, IAddSessionRequest>({
      query: (body) => ({
        url: "sessions/session/create",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["SessionSecretary"],
    }),
    updateSession: builder.mutation<void, IUpdateSessionRequest>({
      query: (body) => ({
        url: `trainingssession/update`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["SessionSecretary"],
    }),
    getSessionById: builder.query<ISessionByIdResponse, { id: string }>({
      query: ({ id }) => `trainingssession/${id}`,
      providesTags: ["SessionSecretary"],
    }),

    // Survey Question Endpoints
    createSurveyQuestion: builder.mutation<ISurveyResponse, ICreateSurveyRequest>({
      query: (body) => ({
        url: "surveyquestion/create",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["SessionSecretary"],
    }),

    getAllSurveys: builder.query<IListSurveysResponse, void>({
      query: () => "surveyquestion/getall",
      providesTags: ["SessionSecretary"],
    }),

    getSurveyQuestionById: builder.query<ISurveyResponse, { id: string }>({
      query: ({ id }) => `surveyquestion/${id}`,
      providesTags: ["SessionSecretary"],
    }),

    getSurveysBySession: builder.query<IListSurveysResponse, { sessionId: string }>({
      query: ({ sessionId }) => `surveyquestion/session/${sessionId}`,
      providesTags: ["SessionSecretary"],
    }),

    getSurveysByCategory: builder.query<IListSurveysResponse, { category: string }>({
      query: ({ category }) => `surveyquestion/category/${category}`,
      providesTags: ["SessionSecretary"],
    }),

    getSurveysByCreator: builder.query<IListSurveysResponse, { creatorId: string }>({
      query: ({ creatorId }) => `surveyquestion/creator/${creatorId}`,
      providesTags: ["SessionSecretary"],
    }),

    updateSurveyQuestion: builder.mutation<
      ISurveyResponse,
      { id: string; data: Partial<ICreateSurveyRequest> }
    >({
      query: ({ id, data }) => ({
        url: `surveyquestion/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SessionSecretary"],
    }),

    deleteSurveyQuestion: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `surveyquestion/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SessionSecretary"],
    }),
  }),
});

export const {
  useAddSessionMutation,
  useUpdateSessionMutation,
  useListSessionQuery,
  useGetSessionByIdQuery,
  useCreateSurveyQuestionMutation,
  useGetAllSurveysQuery,
  useGetSurveyQuestionByIdQuery,
  useGetSurveysBySessionQuery,
  useGetSurveysByCategoryQuery,
  useGetSurveysByCreatorQuery,
  useUpdateSurveyQuestionMutation,
  useDeleteSurveyQuestionMutation,
} = sessionSecretaryApi;
