import React from "react";
import { useGetStudentSessionDocumentsBySessionIdQuery } from "@/lib/apis/session-document";
import { useGetTrainingSessionByIdQuery } from "@/lib/apis/training-sessions";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import { DocumentTable } from "../components/DocumentTable";

const documentTypes: Record<string, string> = {
  QUESTIONNAIRE_SATISFACTION: "Questionnaire de satisfaction",
  PAIEMENT: "Paiement",
  DOCUMENTS_FINANCEUR: "Documents financeur",
  FICHE_CONTROLE_FINAL: "Fiche contrôle final",
};

export function AfterTab({ sessionId }: { sessionId: string }) {
  const currentUser = useSelector(selectCurrentUser);
  const { data: sessionData } = useGetTrainingSessionByIdQuery({ id: sessionId });
  const {
    data: documents,
    isLoading,
    refetch,
  } = useGetStudentSessionDocumentsBySessionIdQuery({
    sessionId,
    category: "after",
  });

  const requiredDocuments = sessionData?.data?.required_document_after || [];
  const documentList = documents?.data || [];

  return (
    <DocumentTable
      sessionId={sessionId}
      group="after"
      documentTypes={documentTypes}
      requiredDocuments={requiredDocuments}
      documents={documentList}
      isLoading={isLoading}
      onRefetch={refetch}
      apiEndpoint="/sessions/session/document/after"
    />
  );
}
