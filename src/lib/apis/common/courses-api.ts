import {
  IAddDocumentsForACourseRequest,
  ICourseContentRequest,
  ICourseContentResponse,
  ICoursesAPIResponse,
  IUpdateCourseRequest,
  IUpdateCourseResponse,
} from "@/types/common/courses-api";
import { createApi, enhancedBaseQuery } from "../base-api";
import { IAddMatiere } from "@/types/instructor";

interface ICourse {
  status: number;
  message: string;
  data: {
    length: number;
    rows: Array<{
      id: number;
      title: string;
      description: string;
      is_published: boolean;
      id_formateurs: Array<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
      }>;
    }>;
  };
}

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
      IAddMatiere
    >({
      query: (body) => ({
        url: "sessioncours/create",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["ManageCourses"],
    }),
    listCourses: builder.query<ICoursesAPIResponse, void>({
      query: () => "sessioncours/getall",
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

    // FIRMIN

    // GET ALL COURSES
    course: builder.query<ICourse, void>({
      query: () => `sessioncours/getall`,
      providesTags: ["ManageCourses"],
    }),

    // UPDATE COURSE
    updateCourse: builder.mutation<IUpdateCourseResponse, IUpdateCourseRequest>({
      query: (body) => ({
        url: "/api/courses/update",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["ManageCourses"],
    }),

    listCourseBySessionId: builder.query<ICoursesAPIResponse, { trainingSessionId: string }>({
      query: (request) => `courses/trainingsession/${request.trainingSessionId}`,
      providesTags: ["ManageCourses"],
    }),
  }),
});

export const {
  useAddCourseMutation,
  useListCourseBySessionIdQuery,
  useListCoursesQuery,
  useAddCourseContentMutation,
  useAddDocumentsForACourseMutation,
  useCourseQuery,
  useUpdateCourseMutation,
} = manageCoursesApi;
