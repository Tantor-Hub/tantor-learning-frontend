"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export default function Documents() {
  // Placeholder content - in a real app, this would fetch documents data
  const documents = [
    { id: 1, name: "Guide de formation.pdf", size: "2.5 MB", type: "PDF" },
    { id: 2, name: "Support de cours.docx", size: "1.8 MB", type: "Word" },
    { id: 3, name: "Exercices pratiques.xlsx", size: "500 KB", type: "Excel" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Documents de la session</h3>
      {documents.map((doc) => (
        <Card key={doc.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-gray-500" />
              <div>
                <CardTitle className="text-base">{doc.name}</CardTitle>
                <p className="text-sm text-gray-600">
                  {doc.size} • {doc.type}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
