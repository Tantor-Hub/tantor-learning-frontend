"use client";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useGetSessionByIdQuery } from "@/lib/apis/public/public-api";
import { Loading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import toast from "react-hot-toast";
import { useApplyToTrainingMutation } from "@/lib/apis/student/training-api";
import { CheckoutPage } from "@/components/payment/checkout-page";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe((process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string) ?? "");

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

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const sessionId = params.sessionId as string;
  const pathSegments = pathname.split("/");
  const trainingId = pathSegments[2];

  const { data: sessionResponse, isLoading: getSessionIsLoading } = useGetSessionByIdQuery({
    id_session: sessionId,
  });

  const [applySessionMutation] = useApplyToTrainingMutation();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [loadingSessionId, setLoadingSessionId] = useState<number | null>(null);

  const session: SessionData | undefined | any = sessionResponse?.data;

  const handleApplyToSessionMutation = async () => {
    // when click to the button pay
    /*
interface SessionPayload {
  id_session: number;
  responses_survey?: {
    id_question: number;
    answer: string;
  }[];
  roi_accepted: boolean;
  payment: {
    method: 'CARD' | 'OPCO' | 'CPF';
    card?: {
      full_name: string;
      card_number: string;
      cvv: number;
      year: number;
      month: number;
      id_stripe_payment: string;
    };
    opco?: {
      nom_opco?: string;
      nom_entreprise: string;
      siren: string;
      nom_responsable: string;
      telephone_responsable: string;
      email_responsable: string;
    };
    cpf?: {
      full_name: string;
    };
  };
}

    */
    // to submit to api
    // api look like
  };

  const stepConfig = useMemo(() => {
    if (!session) return { hasQuestions: false, hasPayment: false, totalSteps: 0 };

    const hasQuestions = (session.Surveys?.[0]?.Questionnaires?.length ?? 0) > 0;
    const hasPayment =
      (session.payment_methods?.length ?? 0) > 0 && session.prix !== "0" && session.prix !== "0.00";

    // Order: Questions -> Signature -> Payment
    const totalSteps =
      (hasQuestions ? 1 : 0) +
      1 + // Signature (toujours présente)
      (hasPayment ? 1 : 0);

    return { hasQuestions, hasPayment, totalSteps };
  }, [session]);

  const { hasQuestions, hasPayment, totalSteps } = stepConfig;

  useEffect(() => {
    if (currentStep > totalSteps && totalSteps > 0) {
      setCurrentStep(totalSteps);
    }
  }, [currentStep, totalSteps]);

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const isQuestionsValid = (): boolean => {
    if (!hasQuestions) return true;
    const requiredQuestions =
      session?.Surveys?.[0]?.Questionnaires?.filter((q: any) => q.is_required) || [];
    return requiredQuestions.every((q: any) => selectedOptions[q.id] !== undefined);
  };

  const isSignatureValid = (): boolean => {
    return termsAccepted;
  };

  const canProceedToNext = (): boolean => {
    const currentStepNumber = getCurrentStepNumber();

    if (hasQuestions && currentStepNumber === 1) {
      return isQuestionsValid();
    }

    if (currentStepNumber === (hasQuestions ? 2 : 1)) {
      // Signature
      return isSignatureValid();
    }

    if (hasPayment && currentStepNumber === (hasQuestions ? 3 : 2)) {
      return true; // Pas de validation nécessaire pour le paiement
    }

    return false;
  };

  const getCurrentStepNumber = (): number => {
    return currentStep;
  };

  const isCurrentStep = (stepType: "questions" | "signature" | "payment"): boolean => {
    let stepNumber = 0;

    if (stepType === "questions" && hasQuestions) {
      stepNumber = 1;
    } else if (stepType === "signature") {
      stepNumber = (hasQuestions ? 1 : 0) + 1;
    } else if (stepType === "payment" && hasPayment) {
      stepNumber = (hasQuestions ? 1 : 0) + 1 + 1;
    }

    return currentStep === stepNumber;
  };

  const getStepTitle = (step: number): string => {
    const steps = [];
    if (hasQuestions) steps.push("Questionnaire d'évaluation");
    steps.push("Signature du contrat");
    if (hasPayment) steps.push("Paiement");

    return steps[step - 1] || "";
  };

  const handleNext = () => {
    if (!canProceedToNext()) {
      alert("Veuillez compléter toutes les étapes requises");
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // If we're at the last step and there are documents required, redirect to documents page
      if (session?.required_documents && session.required_documents.length > 0) {
        router.push(`${pathname}/documents`);
      } else {
        // Complete the process
        toast.success("Inscription complétée avec succès!");
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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

  const handleApplyToSession = async (sessionId: number) => {
    try {
      setLoadingSessionId(sessionId);
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
      <Button
        variant="outline"
        className="mb-8 border-primary text-primary"
        size="lg"
        onClick={() => router.back()}
      >
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
      {hasQuestions && isCurrentStep("questions") && (
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

      {/* Step 2: Signature */}
      {isCurrentStep("signature") && (
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

      {/* Step 3: Payment */}
      {hasPayment && isCurrentStep("payment") && (
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
                        className="text-ring"
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
                <CardTitle className="text-xl font-semibold text-primary">
                  Méthode de paiement
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Ajouter un nouveau paiement à votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Elements
                  stripe={stripePromise}
                  options={{
                    mode: "payment",
                    amount: parseInt(session.prix),
                    currency: "eur",
                  }}
                >
                  <CheckoutPage
                    amount={parseInt(session.prix)}
                    sessionId={sessionId}
                    trainingId={trainingId}
                  />
                </Elements>
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
          disabled={currentStep === 1}
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
          {currentStep === totalSteps
            ? session?.required_documents && session.required_documents.length > 0
              ? "Continuer vers les documents"
              : "Terminer"
            : "Continuer"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
