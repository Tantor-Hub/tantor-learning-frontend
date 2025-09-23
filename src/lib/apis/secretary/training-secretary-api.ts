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
      query: () => "formations/list",
      providesTags: ["TrainingSecretary"],
    }),
    addTraining: builder.mutation<void, IAddTrainingRequest>({
      query: (request) => ({
        url: "formations/formation/add",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["TrainingSecretary"],
    }),
    listTrainingByCategory: builder.query<ITrainingListResponse, { id: string }>({
      query: ({ id }) => `formations/list/bycategory/${id}`,
      providesTags: ["TrainingSecretary"],
    }),
    listTrainingById: builder.query<ITrainingByIdResponse, { id: string }>({
      query: ({ id }) => `formations/formation/${id}`,
      providesTags: ["TrainingSecretary"],
    }),
    deleteTrainingById: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `formations/formation/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TrainingSecretary"],
    }),

    // ====================================================================
    // Liste de Training Type
    // =======================================================================
    listTrainingType: builder.query<ITrainingTypesResponse, void>({
      query: () => "formations/types",
      providesTags: ["TrainingSecretary"],
    }),
    // =================================================================================
    // Category de Formation
    //===================================================================================
    listCategoryTraining: builder.query<IListCategoryTrainingResponse, void>({
      query: () => "trainingcategy/getall",
      providesTags: ["TrainingSecretary"],
    }),

    createCategory: builder.mutation<
      {
        status: number;
        message: string;
        data: {
          id: string;
          description: string;
          createdAt: string;
          updatedAt: string;
        };
      },
      {
        id?: string;
        title: string;
        description: string;
      }
    >({
      query: (request) => ({
        url: "trainingcategy/create",
        method: "POST",
        body: request,
      }),
    }),

    updateCategoryTraining: builder.mutation<
      void,
      {
        title: string;
        description?: string;
        id: string;
      }
    >({
      query: (request) => ({
        url: `trainingcategy/update`,
        method: "PATCH",
        body: request,
      }),
    }),

    removeCategoryTrainingById: builder.mutation<void, { id: string }>({
      query: (request) => ({
        url: `trainingcategy/delete`,
        method: "DELETE",
        body: request,
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
        url: "courses/course/add",
        method: "POST",
        body: request,
      }),
    }),
    // =====================================================================
    // LISTE DE COURS PAR ID DE LA SESSION
    // ====================================================================
    listCourseBySessionId: builder.query<IListCourseBySessionIdResponse, { id_session: string }>({
      query: (request) => `courses/listall/${request.id_session}`,
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
  useCreateCategoryMutation,

  // list course by session id
  useAddNewCourseInSessionByIdMutation,
  useListCourseBySessionIdQuery,
} = trainingSecretaryApi;
