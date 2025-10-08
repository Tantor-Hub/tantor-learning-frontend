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
import {
  useGetSessionByIdQuery,
  useGetStudentTrainingSessionByIdQuery,
} from "@/lib/apis/public/public-api";
import { Loading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import toast from "react-hot-toast";
import { useApplyToTrainingMutation } from "@/lib/apis/student/training-api";
import { CheckoutPage, OpcoFormData } from "@/components/payment/checkout-page";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import { convertToSubcurrency } from "@/lib/convert-to-subcurrency";

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
  prix: number;
  payment_methods?: string[];
  designation?: string;
  required_documents?: string[];
}

interface SessionPayload {
  id_session: number;
  responses_survey?: {
    id_question: number;
    answer: string;
  }[];
  roi_accepted: boolean;
  payment: {
    method: "CARD" | "OPCO" | "CPF";
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

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isValidOPCO, setIsValidOPCO] = useState<boolean>(false);
  const sessionId = params.sessionId as string;

  const pathSegments = pathname.split("/");
  const trainingId = pathSegments[2];
  const currentUser = useSelector(selectCurrentUser);
  const { data: sessionResponse, isLoading: getSessionIsLoading } = useGetSessionByIdQuery({
    id_session: sessionId,
  });
  const { data: studentTrainingSession } = useGetStudentTrainingSessionByIdQuery({ id: sessionId });
  useEffect(() => {
    if (studentTrainingSession) {
      console.log("student training session:", JSON.stringify(studentTrainingSession, null, 2));
    }
  }, [studentTrainingSession]);

  const adaptStudentTrainingSession = (payload: any) => {
    if (!payload?.data) return undefined;
    const d = payload.data;
    return {
      Formation: {
        titre: d?.trainings?.title,
        sous_titre: d?.trainings?.subtitle,
        description: d?.trainings?.description,
      },
      Surveys: d?.survey
        ? [
            {
              description: d?.survey?.description,
              Questionnaires: d?.survey?.questions ?? [],
            },
          ]
        : [],
      text_reglement: d?.regulation_text,
      type_formation: d?.trainings?.trainingtype,
      date_session_debut: d?.date_session_debut,
      date_session_fin: d?.date_session_fin,
      duree: d?.duree,
      prix: d?.trainings?.prix,
      payment_methods: d?.payment_method ? [d.payment_method] : [],
      designation: d?.title,
      required_documents: d?.required_documents ?? [],
    };
  };

  const [applySessionMutation, { isLoading }] = useApplyToTrainingMutation();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  // Payment state
  const [paymentData, setPaymentData] = useState<SessionPayload["payment"] | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const adaptedStudent = adaptStudentTrainingSession(studentTrainingSession);
  const session: SessionData | undefined | any = adaptedStudent || sessionResponse?.data;

  const hasDocument = session?.required_documents && session.required_documents.length > 0;

  // Préparer les données de la session pour l'API
  const prepareSessionPayload = (paymentInfo: SessionPayload["payment"]): SessionPayload => {
    // Convertir les réponses du questionnaire
    const responses_survey = Object.entries(selectedOptions).map(([questionId, answerId]) => ({
      id_question: parseInt(questionId),
      answer: answerId,
    }));

    return {
      id_session: parseInt(sessionId),
      ...(responses_survey.length > 0 && { responses_survey: responses_survey }),
      roi_accepted: termsAccepted,
      payment: paymentInfo,
    };
  };

  // Soumettre la session complète à l'API
  const handleApplyToSessionMutation = async (paymentInfo: SessionPayload["payment"]) => {
    toast.loading("Inscription en cours...");
    if (!paymentInfo) {
      toast.dismiss();
      toast.error("Aucune méthode de paiement sélectionnée");
      return false;
    }

    try {
      setIsProcessingPayment(true);
      const payload = prepareSessionPayload(paymentInfo);

      // Appel à votre API
      const result = await applySessionMutation(payload).unwrap();
      toast.dismiss();
      toast.success("Inscription complétée avec succès!");

      // Redirection selon le contexte
      if (hasDocument) {
        router.push(`/trainings/${trainingId}/${sessionId}/documents`);
      } else {
        router.push("/");
      }
      return true;
    } catch (error: any) {
      toast.dismiss();
      // console.error("Erreur lors de l'inscription:", error);
      if (error.status === 400) {
        toast.error("Vous êtes déjà inscrit à la formation");
        // toast.error(error?.data?.data);
      }
      if (error.status === 401) {
        toast.error("Erreur d'authentification");
        router.push("/signin");
        return false;
      }
      toast.error(error.message || "Erreur lors de l'inscription");
      return false;
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // HANDLERS POUR LES DIFFÉRENTS TYPES DE PAIEMENT

  const handleCPFPayment = async () => {
    try {
      const fullName = `${currentUser?.firstName} ${currentUser?.lastName}`.trim();
      if (!fullName) {
        toast.error("Nom d'utilisateur manquant");
        return;
      }

      const cpfPaymentData: SessionPayload["payment"] = {
        method: "CPF",
        cpf: {
          full_name: fullName,
        },
      };

      // Set the payment data for UI feedback
      setPaymentData(cpfPaymentData);

      // Submit to API
      const success = await handleApplyToSessionMutation(cpfPaymentData);
      if (success) {
        // Only redirect to external site after successful API call
        window.open("https://www.moncompteformation.gouv.fr", "_blank");
        toast.success("Redirection vers Mon Compte Formation");
      }
    } catch (error: any) {
      toast.error("Une erreur est survenue");
      // Reset payment data on error
      setPaymentData(null);
    }
  };

  // OPCO PAYMENT
  const handleOPCOPayment = async (formData: OpcoFormData) => {
    try {
      const opcoPaymentData: SessionPayload["payment"] = {
        method: "OPCO",
        opco: {
          nom_entreprise: formData.companyName,
          siren: formData.siren,
          nom_responsable: formData.managerName,
          telephone_responsable: formData.phone,
          email_responsable: formData.email,
          // nom_opco peut être ajouté si vous avez cette info
        },
      };

      // Set the payment data for UI feedback
      setPaymentData(opcoPaymentData);

      // Submit to API
      const success = await handleApplyToSessionMutation(opcoPaymentData);
      setIsValidOPCO(success);
      if (success) {
        toast.success("Informations OPCO enregistrées");
      } else {
        // Reset payment data on failure
        setPaymentData(null);
      }
    } catch (error) {
      // console.error("Erreur paiement OPCO:", error);
      // toast.error("Une erreur est survenue");
      // Reset payment data on error
      setPaymentData(null);
    }
  };

  const handleCARDPayment = async (stripePaymentData: any) => {
    try {
      const { stripe, elements, clientSecret, confirmParams } = stripePaymentData;

      // Set processing state early
      setIsProcessingPayment(true);

      // Traitement Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Récupérer les informations de la carte
      const paymentMethod = paymentIntent.payment_method;

      const cardPaymentData: SessionPayload["payment"] = {
        method: "CARD",
        card: {
          full_name:
            paymentMethod?.billing_details?.name ||
            `${currentUser?.firstName} ${currentUser?.lastName}`.trim() ||
            "Nom non fourni",
          card_number: `****-****-****-${paymentMethod?.card?.last4 || "0000"}`,
          cvv: 0, // Le CVV n'est pas retourné par Stripe pour des raisons de sécurité
          year: paymentMethod?.card?.exp_year || new Date().getFullYear(),
          month: paymentMethod?.card?.exp_month || 1,
          id_stripe_payment: paymentIntent.id,
        },
      };

      // Set the payment data for UI feedback
      setPaymentData(cardPaymentData);

      // Submit to API
      const success = await handleApplyToSessionMutation(cardPaymentData);
      if (success) {
        toast.success("Paiement par carte réussi");
      } else {
        // Reset payment data on failure
        setPaymentData(null);
      }
    } catch (error: any) {
      console.error("Erreur paiement carte:", error);
      toast.error("Erreur paiement carte");
      // Reset payment data on error
      setPaymentData(null);
      setIsProcessingPayment(false);
    }
  };

  const stepConfig = useMemo(() => {
    if (!session) return { hasQuestions: false, hasPayment: false, totalSteps: 0 };

    const hasQuestions = (session.Surveys?.[0]?.Questionnaires?.length ?? 0) > 0;
    const price = typeof session.prix === "string" ? parseFloat(session.prix) : session.prix;
    const hasPayment = (session.payment_methods?.length ?? 0) > 0 && !!price && price > 0;

    const totalSteps = (hasQuestions ? 1 : 0) + 1 + (hasPayment ? 1 : 0);

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

  const isPaymentValid = (): boolean => {
    return paymentData !== null;
  };

  const canProceedToNext = (): boolean => {
    const currentStepNumber = getCurrentStepNumber();

    if (hasQuestions && currentStepNumber === 1) {
      return isQuestionsValid();
    }

    if (currentStepNumber === (hasQuestions ? 2 : 1)) {
      return isSignatureValid();
    }

    if (hasPayment && currentStepNumber === (hasQuestions ? 3 : 2)) {
      return isPaymentValid();
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
      let message = "Veuillez compléter toutes les étapes requises";

      if (hasPayment && isCurrentStep("payment") && !isPaymentValid()) {
        message = "Veuillez sélectionner et valider une méthode de paiement";
      }

      toast.error(message);
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
    // Note: For payment step, the submission is handled by the payment handlers
    // No need to call handleApplyToSessionMutation here as it's already handled in payment methods
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
                  {session.date_session_debut && session.date_session_fin && (
                    <>
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
                          {session.type_formation === "onLine"
                            ? "En ligne"
                            : session.type_formation}
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
                    </>
                  )}

                  {session.duree && (
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
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Total à payer</span>
                    <span className="text-xl font-bold text-blue-600">
                      {Number(session.prix).toFixed(2)} €
                    </span>
                  </div>
                </div>

                {/* Afficher la méthode de paiement sélectionnée */}
                {paymentData && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Paiement {paymentData.method} configuré
                      </span>
                    </div>
                  </div>
                )}
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
                  Choisissez votre méthode de paiement préférée
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Elements
                  stripe={stripePromise}
                  options={{
                    mode: "payment",
                    amount: convertToSubcurrency(session.prix),
                    currency: "eur",
                  }}
                >
                  <CheckoutPage
                    amount={session.prix}
                    sessionId={sessionId}
                    isValidOPCO={isValidOPCO}
                    trainingId={trainingId}
                    handleCPFPayment={handleCPFPayment}
                    handleOPCOPayment={handleOPCOPayment}
                    handleCARDPayment={handleCARDPayment}
                    hasDocument={hasDocument}
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
          disabled={currentStep === 1 || isProcessingPayment}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Précédent
        </Button>

        <div className="text-sm text-gray-500">
          Étape {currentStep} sur {totalSteps}
        </div>

        {/* Only show Next button for non-payment steps */}
        {(!hasPayment || !isCurrentStep("payment")) && (
          <Button
            onClick={handleNext}
            disabled={!canProceedToNext() || isProcessingPayment}
            className="flex items-center gap-2"
          >
            {isProcessingPayment ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Traitement...
              </>
            ) : (
              "Continuer"
            )}
            {!isProcessingPayment && <ArrowRight className="w-4 h-4" />}
          </Button>
        )}

        {/* For payment step, the CheckoutPage component should handle submission */}
        {hasPayment && isCurrentStep("payment") && (
          <div className="text-sm text-gray-500">Complétez le paiement ci-dessus</div>
        )}
      </div>
    </div>
  );
}
