import React from "react";
import { DocumentTable } from "../components/DocumentTable";

interface UploadDocumentProps {
  sessionId: string;
  type: "before" | "during" | "after";
  documentTypes: Record<string, string>;
  requiredDocuments: string[];
  documents: any[];
  isLoading: boolean;
  onRefetch: () => void;
  apiEndpoint: string;
}

export function UploadDocument({
  sessionId,
  type,
  documentTypes,
  requiredDocuments,
  documents,
  isLoading,
  onRefetch,
  apiEndpoint,
}: UploadDocumentProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        Documents à téléverser -{" "}
        {type === "before" ? "Avant" : type === "during" ? "Pendant" : "Après"}
      </h2>
      <DocumentTable
        sessionId={sessionId}
        group={type}
        documentTypes={documentTypes}
        requiredDocuments={requiredDocuments}
        documents={documents}
        isLoading={isLoading}
        onRefetch={onRefetch}
        apiEndpoint={apiEndpoint}
      />
    </div>
  );
}
