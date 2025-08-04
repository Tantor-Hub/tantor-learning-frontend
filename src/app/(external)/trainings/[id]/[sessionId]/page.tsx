"use client";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Download, Lock, CheckCircle, Router } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useGetSessionByIdQuery } from "@/lib/apis/public/public-api";
import { Loading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import toast from "react-hot-toast";
import { useApplyToTrainingMutation } from "@/lib/apis/student/training-api";

interface Document {
  id: string;
  label: string;
  accept: string;
  description: string;
  required: boolean;
}

interface SessionData {
  Formation?: {
    titre?: string;
    sous_titre?: string;
    description?: string;
  };
  Surveys?: Array<{
    description?: string;
    Questionnaires?: Array<{
      id: string;
      titre: string;
      description?: string;
      is_required: boolean;
      type: string;
      Options?: Array<{
        id: string;
        text: string;
      }>;
    }>;
  }>;
  text_reglement?: string;
  type_formation: string;
  date_session_debut: string;
  date_session_fin: string;
  duree: string;
  prix: string;
  payment_methods?: string[];
  designation?: string;
  required_documents?: string[];
}

interface DocumentsState {
  [key: string]: boolean;
}

export default function Page() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const router = useRouter();

  // All hooks at the top level - never conditional
  const { data: sessionResponse, isLoading: getSessionIsLoading } = useGetSessionByIdQuery({
    id_session: sessionId,
  });

  const [applySessionMutation] = useApplyToTrainingMutation();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<DocumentsState>({});
  const [documentsGenerated, setDocumentsGenerated] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);
  const [loadingSessionId, setLoadingSessionId] = useState<number | null>(null);

  const session: SessionData | undefined | any = sessionResponse?.data;

  // Initialize documents state using useEffect instead of during render
  useEffect(() => {
    if (session?.required_documents && Object.keys(documents).length === 0) {
      const initialState: DocumentsState = {};
      session.required_documents.forEach((doc: any) => {
        initialState[doc] = false;
      });
      setDocuments(initialState);
    }
  }, [session?.required_documents, documents]);

  // Memoize step calculations to avoid recalculating on every render
  const stepConfig = useMemo(() => {
    if (!session)
      return { hasQuestions: false, hasDocuments: false, hasPayment: false, totalSteps: 0 };

    const hasQuestions = (session.Surveys?.[0]?.Questionnaires?.length ?? 0) > 0;
    const hasDocuments = (session.required_documents?.length ?? 0) > 0;
    const hasPayment = (session.payment_methods?.length ?? 0) > 0 && session.prix !== "0";
    const totalSteps = [hasQuestions, hasDocuments, true, hasPayment].filter(Boolean).length;

    return { hasQuestions, hasDocuments, hasPayment, totalSteps };
  }, [session]);

  const { hasQuestions, hasDocuments, hasPayment, totalSteps } = stepConfig;

  // Adjust current step if it's out of bounds - use useEffect instead of during render
  useEffect(() => {
    if (currentStep > totalSteps && totalSteps > 0) {
      setCurrentStep(totalSteps);
    }
  }, [currentStep, totalSteps]);

  const handleFileUpload = (docType: string) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setDocuments((prev) => ({
        ...prev,
        [docType]: !!e.target.files?.length,
      }));
    };
  };

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const isQuestionsValid = (): boolean => {
    if (!hasQuestions) return true;

    // Check if all required questions are answered
    const requiredQuestions =
      session?.Surveys?.[0]?.Questionnaires?.filter((q: any) => q.is_required) || [];
    return requiredQuestions.every((q: any) => selectedOptions[q.id] !== undefined);
  };

  const isDocumentsValid = (): boolean => {
    if (!hasDocuments) return true;
    return Object.entries(documents).every(([doc, uploaded]) => uploaded);
  };

  const isSignatureValid = (): boolean => {
    return termsAccepted;
  };

  const canProceedToNext = (): boolean => {
    switch (getActualStep(currentStep)) {
      case 1:
        return isQuestionsValid();
      case 2:
        return isDocumentsValid() || documentsGenerated;
      case 3:
        return isSignatureValid();
      case 4:
        return true;
      default:
        return false;
    }
  };

  // Maps the virtual step to the actual step based on which sections are available
  const getActualStep = (step: number): number => {
    let actualStep = 0;
    let virtualStep = 0;

    if (hasQuestions) {
      actualStep++;
      virtualStep++;
      if (step === virtualStep) return actualStep;
    }

    if (hasDocuments) {
      actualStep++;
      virtualStep++;
      if (step === virtualStep) return actualStep;
    }

    // Signature step is always present
    actualStep++;
    virtualStep++;
    if (step === virtualStep) return actualStep;

    if (hasPayment) {
      actualStep++;
      virtualStep++;
      if (step === virtualStep) return actualStep;
    }

    return actualStep;
  };

  const getStepTitle = (step: number): string => {
    const steps = [];
    if (hasQuestions) steps.push("Questionnaire d'évaluation");
    if (hasDocuments) steps.push("Documents requis");
    steps.push("Signature du contrat");
    if (hasPayment) steps.push("Paiement");

    return steps[step - 1] || "";
  };

  const handleNext = () => {
    if (!canProceedToNext()) {
      alert("Veuillez compléter toutes les étapes requises");
      return;
    }

    if (getActualStep(currentStep) === 2 && !documentsGenerated) {
      setDocumentsGenerated(true);
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (getActualStep(currentStep) === 2 && documentsGenerated) {
      setDocumentsGenerated(false);
      return;
    }
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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
    // Default accept all common document types
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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const surveyQuestions = useMemo(() => {
    return session?.Surveys?.[0]?.Questionnaires || [];
  }, [session?.Surveys]);

  // Log all collected data at the end
  const logAllData = () => {
    console.log("=== Données collectées ===");
    console.log("Réponses au questionnaire:", selectedOptions);
    console.log("Documents téléversés:", documents);
    console.log("Contrat signé:", termsAccepted);
    if (hasPayment) {
      console.log("Paiement effectué:", paymentCompleted);
    }
    console.log("=========================");
  };

  // Call logAllData when payment is completed - use useEffect instead of during render
  useEffect(() => {
    if (paymentCompleted) {
      logAllData();
    }
  }, [paymentCompleted]);

  const handleApplyToSession = async (sessionId: number) => {
    try {
      setLoadingSessionId(sessionId);
      // Note: trainingId is not defined in the original code, you'll need to get it from somewhere
      // await applySessionMutation({ id_session: sessionId }).unwrap();
      // router.push(`/trainings/${trainingId}/${sessionId}`);
      toast.success("Candidature enregistrée");
    } catch (error: any) {
      if (error.status === 401) {
        toast.error("Erreur de candidature");
        router.push("/signin");
        return;
      }
      toast.error(
        "Vous vous êtes déjà inscrit à cette session de formation; vous ne pouvez le faire deux fois."
      );
    } finally {
      setLoadingSessionId(null);
    }
  };

  if (getSessionIsLoading) {
    return <Loading />;
  }

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <Button className="mb-8" size="lg" onClick={() => router.back()}>
          <ArrowLeft /> Retour à toutes les sessions
        </Button>
        <EmptyState
          title="Session introuvable"
          description="Cette session n'existe pas ou a été supprimée"
          icon="Calendar"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
      <Button className="mb-8" size="lg" onClick={() => router.back()}>
        <ArrowLeft /> Retour à toutes les sessions
      </Button>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {step < currentStep ? <CheckCircle className="w-6 h-6" /> : step}
              </div>
              {step < totalSteps && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    step < currentStep ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Étape {currentStep} sur {totalSteps}: {getStepTitle(currentStep)}
          </h2>
        </div>
      </div>

      {/* Step 1: Questions */}
      {hasQuestions && getActualStep(currentStep) === 1 && (
        <Card className="border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Questionnaire d'évaluation
            </CardTitle>
            <p className="text-muted-foreground text-center">{session.Surveys?.[0]?.description}</p>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-8">
            {surveyQuestions.length > 0 ? (
              surveyQuestions.map((question: any, index: number) => (
                <div key={question.id} className="space-y-4">
                  <h3 className="text-lg font-medium">
                    {question.titre}
                    {question.is_required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                  {question.description && (
                    <p className="text-sm text-muted-foreground">{question.description}</p>
                  )}
                  {question.type === "QCM" && question.Options && (
                    <RadioGroup
                      value={selectedOptions[question.id]}
                      onValueChange={(value) => handleOptionSelect(question.id, value)}
                      className="space-y-2"
                    >
                      {question.Options.map((option: any) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={option.id}
                            id={`question-${question.id}-${option.id}`}
                          />
                          <Label htmlFor={`question-${question.id}-${option.id}`}>
                            {option.text}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                  {index < surveyQuestions.length - 1 && <Separator />}
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">Aucune question disponible</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Documents */}
      {hasDocuments && getActualStep(currentStep) === 2 && (
        <Card className="border">
          {!documentsGenerated ? (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  Documents requis pour l'inscription
                </CardTitle>
                <p className="text-muted-foreground">
                  Veuillez téléverser tous les documents nécessaires pour finaliser votre
                  inscription
                </p>
              </CardHeader>
              <Separator />
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {requiredDocuments.map((doc) => (
                    <div key={doc.id} className="relative">
                      <Card
                        className={`transition-all duration-200 border ${
                          documents[doc.id]
                            ? "border-green-300 bg-green-50"
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

                              <div className="space-y-2">
                                <Input
                                  id={doc.id}
                                  type="file"
                                  accept={doc.accept}
                                  onChange={handleFileUpload(doc.id)}
                                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <p className="text-xs text-gray-500">
                                  Formats acceptés: {doc.accept.replace(/\./g, "").toUpperCase()} •
                                  Max 5MB
                                </p>
                              </div>
                            </div>
                          </div>

                          {documents[doc.id] && (
                            <div className="absolute top-4 right-4">
                              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
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
                  Votre document d'inscription est prêt
                </h3>
                <p className="text-green-700">
                  Nous avons généré automatiquement votre contrat d'inscription basé sur les
                  informations et documents fournis.
                </p>
                <Button className="mt-4" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger le contrat
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Step 3: Signature */}
      {getActualStep(currentStep) ===
        (hasQuestions && hasDocuments ? 3 : hasQuestions || hasDocuments ? 2 : 1) && (
        <Card className="border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Signature du contrat de formation</CardTitle>
            <p className="text-gray-600 mt-2">
              Finalisez votre inscription en signant électroniquement votre contrat
            </p>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Conditions générales</h2>
              <p className="text-sm text-muted-foreground">
                Veuillez lire attentivement les conditions générales avant de continuer :
              </p>

              <ScrollArea className="h-64 rounded-md border p-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Règlement de la formation</h3>
                  <div className="text-sm whitespace-pre-line">
                    {session.text_reglement || "Conditions générales de la formation..."}
                  </div>
                </div>
              </ScrollArea>

              <div className="flex items-start space-x-2 pt-4">
                <Checkbox
                  id="conditions"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                />
                <Label htmlFor="conditions" className="font-normal leading-snug">
                  Je reconnais avoir lu et accepté les conditions générales de participation et
                  m'engage à poursuivre la formation dans les règles établies.
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Payment */}
      {hasPayment && getActualStep(currentStep) === 4 && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left - Course Info */}
          <div>
            <Card className="border">
              <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-blue-600">
                      {session.Formation?.titre || "Formation"}
                    </h2>
                    <p className="text-sm font-medium mt-1 text-blue-600/70">
                      {session.Formation?.sous_titre || session.designation}
                    </p>
                  </div>
                  <Badge variant="outline">{session.type_formation}</Badge>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    {session.Formation?.description ||
                      session.text_reglement?.slice(0, 200) + "..."}
                  </p>
                </div>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-blue-800"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M3 9h18" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-700">
                      {session.type_formation === "onLine" ? "En ligne" : session.type_formation}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-blue-800"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-700">
                      {formatDate(session.date_session_debut)} -{" "}
                      {formatDate(session.date_session_fin)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-blue-800"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" x2="12" y1="8" y2="12" />
                        <line x1="12" x2="12.01" y1="16" y2="16" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-700">Durée: {session.duree}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Total à payer</span>
                    <span className="text-xl font-bold text-blue-600">{session.prix},00 €</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right - Payment Form */}
          <div>
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-600">
                  Méthode de paiement
                </CardTitle>
                <p className="text-muted-foreground">
                  Sécurisé par SSL et cryptage 256-bit
                  {session.payment_methods && (
                    <span className="block text-xs mt-1">
                      Méthodes acceptées: {session.payment_methods.join(", ")}
                    </span>
                  )}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Numéro de carte</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Date d'expiration</Label>
                      <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cardName">Nom sur la carte</Label>
                    <Input id="cardName" placeholder="John Doe" className="mt-1" />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-4">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Paiement sécurisé SSL 256-bit</span>
                </div>

                <Button className="w-full" size="lg" onClick={() => setPaymentCompleted(true)}>
                  Payer {session.prix},00 €
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1 && !documentsGenerated}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Précédent
        </Button>

        <div className="text-sm text-gray-500">
          Étape {currentStep} sur {totalSteps}
        </div>

        <Button
          onClick={handleNext}
          disabled={!canProceedToNext()}
          className="flex items-center gap-2"
        >
          {currentStep === totalSteps ? "Terminer" : "Continuer"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Success Message */}
      {paymentCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="border max-w-md mx-4">
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Inscription réussie ! 🎉
              </h3>
              <p className="text-green-700 mb-4">
                Merci pour votre inscription à "{session.Formation?.titre}". Vous recevrez un email
                de confirmation sous peu.
              </p>
              <Button onClick={() => setPaymentCompleted(false)} className="w-full">
                Fermer
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
