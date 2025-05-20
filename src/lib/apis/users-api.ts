// File: src/lib/api/users-api.ts
import { baseQuery, createApi } from "./base-api";

// User related types
export interface User {
  id: string;
  username: string;
  email: string;
  fs_name?: string;
  ls_name?: string;
  nick_name?: string;
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

export interface GetUserProfileResponse {
  status: number;
  message: string;
  data: {
    id: number;
    fs_name: string;
    ls_name: string;
    nick_name: string;
    email: string;
    phone?: string;
    avatar?: string | null;
    adresse_physique?: string | null;
    pays_residance?: string | null;
    ville_residance?: string | null;
    num_piece_identite?: string | null;
    createdAt: string;
    roles: {
      id: number;
      role: string;
      description: string;
      HasRoles: {
        id: number;
        UserId: number;
        RoleId: number;
        status: number;
        createdAt: string;
        updatedAt: string;
      };
    }[];
  };
}

// Users API
export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUserProfile: builder.query<GetUserProfileResponse, void>({
      query: () => "/api/users/user/profile",
      providesTags: ["User"],
    }),
    updateUserProfile: builder.mutation<User, ProfileUpdateRequest>({
      query: (userData) => ({
        url: "/api/users/user/update",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    getAllUsers: builder.query<User[], void>({
      query: () => "/api/users/listall",
      providesTags: ["User"],
    }),
    getUserById: builder.query<User, string>({
      query: (userId) => `/api/users/user/${userId}`,
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
} = usersApi;
