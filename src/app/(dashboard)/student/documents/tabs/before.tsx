import React from "react";
import { useGetStudentSessionDocumentsBySessionIdQuery } from "@/lib/apis/session-document";
import { useGetTrainingSessionByIdQuery } from "@/lib/apis/training-sessions";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import { DocumentTable } from "../components/DocumentTable";

const documentTypes: Record<string, string> = {
  CARTE_IDENTITE: "Carte d'identité",
  CONTRAT_OU_CONVENTION: "Contrat ou convention",
  JUSTIFICATIF_DOMICILE: "Justificatif de domicile",
  ANALYSE_BESOIN: "Analyse de besoin",
  FORMULAIRE_HANDICAP: "Formulaire handicap",
  PROGRAMME: "Programme",
  CONDITIONS_VENTE: "Conditions de vente",
  REGLEMENT_INTERIEUR: "Règlement intérieur",
  CGV: "Conditions générales de vente",
  FICHE_CONTROLE_INITIALE: "Fiche contrôle initiale",
};

export function BeforeTab({ sessionId }: { sessionId: string }) {
  const currentUser = useSelector(selectCurrentUser);
  const { data: sessionData } = useGetTrainingSessionByIdQuery({ id: sessionId });
  const {
    data: documents,
    isLoading,
    refetch,
  } = useGetStudentSessionDocumentsBySessionIdQuery({
    sessionId,
    category: "before",
  });

  const requiredDocuments = sessionData?.data?.required_document_before || [];
  const documentList = documents?.data || [];

  return (
    <DocumentTable
      sessionId={sessionId}
      group="before"
      documentTypes={documentTypes}
      requiredDocuments={requiredDocuments}
      documents={documentList}
      isLoading={isLoading}
      onRefetch={refetch}
      apiEndpoint="/sessions/session/document/before"
    />
  );
}
