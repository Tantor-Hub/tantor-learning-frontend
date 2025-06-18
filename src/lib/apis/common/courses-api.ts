import {
  IAddDocumentsForACourseRequest,
  ICourseContentRequest,
  ICourseContentResponse,
  ICoursesAPIResponse,
} from "@/types/common/courses-api";
import { createApi, enhancedBaseQuery } from "../base-api";

// Courses API
export const coursesApi = createApi({
  reducerPath: "coursesApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["Courses"],
  endpoints: (builder) => ({
    // COURS
    addCourse: builder.mutation<
      {
        status: number; // should be 201 for created successuly request
        message: string;
      },
      {
        title: string;
        description: string;
      }
    >({
      query: (body) => ({
        url: "/api/courses/presets/add",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Courses"],
    }),
    listCourses: builder.query<ICoursesAPIResponse, void>({
      query: () => "/api/courses/presets/list",
      providesTags: ["Courses"],
    }),

    // MATIERES
    // Add a document for a course
    addDocumentsForACourse: builder.mutation<
      {
        status: number; // should be 201 for created successuly request
        message: string;
      },
      IAddDocumentsForACourseRequest
    >({
      query: (body) => ({
        url: "/api/courses/course/adddocuments",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Courses"],
    }),

    // Add a document for a course
    addCourseContent: builder.mutation<
      {
        status: number; // should be 201 for created successuly request
        message: string;
      },
      ICourseContentRequest
    >({
      query: (body) => ({
        url: "/api/courses/course/adddocuments",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Courses"],
    }),

    // get courses content
    getCourseContent: builder.query<ICourseContentResponse, { id_cours: string }>({
      query: ({ id_cours }) => `api/courses/course/${id_cours}`,
      providesTags: ["Courses"],
    }),
  }),
});

export const {
  useAddCourseMutation,
  useListCoursesQuery,
  useAddCourseContentMutation,
  useAddDocumentsForACourseMutation,
} = coursesApi;
