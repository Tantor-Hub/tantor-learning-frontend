import { baseQuery, createApi } from "../base-api";

interface UserRole {
  id: number;
  role: string;
  HasRoles: {
    id: number;
    UserId: number;
    RoleId: number;
    status: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface User {
  id: number;
  uuid: string;
  fs_name: string;
  ls_name: string;
  nick_name: string;
  email: string;
  phone: string | null;
  last_login: string | null;
  num_record: string;
  avatar: string | null;
  adresse_physique: string | null;
  pays_residance: string | null;
  ville_residance: string | null;
  num_piece_identite: string | null;
  can_update_password: number;
  createdAt: string;
  updatedAt: string;
  roles: UserRole[];
}

export interface UsersListResponse {
  status: number;
  message: string;
  data: {
    length: number;
    rows: User[];
  };
}

export interface IUsersListByGroupResponse {
  status: number;
  message: string;
  data: {
    length: number;
    list: User[];
  };
}

export interface AddUserRequest {
  fs_name: string;
  ls_name: string;
  password: string;
  nick_name: string; // ie. username CFR. to the mockup on figma
  email: string;
  id_role: number;
  phone: string;
}

export interface AddUserResponse {
  status: number;
  message: string;
}

export const AdminApi = createApi({
  reducerPath: "adminApi",
  baseQuery,
  tagTypes: ["Admin"],
  endpoints: (builder) => ({
    listUsers: builder.query<UsersListResponse, void>({
      query: () => "users/listall",
      providesTags: ["Admin"],
    }),
    add: builder.mutation<AddUserResponse, AddUserRequest>({
      query: (userData) => ({
        url: "users/user/add",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Admin"],
    }),
    listUserByGroup: builder.query<
      IUsersListByGroupResponse,
      { group: "teacher" | "admin" | "student" | "secretary" | "all" }
    >({
      query: (request) => `users/list/bygroup/${request.group}`,
      providesTags: ["Admin"],
    }),
  }),
});

export const { useListUsersQuery, useAddMutation, useListUserByGroupQuery } = AdminApi;
