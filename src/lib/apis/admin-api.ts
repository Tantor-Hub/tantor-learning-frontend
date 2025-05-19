import { baseQuery, createApi } from "./base-api";

// User related types
export interface User {
  id: string;
  username: string;
  email: string;
  fs_name?: string;
  ls_name?: string;
  nick_name?: string;
  data?: any;
  // Add other user properties as needed
}

export interface ProfileUpdateRequest {
  // Define the fields that can be updated in a profile
  fs_name?: string;
  ls_name?: string;
  email?: string;
  avatar?: File;
  phone?: string;
  // Add other updatable fields
}

// Admin API
export const AdminApi = createApi({
  reducerPath: "adminApi",
  baseQuery,
  tagTypes: ["Admin"],
  endpoints: (builder) => ({
    getUserProfile: builder.query<User, void>({
      query: () => "/api/users/user/profile",
      providesTags: ["Admin"],
    }),
    updateUserProfile: builder.mutation<User, ProfileUpdateRequest>({
      query: (userData) => ({
        url: "/api/users/user/update",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["Admin"],
    }),
    getAllUsers: builder.query<User[], void>({
      query: () => "/api/users/listall",
      providesTags: ["Admin"],
    }),
    getUserById: builder.query<User, string>({
      query: (userId) => `/api/users/user/${userId}`,
      providesTags: (result, error, userId) => [{ type: "Admin", id: userId }],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
} = AdminApi;
