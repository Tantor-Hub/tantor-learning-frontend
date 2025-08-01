// File: src/lib/api/formations-api.ts
import { baseQuery, createApi, enhancedBaseQuery } from "./base-api";

// Formation related types
export interface Formation {
  id: string;
  title: string;
  description: string;
  thematicId?: string;
  categoryId?: string;
  // Add other formation properties as needed
}

export interface FormationType {
  id: string;
  name: string;
  // Add other formation type properties
}

export interface CreateFormationRequest {
  title: string;
  sous_titre: string;
  piece_jointe: File;
  type_formation: string;
  id_thematic: number;
  id_category: number;
  description: string;
  duree: string;
  start_on: string;
  end_on: string;
  prix: number;
}

// Formations API
export const formationsApi = createApi({
  reducerPath: "formationsApi",
  baseQuery,
  tagTypes: ["Formation"],
  endpoints: (builder) => ({
    getAllFormations: builder.query<Formation[], void>({
      query: () => "formations/list",
      providesTags: ["Formation"],
    }),
    getFormationsByThematic: builder.query<Formation[], string>({
      query: (thematicId) => `formations/list/bythematic/${thematicId}`,
      providesTags: ["Formation"],
    }),
    getFormationsByCategory: builder.query<Formation[], string>({
      query: (categoryId) => `formations/list/bycategory/${categoryId}`,
      providesTags: ["Formation"],
    }),
    getFormationsByThematicAndCategory: builder.query<
      Formation[],
      { thematicId: string; categoryId: string }
    >({
      query: ({ thematicId, categoryId }) => `formations/list/by/${thematicId}/${categoryId}`,
      providesTags: ["Formation"],
    }),
    createFormation: builder.mutation<Formation, CreateFormationRequest>({
      query: (formationData) => ({
        url: "formations/formation/add",
        method: "POST",
        body: formationData,
      }),
      invalidatesTags: ["Formation"],
    }),
    getFormationTypes: builder.query<FormationType[], void>({
      query: () => "formations/types",
      providesTags: ["Formation"],
    }),
  }),
});

export const {
  useGetAllFormationsQuery,
  useGetFormationsByThematicQuery,
  useGetFormationsByCategoryQuery,
  useGetFormationsByThematicAndCategoryQuery,
  useCreateFormationMutation,
  useGetFormationTypesQuery,
} = formationsApi;
