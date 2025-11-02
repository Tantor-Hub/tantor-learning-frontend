import React from "react";
import { useListDocumentsByStudentSessionIdQuery } from "@/lib/apis/common/document-api";
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
  } = useListDocumentsByStudentSessionIdQuery(
    {
      id_session: sessionId?.toString() || "",
      group: "after",
      id_student: currentUser?.id.toString() || "",
    },
    {
      skip: !sessionId || !currentUser?.id,
    }
  );

  const requiredDocuments = sessionData?.data?.required_document_after || [];
  const documentList = documents?.data?.list || [];

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
