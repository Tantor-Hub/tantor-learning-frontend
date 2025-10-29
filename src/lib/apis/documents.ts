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
  }),
});

export const { useCreateDocumentTemplateMutation } = documentsApi;
