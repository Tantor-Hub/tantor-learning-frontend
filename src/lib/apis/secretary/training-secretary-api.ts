import { createApi, enhancedBaseQuery } from "../base-api";
import {
  ICreateTrainingRequest,
  IUpdateTrainingRequest,
  IListCategoryTrainingResponse,
  IListCourseBySessionIdResponse,
  ITrainingListResponse,
  ITrainingTypesResponse,
  IListTrainingByIdResponse,
} from "@/types/secretary/training-secretary";

// Training Secretary API
export const trainingSecretaryApi = createApi({
  reducerPath: "trainingSecretaryApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["TrainingSecretary"],
  endpoints: (builder) => ({
    // ########################################################
    // ************ SECRETARY TRAININGS ENDPOINTS *************
    // ########################################################
    // get All
    listTraining: builder.query<ITrainingListResponse, void>({
      query: () => "trainings/getlist",
      providesTags: ["TrainingSecretary"],
    }),
    // create a training
    createTraining: builder.mutation<void, ICreateTrainingRequest>({
      query: (request) => ({
        url: "trainings/create",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["TrainingSecretary"],
    }),
    // update a training
    updateTraining: builder.mutation<void, IUpdateTrainingRequest>({
      query: (request) => ({
        url: `training/update/${request.id}`,
        method: "PATCH",
        body: request,
      }),
      invalidatesTags: ["TrainingSecretary"],
    }),
    // get By id
    listTrainingById: builder.query<IListTrainingByIdResponse, { id: string }>({
      query: (request) => `trainings/${request.id}`,
      providesTags: ["TrainingSecretary"],
    }),
    listTrainingByCategory: builder.query<ITrainingListResponse, { id: string }>({
      query: ({ id }) => `formations/list/bycategory/${id}`,
      providesTags: ["TrainingSecretary"],
    }),

    // remove a training
    deleteTrainingById: builder.mutation<void, { id: string }>({
      query: (request) => ({
        url: "trainings",
        method: "DELETE",
        body: request,
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
      query: () => "trainingcategory/getall",
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
        url: "trainingcategory/create",
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
        url: `trainingcategory/update`,
        method: "PATCH",
        body: request,
      }),
    }),

    removeCategoryTrainingById: builder.mutation<void, { id: string }>({
      query: (request) => ({
        url: "trainingcategory/delete",
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
  // ########################################################
  // *********** TRAININGS ENDPOINTS EXPORT *************
  // ########################################################
  useListTrainingQuery,
  useCreateTrainingMutation,
  useUpdateTrainingMutation,
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
