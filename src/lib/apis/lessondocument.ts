import { createApi, fileUploadEnhancedBaseQuery } from "./base-api";
import { ILessonDocumentResponse, ILessonDocumentByIdResponse } from "@/types/lessondocument";

// Lesson Document API
export const lessonDocumentApi = createApi({
  reducerPath: "lessonDocumentApi",
  baseQuery: fileUploadEnhancedBaseQuery,
  tagTypes: ["LessonDocument"],
  endpoints: (builder) => ({
    /*###############################################################################
    ######################### STUDENT ACCESS ########################################
    #################################################################################*/

    getLessonDocuments: builder.query<ILessonDocumentResponse, { lessonId: string }>({
      query: (request) => `lessondocument/student/lesson/${request.lessonId}`,
      providesTags: ["LessonDocument"],
    }),

    getLessonDocumentById: builder.query<ILessonDocumentByIdResponse, { id: string }>({
      query: (request) => `lessondocument/${request.id}`,
      providesTags: ["LessonDocument"],
    }),

    /*###############################################################################
    ######################### INSTRUCTOR ACCESS ######################################
    #################################################################################*/

    createLessonDocument: builder.mutation<ILessonDocumentResponse, FormData>({
      query: (formData) => ({
        url: "lessondocument/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["LessonDocument"],
    }),

    updateLessonDocument: builder.mutation<
      ILessonDocumentByIdResponse,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `lessondocument/instructor/update/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["LessonDocument"],
    }),
  }),
});

export const {
  /*###############################################################################
    ######################### STUDENT ACCESS ########################################
    #################################################################################*/
  useGetLessonDocumentsQuery,
  useGetLessonDocumentByIdQuery,

  /*###############################################################################
    ######################### INSTRUCTOR ACCESS ######################################
    #################################################################################*/
  useCreateLessonDocumentMutation,
  useUpdateLessonDocumentMutation,
} = lessonDocumentApi;
