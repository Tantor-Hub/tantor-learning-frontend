import { baseQuery, createApi } from "../base-api";

export const documentStudentApi = createApi({
  reducerPath: "documentStudentApi",
  baseQuery,
  tagTypes: ["DocumentStudent"],
  endpoints: (builder) => ({
    // Get documents for a specific session/group/student
    listStudentDocBySessionId: builder.query<
      void,
      { id_student: number; id_session: number; group: string }
    >({
      query: ({ id_student, id_session, group }) =>
        `/api/sessions/session/documents/${id_student}/${id_session}/${group}`,
      providesTags: ["DocumentStudent"],
    }),

    // Upload document BEFORE the training
    uploadDocumentBefore: builder.mutation<
      void,
      { id_session: string; document: File; key_document: string; description: string }
    >({
      query: ({ id_session, document, key_document, description }) => {
        const formData = new FormData();
        formData.append("id_session", id_session);
        formData.append("document", document);
        formData.append("key_document", key_document);
        formData.append("description", description);

        return {
          url: "/api/sessions/session/document/before",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["DocumentStudent"],
    }),

    // Upload document DURING the training
    uploadDocumentDuring: builder.mutation<
      void,
      { id_session: string; document: File; key_document: string; description: string }
    >({
      query: ({ id_session, document, key_document, description }) => {
        const formData = new FormData();
        formData.append("id_session", id_session);
        formData.append("document", document);
        formData.append("key_document", key_document);
        formData.append("description", description);

        return {
          url: "/api/sessions/session/document/during",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["DocumentStudent"],
    }),

    // Upload document AFTER the training
    uploadDocumentAfter: builder.mutation<
      void,
      { id_session: string; document: File; key_document: string; description: string }
    >({
      query: ({ id_session, document, key_document, description }) => {
        const formData = new FormData();
        formData.append("id_session", id_session);
        formData.append("document", document);
        formData.append("key_document", key_document);
        formData.append("description", description);

        return {
          url: "/api/sessions/session/document/after",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["DocumentStudent"],
    }),
  }),
});

export const {
  useListStudentDocBySessionIdQuery,
  useUploadDocumentAfterMutation,
  useUploadDocumentBeforeMutation,
  useUploadDocumentDuringMutation,
} = documentStudentApi;
