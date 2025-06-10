// File: src/lib/api/users-api.ts
import { createApi, enhancedBaseQuery } from "./base-api";

// User related types
export interface ProfileUpdateResponse {
  // username: string;
  fs_name: string;
  ls_name: string;
  nick_name: string;
  id: string;
  email: string;
  phone: string;
  // avatar?: string | null;
  adresse_physique?: string | null;
  pays_residance?: string | null;
  ville_residance?: string | null;
  num_piece_identite?: string | null;
  createdAt: string;
  roles?: {
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
  // Add other user properties as needed
}

export interface ProfileUpdateRequest {
  avatar?: string;
  adresse_physique?: string;
  pays_residance?: string;
  num_piece_identite?: string;
  ville_residance?: string;
  phone?: string;
}

export interface User {
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
  baseQuery: enhancedBaseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUserProfile: builder.query<User, void>({
      query: () => "/api/users/user/profile",
      providesTags: ["User"],
    }),
    updateUserProfile: builder.mutation<ProfileUpdateResponse, ProfileUpdateRequest>({
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
