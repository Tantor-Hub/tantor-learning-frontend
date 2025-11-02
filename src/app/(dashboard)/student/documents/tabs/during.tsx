import React from "react";
import { useListStudentDocBySessionIdQuery } from "@/lib/apis/student/document-api";
import { useGetTrainingSessionByIdQuery } from "@/lib/apis/training-sessions";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import { DocumentTable } from "../components/DocumentTable";

const documentTypes: Record<string, string> = {
  CONVOCATION_EXAMEN: "Convocation à l'examen",
  ATTESTATION_FORMATION: "Attestation de formation",
  CERTIFICATION: "Certification",
  FICHE_CONTROLE_COURS: "Fiche de contrôle des cours",
  FICHES_EMARGEMENT: "Fiches d'émargement",
};

export function DuringTab({ sessionId }: { sessionId: string }) {
  const currentUser = useSelector(selectCurrentUser);
  const { data: sessionData } = useGetTrainingSessionByIdQuery({ id: sessionId });
  const {
    data: documents,
    isLoading,
    refetch,
  } = useListStudentDocBySessionIdQuery({
    id_session: sessionId,
    group: "during",
    id_student: currentUser?.id || "",
  });

  const requiredDocuments = sessionData?.data?.required_document_during || [];
  const documentList = documents?.data?.list || [];

  return (
    <DocumentTable
      sessionId={sessionId}
      group="during"
      documentTypes={documentTypes}
      requiredDocuments={requiredDocuments}
      documents={documentList}
      isLoading={isLoading}
      onRefetch={refetch}
      apiEndpoint="/sessions/session/document/during"
    />
  );
}
