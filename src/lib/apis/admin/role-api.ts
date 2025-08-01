import { IRoleResponse } from "@/types/admin/role-api";
import { baseQuery, createApi, enhancedBaseQuery } from "../base-api";

// ROLE API
export const roleApi = createApi({
  reducerPath: "roleApi",
  baseQuery,
  tagTypes: ["Role"],
  endpoints: (builder) => ({
    // CREATE A NEW ROLE
    createRole: builder.mutation<
      { status: number },
      {
        role: string;
        description: string;
      }
    >({
      query: (body) => ({
        url: "roles/role/add",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Role"],
    }),
    // LIST ALL AVAILABLE ROLE
    listRole: builder.query<IRoleResponse, void>({
      query: () => "roles/list",
      providesTags: ["Role"],
    }),
    // ATTRIBUTE A USER A NEW ROLE
    attributeUserRole: builder.mutation<
      void,
      {
        id_user: number;
        id_role: number;
        description?: string;
      }
    >({
      query: (body) => ({
        url: `roles/role/attribute`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Role"],
    }),
  }),
});

export const { useCreateRoleMutation, useListRoleQuery, useAttributeUserRoleMutation } = roleApi;
