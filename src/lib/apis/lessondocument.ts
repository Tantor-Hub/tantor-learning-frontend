import { createApi, enhancedBaseQuery } from "./base-api";
import { ILessonDocumentResponse } from "@/types/lessondocument";

// Lesson Document API
export const lessonDocumentApi = createApi({
  reducerPath: "lessonDocumentApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["LessonDocument"],
  endpoints: (builder) => ({
    /*###############################################################################
    ######################### STUDENT ACCESS ########################################
    #################################################################################*/

    getLessonDocuments: builder.query<ILessonDocumentResponse, { lessonId: string }>({
      query: (request) => `lessondocument/student/lesson/${request.lessonId}`,
      providesTags: ["LessonDocument"],
    }),
  }),
});

export const {
  /*###############################################################################
    ######################### STUDENT ACCESS ########################################
    #################################################################################*/
  useGetLessonDocumentsQuery,
} = lessonDocumentApi;
