import { createApi, enhancedBaseQuery } from "./base-api";
import {
  DocumentTemplate,
  CreateDocumentTemplateRequest,
  CreateDocumentTemplateResponse,
  DocumentTemplateType,
} from "@/types/documents";

export const documentsApi = createApi({
  reducerPath: "documentsApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["DocumentTemplates", "StudentEvaluations"],
  endpoints: (builder) => ({
    createDocumentTemplate: builder.mutation<
      CreateDocumentTemplateResponse,
      CreateDocumentTemplateRequest
    >({
      query: (templateData) => ({
        url: "documents/templates",
        method: "POST",
        body: templateData,
      }),
      invalidatesTags: ["DocumentTemplates"],
    }),
    getDocumentTemplates: builder.query<
      { data: DocumentTemplate[]; message: string },
      { sessionId: string; type?: DocumentTemplateType }
    >({
      query: ({ sessionId, type }) => ({
        url: `documents/templates?sessionId=${sessionId}${type ? `&type=${type}` : ""}`,
        method: "GET",
      }),
      providesTags: ["DocumentTemplates"],
    }),
    getDocumentsTemplatesBySessionId: builder.query<
      { status: number; message: string; data: DocumentTemplate[] },
      { sessionId: string }
    >({
      query: ({ sessionId }) => ({
        url: `documents/templates/session/${sessionId}`,
        method: "GET",
      }),
      providesTags: ["DocumentTemplates"],
    }),
    getDocumentTemplateById: builder.query<DocumentTemplate, { id: string }>({
      query: ({ id }) => ({
        url: `documents/templates/${id}`,
        method: "GET",
      }),
      providesTags: ["DocumentTemplates"],
    }),
    updateDocumentTemplate: builder.mutation<
      { message: string },
      { id: string; title: string; content: any; variables?: string[] }
    >({
      query: ({ id, ...body }) => ({
        url: `documents/templates/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["DocumentTemplates"],
    }),
  }),
});

export const {
  useCreateDocumentTemplateMutation,
  useGetDocumentTemplatesQuery,
  useGetDocumentsTemplatesBySessionIdQuery,
  useGetDocumentTemplateByIdQuery,
  useLazyGetDocumentTemplateByIdQuery,
  useUpdateDocumentTemplateMutation,
} = documentsApi;
