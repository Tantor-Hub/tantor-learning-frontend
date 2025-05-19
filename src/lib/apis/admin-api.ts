import { baseQuery, createApi } from "./base-api";

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

export const AdminApi = createApi({
  reducerPath: "adminApi",
  baseQuery,
  tagTypes: ["Admin"],
  endpoints: (builder) => ({
    listUsers: builder.query<UsersListResponse, void>({
      query: () => "/api/users/listall",
      providesTags: ["Admin"],
    }),
  }),
});

export const { useListUsersQuery } = AdminApi;
