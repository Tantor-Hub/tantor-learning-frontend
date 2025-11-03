import { createApi, enhancedBaseQuery } from "./base-api";
import {
  CatalogueFormation,
  CreateCatalogueFormationRequest,
  UpdateCatalogueFormationRequest,
} from "@/types/catalogue-formation";

export const catalogueFormationApi = createApi({
  reducerPath: "catalogueFormationApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["CatalogueFormation"],
  endpoints: (builder) => ({
    // Get all catalogue formations (Secretary access)
    getCatalogueFormations: builder.query<
      { data: { catalogueformations: CatalogueFormation[] } },
      void
    >({
      query: () => ({
        url: "catalogueformation/getall",
        method: "GET",
      }),
      providesTags: ["CatalogueFormation"],
    }),

    // Create a new catalogue formation (Admin only)
    createCatalogueFormation: builder.mutation<CatalogueFormation, CreateCatalogueFormationRequest>(
      {
        query: (body) => ({
          url: "catalogueformation",
          method: "POST",
          body,
        }),
        invalidatesTags: ["CatalogueFormation"],
      }
    ),

    // Get a specific catalogue formation by ID
    getCatalogueFormation: builder.query<CatalogueFormation, string>({
      query: (id) => ({
        url: `catalogueformation/${id}`,
        method: "GET",
      }),
      providesTags: ["CatalogueFormation"],
    }),

    // Update a catalogue formation (Admin only)
    updateCatalogueFormation: builder.mutation<
      CatalogueFormation,
      { id: string; data: UpdateCatalogueFormationRequest }
    >({
      query: ({ id, data }) => ({
        url: `catalogueformation/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["CatalogueFormation"],
    }),

    // Delete a catalogue formation (Admin only)
    deleteCatalogueFormation: builder.mutation<void, string>({
      query: (id) => ({
        url: `catalogueformation/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CatalogueFormation"],
    }),

    // Get catalogue formation for students
    getCatalogueFormationForStudent: builder.query<
      { status: number; message: string; data: CatalogueFormation },
      void
    >({
      query: () => ({
        url: "catalogueformation/student",
        method: "GET",
      }),
      providesTags: ["CatalogueFormation"],
    }),

    // Get catalogue formation for instructors
    getCatalogueFormationForInstructor: builder.query<
      { status: number; message: string; data: CatalogueFormation },
      void
    >({
      query: () => ({
        url: "catalogueformation/instructor",
        method: "GET",
      }),
      providesTags: ["CatalogueFormation"],
    }),

    // Get catalogue formation for secretaries
    getCatalogueFormationForSecretary: builder.query<
      { status: number; message: string; data: CatalogueFormation },
      void
    >({
      query: () => ({
        url: "catalogueformation/secretary",
        method: "GET",
      }),
      providesTags: ["CatalogueFormation"],
    }),
  }),
});

export const {
  useGetCatalogueFormationsQuery,
  useCreateCatalogueFormationMutation,
  useGetCatalogueFormationQuery,
  useUpdateCatalogueFormationMutation,
  useDeleteCatalogueFormationMutation,
  useGetCatalogueFormationForStudentQuery,
  useGetCatalogueFormationForInstructorQuery,
  useGetCatalogueFormationForSecretaryQuery,
} = catalogueFormationApi;
