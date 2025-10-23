import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ModuleDeFormation, GetModulesResponse } from "@/types/module-de-formation";
import { getValidAuthTokens } from "@/lib/cookies";

// Custom base query for form data
const formDataBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get token from cookies
    const { token } = getValidAuthTokens();

    if (token) {
      headers.set("x-connexion-tantor", `Bearer ${token}`);
    }
    // Don't set Content-Type for FormData, let browser set it with boundary
    return headers;
  },
});

// Module De Formation API
export const moduleDeFormationApi = createApi({
  reducerPath: "moduleDeFormationApi",
  baseQuery: formDataBaseQuery,
  tagTypes: ["ModuleDeFormation"],
  endpoints: (builder) => ({
    getModules: builder.query<GetModulesResponse, void>({
      query: () => ({
        url: "moduledeformation",
        method: "GET",
      }),
      providesTags: ["ModuleDeFormation"],
    }),
    createModule: builder.mutation<ModuleDeFormation, { description: string; piece_jointe: File }>({
      query: ({ description, piece_jointe }) => {
        const formData = new FormData();
        formData.append("description", description);
        formData.append("piece_jointe", piece_jointe);
        return {
          url: "moduledeformation",
          method: "POST",
          body: formData,
          headers: {
            // Don't set Content-Type — browser will set it for FormData
          },
        };
      },
      invalidatesTags: ["ModuleDeFormation"],
    }),
    updateModule: builder.mutation<
      ModuleDeFormation,
      { id: string; description: string; piece_jointe?: File }
    >({
      query: ({ id, description, piece_jointe }) => {
        const formData = new FormData();
        formData.append("description", description);
        if (piece_jointe) {
          formData.append("piece_jointe", piece_jointe);
        }
        return {
          url: `moduledeformation/${id}`,
          method: "PATCH",
          body: formData,
          headers: {
            // Don't set Content-Type — browser will set it for FormData
          },
        };
      },
      invalidatesTags: ["ModuleDeFormation"],
    }),
  }),
});

export const { useGetModulesQuery, useCreateModuleMutation, useUpdateModuleMutation } =
  moduleDeFormationApi;
