import React from "react";
import { useGetDocumentsTemplatesBySessionIdQuery } from "@/lib/apis/documents";
import toast from "react-hot-toast";

interface FilledDocumentsListProps {
  sessionId: string;
  type: "before" | "during" | "after";
  onFillDocument: (templateId: string) => void;
}

export function FilledDocumentsList({ sessionId, type, onFillDocument }: FilledDocumentsListProps) {
  const { data: templatesData } = useGetDocumentsTemplatesBySessionIdQuery({
    sessionId,
  });

  const filteredTemplates = templatesData?.data?.filter((template) => template.type === type) || [];

  if (filteredTemplates.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">Aucun document à remplir pour cette période</p>
    );
  }

  return (
    <div className="space-y-4">
      {filteredTemplates.map((template) => (
        <div
          key={template.id}
          className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="font-medium mb-2">{template.title}</h3>
          <p className="text-sm text-gray-600 mb-4">
            {template.variables?.length || 0} variable(s) à remplir
          </p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={() => onFillDocument(template.id)}
          >
            Remplir le document
          </button>
        </div>
      ))}
    </div>
  );
}
