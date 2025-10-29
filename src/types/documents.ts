export interface DocumentTemplate {
  id: string;
  title: string;
  content: TipTapDocument;
  sessionId: string;
  type: DocumentTemplateType;
  variables?: string[];
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
