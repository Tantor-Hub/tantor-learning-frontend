import React from "react";
import { FilledDocumentsList } from "../components/FilledDocumentsList";

interface FilledDocumentProps {
  sessionId: string;
  type: "before" | "during" | "after";
}

export function FilledDocument({ sessionId, type }: FilledDocumentProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        Documents à remplir -{" "}
        {type === "before" ? "Avant" : type === "during" ? "Pendant" : "Après"}
      </h2>
      <FilledDocumentsList
        sessionId={sessionId}
        type={type}
        onFillDocument={(templateId) => {
          // Handle fill document logic here
          console.log("Fill document:", templateId);
        }}
      />
    </div>
  );
}
