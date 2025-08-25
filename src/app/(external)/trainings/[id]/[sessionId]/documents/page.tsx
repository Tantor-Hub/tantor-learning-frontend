"use client";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, Upload, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useGetSessionByIdQuery } from "@/lib/apis/public/public-api";
import { Loading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectToken } from "@/features/auth/auth-slice";

interface Document {
  id: string;
  label: string;
  accept: string;
  description: string;
  required: boolean;
}

interface SessionData {
  required_documents?: string[];
}

interface DocumentsState {
  [key: string]: {
    uploaded: boolean;
    file: File | null;
    uploading: boolean;
  };
}

export default function DocumentsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const {
    data: sessionResponse,
    isLoading: getSessionIsLoading,
    refetch,
  } = useGetSessionByIdQuery({
    id_session: sessionId,
  });

  const token = useSelector(selectToken);
  const [documents, setDocuments] = useState<DocumentsState>({});
  const [documentsGenerated, setDocumentsGenerated] = useState<boolean>(false);

  const session: SessionData | undefined | any = sessionResponse?.data;

  useEffect(() => {
    if (session?.required_documents && Object.keys(documents).length === 0) {
      const initialState: DocumentsState = {};
      session.required_documents.forEach((doc: any) => {
        initialState[doc] = {
          uploaded: false,
          file: null,
          uploading: false,
        };
      });
      setDocuments(initialState);
    }
  }, [session?.required_documents, documents]);

  const handleFileSelect = (docType: string) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setDocuments((prev) => ({
        ...prev,
        [docType]: {
          ...prev[docType],
          file,
          uploaded: false, // Reset uploaded status when new file is selected
        },
      }));
    };
  };

  const handleSubmitDocument = async (docType: string) => {
    const docData = documents[docType];
    if (!docData?.file) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    // Set uploading state
    setDocuments((prev) => ({
      ...prev,
      [docType]: {
        ...prev[docType],
        uploading: true,
      },
    }));

    toast.loading("Envoi en cours...");

    const formData = new FormData();
    formData.append("piece_jointe", docData.file);
    formData.append("id_session", String(sessionId));
    formData.append("key_document", docType);
    formData.append("description", docData.file.name);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sessions/session/document/before`,
        {
          method: "PUT",
          body: formData,
          headers: {
            "x-connexion-tantor": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const responseData = await response.json();
      toast.dismiss();
      toast.success(`Document ${docData.file.name} uploadé avec succès!`);

      // Mark as uploaded
      setDocuments((prev) => ({
        ...prev,
        [docType]: {
          ...prev[docType],
          uploaded: true,
          uploading: false,
        },
      }));

      await refetch();
    } catch (error) {
      toast.dismiss();
      console.error("Error uploading document:", error);
      if (error instanceof Error) {
        toast.error(`Erreur: ${error.message}`);
      } else {
        toast.error(`Échec de l'upload du document`);
      }

      // Reset uploading state on error
      setDocuments((prev) => ({
        ...prev,
        [docType]: {
          ...prev[docType],
          uploading: false,
        },
      }));
    } finally {
      toast.dismiss();
    }
  };

  const handleRemoveFile = (docType: string) => {
    setDocuments((prev) => ({
      ...prev,
      [docType]: {
        ...prev[docType],
        file: null,
        uploaded: false,
      },
    }));
  };

  const isDocumentsValid = (): boolean => {
    return Object.entries(documents).every(([doc, data]) => data.uploaded);
  };

  const canProceedToNext = (): boolean => {
    return isDocumentsValid() || documentsGenerated;
  };

  const documentTypeToLabel = (type: string): string => {
    const labels: Record<string, string> = {
      CARTE_IDENTITE: "Pièce d'identité",
      CONTRAT_OU_CONVENTION: "Contrat ou convention",
      JUSTIFICATIF_DOMICILE: "Justificatif de domicile",
      ANALYSE_BESOIN: "Analyse de besoin",
      FORMULAIRE_HANDICAP: "Formulaire handicap",
      CONVOCATION: "Convocation",
      PROGRAMME: "Programme",
      CONDITIONS_VENTE: "Conditions de vente",
      REGLEMENT_INTERIEUR: "Règlement intérieur",
      CGV: "Conditions générales de vente",
      FICHE_CONTROLE_INITIALE: "Fiche de contrôle initiale",
      CONVOCATION_EXAMEN: "Convocation examen",
      ATTESTATION_FORMATION: "Attestation de formation",
      CERTIFICATION: "Certification",
      FICHE_CONTROLE_COURS: "Fiche de contrôle cours",
      FICHES_EMARGEMENT: "Fiches d'émargement",
      QUESTIONNAIRE_SATISFACTION: "Questionnaire de satisfaction",
      PAIEMENT: "Preuve de paiement",
      DOCUMENTS_FINANCEUR: "Documents financeur",
      FICHE_CONTROLE_FINALE: "Fiche de contrôle finale",
    };
    return labels[type] || type;
  };

  const documentTypeToAccept = (type: string): string => {
    return ".pdf,.jpg,.jpeg,.png,.doc,.docx";
  };

  const documentTypeToDescription = (type: string): string => {
    const descriptions: Record<string, string> = {
      CARTE_IDENTITE: "Carte d'identité, passeport ou permis de conduire valide",
      CONTRAT_OU_CONVENTION: "Contrat de travail ou convention de stage",
      JUSTIFICATIF_DOMICILE: "Facture récente (électricité, gaz, téléphone) de moins de 3 mois",
      ANALYSE_BESOIN: "Document d'analyse de besoin de formation",
      FORMULAIRE_HANDICAP: "Formulaire de déclaration de situation de handicap le cas échéant",
      CONVOCATION: "Convocation à la formation",
      PROGRAMME: "Programme détaillé de la formation",
      CONDITIONS_VENTE: "Conditions générales de vente de la formation",
      REGLEMENT_INTERIEUR: "Règlement intérieur de l'organisme de formation",
      CGV: "Conditions générales de vente",
      FICHE_CONTROLE_INITIALE: "Fiche d'évaluation initiale des compétences",
      CONVOCATION_EXAMEN: "Convocation à l'examen de certification",
      ATTESTATION_FORMATION: "Attestation de fin de formation",
      CERTIFICATION: "Certificat ou diplôme obtenu",
      FICHE_CONTROLE_COURS: "Fiche de suivi des cours",
      FICHES_EMARGEMENT: "Feuilles d'émargement signées",
      QUESTIONNAIRE_SATISFACTION: "Questionnaire d'évaluation de la formation",
      PAIEMENT: "Justificatif de paiement de la formation",
      DOCUMENTS_FINANCEUR: "Documents relatifs au financement de la formation",
      FICHE_CONTROLE_FINALE: "Fiche d'évaluation finale des compétences",
    };
    return descriptions[type] || "Document requis pour l'inscription";
  };

  const requiredDocuments: Document[] = useMemo(() => {
    return (
      session?.required_documents?.map((doc: any) => ({
        id: doc,
        label: documentTypeToLabel(doc),
        accept: documentTypeToAccept(doc),
        description: documentTypeToDescription(doc),
        required: true,
      })) || []
    );
  }, [session?.required_documents]);

  const handleNext = () => {
    if (!canProceedToNext()) {
      alert("Veuillez téléverser tous les documents requis");
      return;
    }

    if (!documentsGenerated) {
      setDocumentsGenerated(true);
      return;
    }

    // Complete the process
    toast.success("Inscription complétée avec succès!");
    // You can redirect to a success page or dashboard here
    router.push("/student");
  };

  const handlePrevious = () => {
    if (documentsGenerated) {
      setDocumentsGenerated(false);
      return;
    }
    // Go back to the main component
    router.back();
  };

  if (getSessionIsLoading) {
    return <Loading />;
  }

  if (!session || !session.required_documents || session.required_documents.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <Button className="mb-8" size="lg" onClick={() => router.back()}>
          <ArrowLeft /> Retour
        </Button>
        <EmptyState
          title="Aucun document requis"
          description="Cette session ne nécessite pas de documents supplémentaires"
          icon="FileText"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
      <Button
        variant="outline"
        className="mb-8 border-primary text-primary"
        size="lg"
        onClick={() => router.back()}
      >
        <ArrowLeft /> Retour aux étapes précédentes
      </Button>

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 MB-4">Documents requis</h1>
        <p className="text-lg text-gray-600">
          Dernière étape : téléversez les documents nécessaires pour finaliser votre inscription
        </p>
      </div>

      {/* Documents Step */}
      <Card className="border">
        {!documentsGenerated ? (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                Documents requis pour finaliser l'inscription
              </CardTitle>
              <p className="text-muted-foreground">
                Veuillez téléverser les documents restants pour compléter votre dossier
              </p>
            </CardHeader>
            <Separator />
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {requiredDocuments.map((doc) => {
                  const docData = documents[doc.id];
                  const isUploaded = docData?.uploaded || false;
                  const isUploading = docData?.uploading || false;
                  const hasFile = !!docData?.file;

                  return (
                    <div key={doc.id} className="relative">
                      <Card
                        className={`transition-all duration-200 border ${
                          isUploaded
                            ? "border-green-300 bg-green-50"
                            : hasFile
                              ? "border-blue-300 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="text-3xl">📄</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Label
                                  htmlFor={doc.id}
                                  className="text-lg font-semibold text-gray-900"
                                >
                                  {doc.label}
                                </Label>
                                {doc.required && <span className="text-red-500 text-sm">*</span>}
                              </div>
                              <p className="text-sm text-gray-600 mb-4">{doc.description}</p>

                              <div className="space-y-3">
                                {/* File Input */}
                                <div className="flex items-center gap-2">
                                  <Input
                                    id={doc.id}
                                    type="file"
                                    accept={doc.accept}
                                    onChange={handleFileSelect(doc.id)}
                                    disabled={isUploading || isUploaded}
                                    className="flex-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                  />
                                  {hasFile && !isUploaded && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleRemoveFile(doc.id)}
                                      disabled={isUploading}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>

                                {/* File Info and Upload Button */}
                                {hasFile && (
                                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900">
                                        {docData.file?.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {(docData.file?.size || 0 / (1024 * 1024)).toFixed(2)} MB
                                      </p>
                                    </div>
                                    {!isUploaded && (
                                      <Button
                                        onClick={() => handleSubmitDocument(doc.id)}
                                        disabled={isUploading}
                                        size="sm"
                                        className="ml-3"
                                      >
                                        {isUploading ? (
                                          <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Envoi...
                                          </>
                                        ) : (
                                          <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Envoyer
                                          </>
                                        )}
                                      </Button>
                                    )}
                                  </div>
                                )}

                                <p className="text-xs text-gray-500">
                                  Formats acceptés: {doc.accept.replace(/\./g, "").toUpperCase()} •
                                  Max 5MB
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Status Indicator */}
                          <div className="absolute top-4 right-4">
                            {isUploaded ? (
                              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              </div>
                            ) : isUploading ? (
                              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                              </div>
                            ) : hasFile ? (
                              <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full">
                                <Upload className="w-5 h-5 text-yellow-600" />
                              </div>
                            ) : null}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Votre dossier est complet
              </h3>
              <p className="text-green-700">
                Tous les documents ont été reçus. Votre inscription est maintenant finalisée.
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8">
        <Button variant="outline" onClick={handlePrevious} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          {documentsGenerated ? "Modifier les documents" : "Retour"}
        </Button>

        <div className="text-sm text-gray-500">
          {documentsGenerated ? "Inscription terminée" : "Documents requis"}
        </div>

        <Button
          onClick={handleNext}
          disabled={!canProceedToNext()}
          className="flex items-center gap-2"
        >
          {documentsGenerated ? "Terminer" : "Valider les documents"}
          {!documentsGenerated && <CheckCircle className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
