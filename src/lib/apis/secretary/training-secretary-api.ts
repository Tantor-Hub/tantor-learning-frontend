import { createApi, enhancedBaseQuery } from "../base-api";
import {
  IAddTrainingRequest,
  IListCategoryTrainingResponse,
  IListCourseBySessionIdResponse,
  ITrainingByIdResponse,
  ITrainingListResponse,
  ITrainingTypesResponse,
} from "@/types/secretary/training-secretary";

// Training Secretary API
export const trainingSecretaryApi = createApi({
  reducerPath: "trainingSecretaryApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["TrainingSecretary"],
  endpoints: (builder) => ({
    trainingList: builder.query<ITrainingListResponse, void>({
      query: () => "/api/formations/list",
      providesTags: ["TrainingSecretary"],
    }),
    addTraining: builder.mutation<void, IAddTrainingRequest>({
      query: (body) => ({
        url: "/api/formations/formation/add",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["TrainingSecretary"],
    }),
    listTrainingByCategory: builder.query<ITrainingListResponse, { id: string }>({
      query: ({ id }) => `/api/formations/list/bycategory/${id}`,
      providesTags: ["TrainingSecretary"],
    }),
    listTrainingById: builder.query<ITrainingByIdResponse, { id: string }>({
      query: ({ id }) => `/api/formations/formation/${id}`,
      providesTags: ["TrainingSecretary"],
    }),
    deleteTrainingById: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/api/formations/formation/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TrainingSecretary"],
    }),

    // ====================================================================
    // Liste de Training Type
    // =======================================================================
    listTrainingType: builder.query<ITrainingTypesResponse, void>({
      query: () => "/api/formations/types",
      providesTags: ["TrainingSecretary"],
    }),
    // =================================================================================
    // Category de Formation
    //===================================================================================
    listCategoryTraining: builder.query<IListCategoryTrainingResponse, void>({
      query: () => "/api/categories/list",
      providesTags: ["TrainingSecretary"],
    }),

    addCategoryTraining: builder.mutation<
      void,
      {
        category: string;
        description: string;
      }
    >({
      query: (request) => ({
        url: "/api/categories/category/add",
        method: "POST",
        body: request,
      }),
    }),

    updateCategoryTraining: builder.mutation<
      void,
      {
        category?: string;
        description?: string;
        id_thematique?: string;
      }
    >({
      query: (request) => ({
        url: `/api/categories/category/${request.id_thematique}`,
        method: "PUT",
        body: request,
      }),
    }),

    removeCategoryTrainingById: builder.mutation<void, { id_category: string }>({
      query: (request) => ({
        url: `/api/categories/categorie/${request.id_category}`,
        method: "DELETE",
      }),
    }),
    // =====================================================================
    // ajouter un cours dans une formation & assigne un instructeur
    // ======================================================================
    addNewCourseInSessionById: builder.mutation<
      void,
      {
        id_session: number;
        duree: number; // en minutes
        ponderation: number; //
        id_preset_cours: number;
        id_formateur: number; // not required tu peux ou ne pas le mettre
      }
    >({
      query: (request) => ({
        url: "/api/courses/course/add",
        method: "POST",
        body: request,
      }),
    }),
    // =====================================================================
    // LISTE DE COURS PAR ID DE LA SESSION
    // ====================================================================
    listCourseBySessionId: builder.query<IListCourseBySessionIdResponse, { id_session: string }>({
      query: (request) => `/api/courses/listall/${request.id_session}`,
      providesTags: ["TrainingSecretary"],
    }),
  }),
});

export const {
  useTrainingListQuery,
  useAddTrainingMutation,
  useDeleteTrainingByIdMutation,
  useListTrainingByIdQuery,
  useListTrainingTypeQuery,

  // category de formation

  useListCategoryTrainingQuery,
  useUpdateCategoryTrainingMutation,
  useRemoveCategoryTrainingByIdMutation,
  useAddCategoryTrainingMutation,

  // list course by session id

  useListCourseBySessionIdQuery,
} = trainingSecretaryApi;
