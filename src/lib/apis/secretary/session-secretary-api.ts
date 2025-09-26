import { createApi, enhancedBaseQuery } from "../base-api";
import {
  IAddSessionRequest,
  IListSessionResponse,
  IUpdateSessionRequest,
  ISessionByIdResponse,
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
  }),
});

export const {
  useAddSessionMutation,
  useUpdateSessionMutation,
  useListSessionQuery,
  useGetSessionByIdQuery,
} = sessionSecretaryApi;
