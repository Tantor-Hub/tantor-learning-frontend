import { baseQuery, createApi, enhancedBaseQuery } from "../base-api";

interface IListDocByStudentSessionResponse {
  status: number;
  message: string;
  data: {
    length: number;
    list: Array<{
      id: number;
      id_student: number;
      id_session: number;
      id_session_student: number;
      document: string;
      piece_jointe: string;
      group: string;
      key_document: string;
      description: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
  };
}

interface IUploadDocRequest {
  id_session: string;
  piece_jointe: File;
  key_document: string;
  description: string;
}

export const documentStudentApi = createApi({
  reducerPath: "documentStudentApi",
  baseQuery,
  tagTypes: ["DocumentStudent"],
  endpoints: (builder) => ({
    // Get documents for a specific session/group/student
    listStudentDocBySessionId: builder.query<
      IListDocByStudentSessionResponse,
      { id_student: number; id_session: number; group: string }
    >({
      query: ({ id_student, id_session, group }) =>
        `sessions/session/documents/${id_student}/${id_session}/${group}`,
      providesTags: ["DocumentStudent"],
    }),

    // Upload document BEFORE the training
    uploadDocumentBefore: builder.mutation<void, IUploadDocRequest>({
      query: ({ id_session, piece_jointe, key_document, description }) => {
        const formData = new FormData();

        formData.append("id_session", String(id_session));
        formData.append("key_document", key_document);
        formData.append("description", description);

        // Assuming piece_jointe is a File or Blob
        if (piece_jointe) {
          formData.append("piece_jointe", piece_jointe);
        }

        return {
          url: "sessions/session/document/before",
          method: "PUT",
          body: formData,
          headers: {
            Accept: "image/png, text/plain, application/json, */*",
            // Don't set Content-Type — browser will set it for FormData
          },
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
          url: "sessions/session/document/during",
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["DocumentStudent"],
    }),

    // Upload document AFTER the training
    uploadDocumentAfter: builder.mutation<
      void,
      { id_session: string; piece_jointe: File; key_document: string; description: string }
    >({
      query: ({ id_session, piece_jointe, key_document, description }) => {
        return {
          url: "sessions/session/document/after",
          method: "PUT",
          body: {
            id_session,
            piece_jointe,
            key_document,
            description,
          },
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
