import { IUser, UserRole } from "@/types/user";
import { createApi, enhancedBaseQuery } from "./base-api";

// User related types
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string | null;
  address?: string | null;
  country?: string | null;
  city?: string | null;
  dateBirth?: string;
  num_piece_identite?: string | null;
  createdAt: string;
}

export interface ProfileUpdateResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string | null;
  address?: string | null;
  country?: string | null;
  city?: string | null;
  dateBirth?: string;
  num_piece_identite?: string | null;
  createdAt: string;
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  dateBirth?: string;
  num_piece_identite?: string;
}

export interface User {
  status: number;
  message: string;
  data: UserProfile;
}

interface IPublicUsers {
  status: number;
  message: string;
  data: {
    length: number;
    rows: Array<{
      id: number;
      firstName: string;
      lastName: string;
      avatar: string | null;
    }>;
  };
}

interface IListUserByRoleResponse {
  status: number;
  message: string;
  data: IUser[];
}

// Users API
export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    listUserByRole: builder.query<IListUserByRoleResponse, { role: UserRole | "all" }>({
      query: (request) => `users/byrole?role=${request.role}`,
    }),
    publicListUsers: builder.query<IPublicUsers, void>({
      query: () => "users/list",
      providesTags: ["User"],
    }),
    getUserProfile: builder.query<User, void>({
      query: () => "users/user/profile",
      providesTags: ["User"],
    }),
    updateUserProfile: builder.mutation<ProfileUpdateResponse, ProfileUpdateRequest>({
      query: (userData) => ({
        url: "users/user/update",
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    getAllUsers: builder.query<User[], void>({
      query: () => "users/listall",
      providesTags: ["User"],
    }),
    getUserById: builder.query<User, string>({
      query: (userId) => `users/user/${userId}`,
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),

    // change User Role -> Admin Access Only
    changeUserRole: builder.mutation<
      void,
      {
        email: string;
        role: UserRole;
      }
    >({
      query: (request) => ({
        url: "users/change-role",
        method: "PATCH",
        body: request,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  usePublicListUsersQuery,
  useListUserByRoleQuery,
  useLazyListUserByRoleQuery,
  useChangeUserRoleMutation,
} = usersApi;
