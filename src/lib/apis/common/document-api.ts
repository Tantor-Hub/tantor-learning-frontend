import { baseQuery, createApi, enhancedBaseQuery } from "../base-api";

interface IListDocumentsByStudentSessionIdResponse {
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

interface IListDocumentsByStudentSessionIdRequest {
  id_student: string;
  id_session: string;
  group: string;
}

export const documentsApi = createApi({
  reducerPath: "documentsApi",
  baseQuery,
  tagTypes: ["Document"],
  endpoints: (builder) => ({
    // Get documents for a specific session/group/student
    listDocumentsByStudentSessionId: builder.query<
      IListDocumentsByStudentSessionIdResponse,
      IListDocumentsByStudentSessionIdRequest
    >({
      query: ({ id_student, id_session, group }) =>
        `sessions/session/documents/${id_student}/${id_session}/${group}`,
      providesTags: ["Document"],
    }),
  }),
});

export const { useListDocumentsByStudentSessionIdQuery } = documentsApi;
