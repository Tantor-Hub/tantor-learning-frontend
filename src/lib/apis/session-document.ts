import { createApi, fileUploadEnhancedBaseQuery } from "./base-api";
import {
  SessionDocument,
  ApiResponse,
  CreateSessionDocumentRequest,
  UpdateSessionDocumentRequest,
  UpdateSessionDocumentSecretaryRequest,
} from "@/types/session-document";

// Session Document API

export const sessionDocumentApi = createApi({
  reducerPath: "sessionDocumentApi",
  baseQuery: fileUploadEnhancedBaseQuery,
  tagTypes: ["SessionDocuments"],
  endpoints: (builder) => ({
    // Get session document by ID
    getSessionDocumentById: builder.query<ApiResponse<SessionDocument>, string>({
      query: (id) => `sessiondocument/${id}`,
      providesTags: (result, error, id) => [{ type: "SessionDocuments", id }],
    }),

    // Delete session document by ID
    deleteSessionDocument: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `sessiondocument/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "SessionDocuments", id }],
    }),

    // Create a new session document
    createSessionDocument: builder.mutation<
      ApiResponse<SessionDocument>,
      CreateSessionDocumentRequest
    >({
      query: ({ type, id_session, categories, piece_jointe }) => {
        const formData = new FormData();
        formData.append("type", type);
        formData.append("id_session", id_session);
        formData.append("categories", categories);
        formData.append("document", piece_jointe);

        return {
          url: "sessiondocument/create",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["SessionDocuments"],
    }),

    // Get all session documents
    getAllSessionDocuments: builder.query<ApiResponse<SessionDocument[]>, void>({
      query: () => "sessiondocument/getall",
      providesTags: ["SessionDocuments"],
    }),

    // Get session documents by training session ID
    getSessionDocumentsBySessionId: builder.query<ApiResponse<SessionDocument[]>, string>({
      query: (sessionId) => `sessiondocument/session/${sessionId}`,
      providesTags: ["SessionDocuments"],
    }),

    // Get session documents by student ID
    getSessionDocumentsByStudentId: builder.query<ApiResponse<SessionDocument[]>, string>({
      query: (studentId) => `sessiondocument/student/${studentId}`,
      providesTags: ["SessionDocuments"],
    }),

    // Get student session documents by training session ID
    getStudentSessionDocumentsBySessionId: builder.query<
      ApiResponse<SessionDocument[]>,
      { sessionId: string; category?: "before" | "during" | "after" }
    >({
      query: ({ sessionId, category }) => {
        let url = `sessiondocument/student/session/${sessionId}`;
        if (category) {
          url += `?category=${category}`;
        }
        return url;
      },
      providesTags: ["SessionDocuments"],
    }),

    // Update session document by ID
    updateSessionDocument: builder.mutation<
      ApiResponse<SessionDocument>,
      { id: string; body: UpdateSessionDocumentRequest }
    >({
      query: ({ id, body }) => ({
        url: `sessiondocument/update/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "SessionDocuments", id }],
    }),

    // Get all session documents for secretary
    getAllSessionDocumentsForSecretary: builder.query<
      ApiResponse<SessionDocument[]>,
      { status?: "pending" | "rejected" | "validated"; sessionId?: string }
    >({
      query: ({ status, sessionId }) => {
        let url = "sessiondocument/secretary/getall";
        const params = new URLSearchParams();
        if (status) params.append("status", status);
        if (sessionId) params.append("sessionId", sessionId);
        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;
        return url;
      },
      providesTags: ["SessionDocuments"],
    }),

    // Update session document by secretary (Secretary only)
    updateSessionDocumentSecretary: builder.mutation<
      ApiResponse<SessionDocument>,
      { id: string; body: UpdateSessionDocumentSecretaryRequest }
    >({
      query: ({ id, body }) => ({
        url: `sessiondocument/secretary/update/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["SessionDocuments"],
    }),
  }),
});

export const {
  useGetSessionDocumentByIdQuery,
  useDeleteSessionDocumentMutation,
  useCreateSessionDocumentMutation,
  useGetAllSessionDocumentsQuery,
  useGetSessionDocumentsBySessionIdQuery,
  useGetSessionDocumentsByStudentIdQuery,
  useGetStudentSessionDocumentsBySessionIdQuery,
  useUpdateSessionDocumentMutation,
  useGetAllSessionDocumentsForSecretaryQuery,
  useUpdateSessionDocumentSecretaryMutation,
} = sessionDocumentApi;
