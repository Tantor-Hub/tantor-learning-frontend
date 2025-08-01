import {
  IAddDocumentsForACourseRequest,
  ICourseContentRequest,
  ICourseContentResponse,
  ICoursesAPIResponse,
} from "@/types/common/courses-api";
import { createApi, enhancedBaseQuery } from "../base-api";

// Courses API
export const manageCoursesApi = createApi({
  reducerPath: "manageCoursesApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["ManageCourses"],
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
        url: "courses/presets/add",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["ManageCourses"],
    }),
    listCourses: builder.query<ICoursesAPIResponse, void>({
      query: () => "courses/presets/list",
      providesTags: ["ManageCourses"],
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
        url: "courses/course/adddocuments",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["ManageCourses"],
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
        url: "courses/course/adddocuments",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["ManageCourses"],
    }),

    // get courses content
    getCourseContent: builder.query<ICourseContentResponse, { id_cours: string }>({
      query: ({ id_cours }) => `api/courses/course/${id_cours}`,
      providesTags: ["ManageCourses"],
    }),
  }),
});

export const {
  useAddCourseMutation,
  useListCoursesQuery,
  useAddCourseContentMutation,
  useAddDocumentsForACourseMutation,
} = manageCoursesApi;
