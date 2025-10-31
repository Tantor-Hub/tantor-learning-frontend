import { createApi, enhancedBaseQuery } from "./base-api";
import {
  DocumentTemplate,
  CreateDocumentTemplateRequest,
  CreateDocumentTemplateResponse,
  DocumentTemplateType,
  CreateDocumentInstanceRequest,
  CreateDocumentInstanceResponse,
  GetDocumentInstancesByTemplateResponse,
  UpdateDocumentInstanceRequest,
  UpdateDocumentInstanceResponse,
} from "@/types/documents";

export const documentsApi = createApi({
  reducerPath: "documentsApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["DocumentTemplates", "StudentEvaluations", "DocumentInstances"],
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
    getDocumentTemplateById: builder.query<
      { status: number; message: string; data: DocumentTemplate },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `documents/templates/${id}`,
        method: "GET",
      }),
      providesTags: ["DocumentTemplates"],
    }),
    updateDocumentTemplate: builder.mutation<
      { message: string },
      { id: string; title: string; content: any; variables?: string[]; imageUrl?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `documents/templates/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["DocumentTemplates"],
    }),
    createDocumentInstance: builder.mutation<
      CreateDocumentInstanceResponse,
      CreateDocumentInstanceRequest
    >({
      query: (instanceData) => ({
        url: "documents/instances",
        method: "POST",
        body: instanceData,
      }),
      invalidatesTags: ["DocumentInstances"],
    }),
    getDocumentInstancesByTemplateId: builder.query<
      GetDocumentInstancesByTemplateResponse,
      { templateId: string }
    >({
      query: ({ templateId }) => ({
        url: `documents/instances/by-template/${templateId}`,
        method: "GET",
      }),
      providesTags: ["DocumentInstances"],
    }),
    updateDocumentInstance: builder.mutation<
      UpdateDocumentInstanceResponse,
      { id: string; data: UpdateDocumentInstanceRequest }
    >({
      query: ({ id, data }) => ({
        url: `documents/instances/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["DocumentInstances"],
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
  useCreateDocumentInstanceMutation,
  useGetDocumentInstancesByTemplateIdQuery,
  useUpdateDocumentInstanceMutation,
} = documentsApi;
