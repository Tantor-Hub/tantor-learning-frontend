import { createApi, enhancedBaseQuery } from "./base-api";
import {
  Lesson,
  LessonsResponse,
  StudentLessonsResponse,
  ApiResponse,
  CreateLessonRequest,
  UpdateLessonRequest,
  DeleteLessonRequest,
} from "@/types/lessons";

// Lessons API

export const lessonsApi = createApi({
  reducerPath: "lessonsApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["Lessons"],
  endpoints: (builder) => ({
    // Get lesson by ID
    getLessonById: builder.query<ApiResponse<Lesson>, string>({
      query: (id) => `lesson/${id}`,
      providesTags: (result, error, id) => [{ type: "Lessons", id }],
    }),

    // Get lessons by course ID
    getLessonsByCourseId: builder.query<ApiResponse<LessonsResponse>, string>({
      query: (courseId) => `lesson/cours/${courseId}/lessons`,
      providesTags: ["Lessons"],
    }),

    // Create a new lesson
    createLesson: builder.mutation<ApiResponse<Lesson>, CreateLessonRequest>({
      query: (body) => ({
        url: "lesson/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Lessons"],
    }),

    // Delete lesson
    deleteLesson: builder.mutation<ApiResponse<void>, DeleteLessonRequest>({
      query: (body) => ({
        url: "lesson/delete",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Lessons"],
    }),

    // Get all lessons
    getAllLessons: builder.query<ApiResponse<Lesson[]>, void>({
      query: () => "lesson/getall",
      providesTags: ["Lessons"],
    }),

    // Get lessons by sessioncours ID (Student access)
    getStudentLessonsBySessionCourseId: builder.query<ApiResponse<StudentLessonsResponse>, string>({
      query: (sessionCourseId) => `lesson/student/cours/${sessionCourseId}/lessons`,
      providesTags: ["Lessons"],
    }),

    // Update lesson by ID
    updateLesson: builder.mutation<ApiResponse<Lesson>, UpdateLessonRequest>({
      query: (body) => ({
        url: "lesson/update",
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Lessons", id: arg.id }],
    }),

    getLessonBySessionCourseIdSecretaryAccess: builder.query<ApiResponse<LessonsResponse>, string>({
      query: (sessionCourseId) => `lesson/secretary/cours/${sessionCourseId}/lessons`,
      providesTags: ["Lessons"],
    }),
  }),
});

export const {
  useGetLessonByIdQuery,
  useGetLessonsByCourseIdQuery,
  useCreateLessonMutation,
  useDeleteLessonMutation,
  useGetAllLessonsQuery,
  useGetStudentLessonsBySessionCourseIdQuery,
  useUpdateLessonMutation,
  useLazyGetLessonBySessionCourseIdSecretaryAccessQuery,
} = lessonsApi;
