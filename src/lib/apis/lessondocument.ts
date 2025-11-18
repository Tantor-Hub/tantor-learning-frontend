import { createApi, fileUploadEnhancedBaseQuery } from "./base-api";
import { ILessonDocumentResponse } from "@/types/lessondocument";

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
  }),
});

export const {
  /*###############################################################################
    ######################### STUDENT ACCESS ########################################
    #################################################################################*/
  useGetLessonDocumentsQuery,

  /*###############################################################################
    ######################### INSTRUCTOR ACCESS ######################################
    #################################################################################*/
  useCreateLessonDocumentMutation,
} = lessonDocumentApi;
