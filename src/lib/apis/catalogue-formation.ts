import { createApi, enhancedBaseQuery, fileUploadEnhancedBaseQuery } from "./base-api";
import {
  CatalogueFormation,
  CreateCatalogueFormationRequest,
  UpdateCatalogueFormationRequest,
} from "@/types/catalogue-formation";

export const catalogueFormationApi = createApi({
  reducerPath: "catalogueFormationApi",
  baseQuery: fileUploadEnhancedBaseQuery,
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

    // Get catalogue formations by training ID (Secretary only)
    getCatalogueFormationsByTrainingId: builder.query<
      { status: number; message: string; data: CatalogueFormation[] },
      string
    >({
      query: (trainingId) => ({
        url: `catalogueformation/secretary/training/${trainingId}`,
        method: "GET",
      }),
      providesTags: ["CatalogueFormation"],
    }),

    getCatalogueFormationsByTrainingIdPublic: builder.query<
      { status: number; message: string; data: CatalogueFormation[] },
      string
    >({
      query: (trainingId) => ({
        url: `catalogueformation/training/${trainingId}`,
        method: "GET",
      }),
      providesTags: ["CatalogueFormation"],
    }),

    // Create a student type catalogue formation (Secretary only)
    createStudentCatalogueFormation: builder.mutation<
      CatalogueFormation,
      { title: string; description?: string; id_training: string; piece_jointe?: File }
    >({
      query: ({ title, description, id_training, piece_jointe }) => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("id_training", id_training);
        if (description) formData.append("description", description);
        if (piece_jointe) formData.append("document", piece_jointe);

        return {
          url: "catalogueformation/student",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["CatalogueFormation"],
    }),

    // Update student type catalogue formation (Secretary only)
    updateStudentCatalogueFormation: builder.mutation<
      CatalogueFormation,
      { id: string; title: string; description?: string; piece_jointe?: File }
    >({
      query: ({ id, title, description, piece_jointe }) => {
        const formData = new FormData();
        formData.append("title", title);
        if (description) formData.append("description", description);
        if (piece_jointe) formData.append("document", piece_jointe);

        return {
          url: `catalogueformation/student/${id}`,
          method: "PATCH",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["CatalogueFormation"],
    }),

    // Delete student type catalogue formation (Secretary only)
    deleteStudentCatalogueFormation: builder.mutation<void, void>({
      query: () => ({
        url: "catalogueformation/student",
        method: "DELETE",
      }),
      invalidatesTags: ["CatalogueFormation"],
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
  useGetCatalogueFormationsByTrainingIdQuery,
  useGetCatalogueFormationsByTrainingIdPublicQuery,
  useCreateStudentCatalogueFormationMutation,
  useUpdateStudentCatalogueFormationMutation,
  useDeleteStudentCatalogueFormationMutation,
} = catalogueFormationApi;
