import { IAddMatiere } from "@/types/instructor";
import { createApi, enhancedBaseQuery } from "../base-api";

// Instructor API
export const instructorApi = createApi({
  reducerPath: "instructorApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["Instructor"],
  endpoints: (builder) => ({
    listSessionsCoursesByInstructorId: builder.query({
      query: () => "/api/sessions/list/listebyformateur",
      providesTags: ["Instructor"],
    }),
    assignCourseToInstructor: builder.mutation<
      void,
      {
        id_user: number;
        id_cours: number;
      }
    >({
      query: (request) => ({
        url: "/api/sessions/session/assign",
        method: "PUT",
        body: request,
      }),
    }),

    listStudentBySessionId: builder.query<void, { idsession: string }>({
      query: (request) => `/api/sessions/students/list/${request.idsession}`,
      providesTags: ["Instructor"],
    }),

    listSessionByInstructorId: builder.query<void, { id_instructeur: string }>({
      query: (request) => `/api/sessions/list/listebyformateur/${request.id_instructeur}`,
      providesTags: ["Instructor"],
    }),

    listAllStudents: builder.query({
      query: () => "/api",
    }),

    /*
    =================================================================================
    MATIERES API
    =================================================================================
    */

    addMatiere: builder.mutation<void, IAddMatiere>({
      query: (request) => ({
        url: "/api/courses/course/addcontent",
        method: "POST",
        body: request,
      }),
    }),

    addDocumentToCourse: builder.mutation<
      void,
      {
        document_name: string;
        piece_jointe: File;
        id_cours: string;
        id_session: string;
      }
    >({
      query: (request) => {
        const formData = new FormData();
        formData.append("document_name", request.document_name);
        formData.append("piece_jointe", request.piece_jointe);
        formData.append("id_cours", request.id_cours);
        formData.append("id_session", request.id_session);

        return {
          url: "/api/courses/course/adddocuments",
          method: "POST",
          body: formData,
          // Don't set Content-Type header - the browser will set it automatically
          // with the correct boundary for FormData
          headers: {},
        };
      },
    }),
  }),
});

export const {} = instructorApi;
