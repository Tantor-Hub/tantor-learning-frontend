"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import { FilledDocumentsList } from "../components/FilledDocumentsList";
import StudentTemplate from "../student-template";
import { useLazyGetDocumentTemplateByIdQuery } from "@/lib/apis/documents";
import toast from "react-hot-toast";

interface FilledDocumentProps {
  sessionId: string;
  type: "before" | "during" | "after";
}

export function FilledDocument({ sessionId, type }: FilledDocumentProps) {
  const currentUser = useSelector(selectCurrentUser);
  const [studentTemplateOpen, setStudentTemplateOpen] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState("");
  const [getTemplateById, { isLoading: templateLoading }] = useLazyGetDocumentTemplateByIdQuery();

  const handleFillDocument = async (templateId: string) => {
    try {
      setCurrentTemplateId(templateId);
      await getTemplateById({ id: templateId }).unwrap();
      setStudentTemplateOpen(true);
    } catch (error) {
      console.error("Failed to load template:", error);
      toast.error("Erreur lors du chargement du modèle");
    }
  };

  return (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">
          Documents à remplir -{" "}
          {type === "before" ? "Avant" : type === "during" ? "Pendant" : "Après"}
        </h2>
        <FilledDocumentsList
          sessionId={sessionId}
          type={type}
          onFillDocument={handleFillDocument}
        />
      </div>
      <StudentTemplate
        open={studentTemplateOpen}
        onOpenChange={setStudentTemplateOpen}
        templateId={currentTemplateId}
        sessionId={sessionId}
        userId={currentUser?.id || ""}
      />
    </>
  );
}
