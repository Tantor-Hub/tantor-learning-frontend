// File: src/lib/api/categories-api.ts
import { baseQuery, createApi } from "./base-api";

// Category related types
export interface Thematic {
  thematic: string;
  description: string;
  // Add other thematic properties
}

export interface CreateThematicRequest {
  thematic: string;
  description: string;
  // Add other thematic creation fields
}

export interface UpdateThematicRequest {
  thematic: string;
  description: string;
  // Add other thematic update fields
}

// Categories API
export const thematicsApi = createApi({
  reducerPath: "thematicsApi",
  baseQuery,
  tagTypes: ["Thematic"],
  endpoints: (builder) => ({
    createThematic: builder.mutation<Thematic, CreateThematicRequest>({
      query: (thematicData) => ({
        url: "/api/categories/thematic/add",
        method: "POST",
        body: thematicData,
      }),
      invalidatesTags: ["Thematic"],
    }),
    getAllThematics: builder.query<Thematic[], void>({
      query: () => "/api/categories/thematics",
      providesTags: ["Thematic"],
    }),
    updateThematic: builder.mutation<Thematic, { id: string; data: UpdateThematicRequest }>({
      query: ({ id, data }) => ({
        url: `/api/categories/thematic/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Thematic"],
    }),
  }),
});

export const { useCreateThematicMutation, useGetAllThematicsQuery, useUpdateThematicMutation } =
  thematicsApi;
