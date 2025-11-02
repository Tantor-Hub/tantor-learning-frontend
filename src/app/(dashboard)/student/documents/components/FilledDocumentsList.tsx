import React from "react";
import { useGetDocumentsTemplatesBySessionIdQuery } from "@/lib/apis/documents";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface FilledDocumentsListProps {
  sessionId: string;
  type: "before" | "during" | "after";
  onFillDocument: (templateId: string) => void;
}

export function FilledDocumentsList({ sessionId, type, onFillDocument }: FilledDocumentsListProps) {
  const { data: templatesData, isLoading } = useGetDocumentsTemplatesBySessionIdQuery({
    sessionId,
  });

  const filteredTemplates = templatesData?.data?.filter((template) => template.type === type) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement en cours...</p>
        </div>
      </div>
    );
  }

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
          <Button
            onClick={() => {
              onFillDocument(template.id);
              toast.success("Document ouvert pour remplissage");
            }}
          >
            Remplir le document
          </Button>
        </div>
      ))}
    </div>
  );
}
