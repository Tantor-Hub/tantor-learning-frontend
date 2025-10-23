import { createApi, enhancedBaseQuery } from "./base-api";
import { SessionCourseResponse } from "@/types/session-courses";

// Session Course API

export const sessionCoursesApi = createApi({
  reducerPath: "sessionCoursesApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["SessionCourses"],
  endpoints: (builder) => ({
    getSessionCourseById: builder.query<SessionCourseResponse, string>({
      query: (id) => `sessioncours/${id}`,
      providesTags: ["SessionCourses"],
    }),
  }),
});

export const { useGetSessionCourseByIdQuery } = sessionCoursesApi;
