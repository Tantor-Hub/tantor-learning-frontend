export interface DocumentTemplate {
  id: string;
  title: string;
  content: TipTapDocument;
  sessionId: string;
  type: DocumentTemplateType;
  variables?: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type DocumentTemplateType = "before" | "during" | "after";

export interface TipTapDocument {
  type: "doc";
  content: TipTapNode[];
}

export interface TipTapNode {
  type: string;
  attrs?: Record<string, any>;
  content?: TipTapNode[];
  text?: string;
  marks?: TipTapMark[];
}

export interface TipTapMark {
  type: string;
  attrs?: Record<string, any>;
}

export interface CreateDocumentTemplateRequest {
  title: string;
  content: TipTapDocument;
  sessionId: string;
  type: DocumentTemplateType;
  variables?: string[];
}

export interface CreateDocumentTemplateResponse {
  data: DocumentTemplate;
  message: string;
}

export interface DocumentInstance {
  id: string;
  templateId: string;
  userId: string;
  filledContent: TipTapDocument;
  variableValues: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  template: DocumentTemplate;
}

export interface CreateDocumentInstanceRequest {
  templateId: string;
  variableValues: Record<string, string>;
}

export interface CreateDocumentInstanceResponse {
  data: DocumentInstance;
  message: string;
}

export interface GetDocumentInstancesByTemplateResponse {
  status: number;
  message: string;
  data: DocumentInstance[];
}

export interface UpdateDocumentInstanceRequest {
  variableValues: Record<string, string>;
}

export interface UpdateDocumentInstanceResponse {
  data: DocumentInstance;
  message: string;
}
