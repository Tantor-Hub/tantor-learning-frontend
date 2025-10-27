import { createApi, enhancedBaseQuery } from "./base-api";
import type {
  UserInSession,
  UserSessionStudentView,
  ApiResponse,
  CreateUserInSessionRequest,
  UpdateUserInSessionRequest,
  DeleteUserInSessionRequest,
  CreateFreeUserInSessionRequest,
  UserInSessionStatus,
} from "@/types/user-in-session";

// User In Session API
export const userInSessionApi = createApi({
  reducerPath: "userInSessionApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["UserInSession"],
  endpoints: (builder) => ({
    // Get all users in sessions (Secretary access)
    getAllUserInSessions: builder.query<ApiResponse<UserInSession[]>, void>({
      query: () => ({
        url: "/userinsession",
        method: "GET",
      }),
      providesTags: ["UserInSession"],
    }),

    // Delete a user in session (Secretary access)
    deleteUserInSession: builder.mutation<ApiResponse<null>, DeleteUserInSessionRequest>({
      query: (body) => ({
        url: "/userinsession",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["UserInSession"],
    }),

    // Get a user in session by ID (Secretary access)
    getUserInSessionById: builder.query<ApiResponse<UserInSession>, string>({
      query: (id) => ({
        url: `/userinsession/${id}`,
        method: "GET",
      }),
      providesTags: ["UserInSession"],
    }),

    // Create a new user in session
    createUserInSession: builder.mutation<ApiResponse<UserInSession>, CreateUserInSessionRequest>({
      query: (body) => ({
        url: "/userinsession/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["UserInSession"],
    }),

    // Create UserInSession for free training session
    createFreeUserInSession: builder.mutation<
      ApiResponse<UserInSession>,
      CreateFreeUserInSessionRequest
    >({
      query: (body) => ({
        url: "/userinsession/create-free-session",
        method: "POST",
        body,
      }),
      invalidatesTags: ["UserInSession"],
    }),

    // Delete all users in sessions
    deleteAllUserInSessions: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: "/userinsession/delete-all",
        method: "DELETE",
      }),
      invalidatesTags: ["UserInSession"],
    }),

    // Get users by session ID
    getUserInSessionsBySessionId: builder.query<ApiResponse<UserInSession[]>, string>({
      query: (sessionId) => ({
        url: `/userinsession/session/${sessionId}`,
        method: "GET",
      }),
      providesTags: ["UserInSession"],
    }),

    // Get users by status
    getUserInSessionsByStatus: builder.query<ApiResponse<UserInSession[]>, UserInSessionStatus>({
      query: (status) => ({
        url: `/userinsession/status/${status}`,
        method: "GET",
      }),
      providesTags: ["UserInSession"],
    }),

    // Update a user in session
    updateUserInSession: builder.mutation<ApiResponse<UserInSession>, UpdateUserInSessionRequest>({
      query: (body) => ({
        url: "/userinsession/update",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["UserInSession"],
    }),

    // Get user sessions by user ID (Student access)
    getUserSessionsByUser: builder.query<ApiResponse<UserSessionStudentView[]>, void>({
      query: () => ({
        url: "/userinsession/user",
        method: "GET",
      }),
      providesTags: ["UserInSession"],
    }),
  }),
});

export const {
  useGetAllUserInSessionsQuery,
  useDeleteUserInSessionMutation,
  useGetUserInSessionByIdQuery,
  useCreateUserInSessionMutation,
  useCreateFreeUserInSessionMutation,
  useDeleteAllUserInSessionsMutation,
  useGetUserInSessionsBySessionIdQuery,
  useGetUserInSessionsByStatusQuery,
  useUpdateUserInSessionMutation,
  useGetUserSessionsByUserQuery,
} = userInSessionApi;
