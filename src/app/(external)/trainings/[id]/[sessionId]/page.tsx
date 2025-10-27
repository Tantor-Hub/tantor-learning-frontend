"use client";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useGetStudentTrainingSessionByIdQuery } from "@/lib/apis/public/public-api";
import { EmptyState } from "@/components/shared/empty-state";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import { PaymentCardUI } from "@/components/payment/payment-card-ui";
import { calculateStripeTotal } from "@/lib/convert-to-subcurrency";
import { useCreateFreeUserInSessionMutation } from "@/lib/apis/user-in-session";

// Simple inline skeleton component
const Skeleton = ({ className = "", width = "100%", height = "1rem" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ width, height }} />
);

const PageSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 space-y-8">
    {/* Back button skeleton */}
    <Skeleton width="200px" height="2.5rem" className="rounded" />

    {/* Progress bar skeleton */}
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {Array.from({ length: 2 }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center">
            <Skeleton width="40px" height="40px" className="rounded-full" />
            {step < 2 && <Skeleton width="100px" height="4px" className="mx-4 rounded-full" />}
          </div>
        ))}
      </div>
      <Skeleton height="2rem" width="300px" className="mx-auto" />
    </div>

    {/* Signature step skeleton */}
    <div className="bg-white border rounded-lg p-6 space-y-4">
      <Skeleton height="2rem" width="250px" />
      <Skeleton height="1rem" width="200px" />
      <div className="h-64 border rounded p-4">
        <Skeleton height="1.5rem" width="150px" />
        <Skeleton height="1rem" width="100%" className="mt-4" />
        <Skeleton height="1rem" width="90%" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton width="20px" height="20px" className="rounded" />
        <Skeleton width="300px" height="1rem" />
      </div>
    </div>

    {/* Payment step skeleton */}
    <div className="grid md:grid-cols-2 gap-8">
      {/* Course info skeleton */}
      <div className="space-y-4">
        <Skeleton height="2rem" width="200px" />
        <Skeleton height="1rem" width="150px" />
        <div className="space-y-2">
          <Skeleton height="1rem" width="100%" />
          <Skeleton height="1rem" width="90%" />
        </div>
        <div className="space-y-2">
          <Skeleton height="1rem" width="80px" />
          <Skeleton height="1rem" width="120px" />
        </div>
        <div className="flex justify-between pt-4 border-t">
          <Skeleton height="1rem" width="100px" />
          <Skeleton height="1.5rem" width="80px" />
        </div>
      </div>

      {/* Payment form skeleton */}
      <div className="space-y-4">
        <Skeleton height="2rem" width="150px" />
        <Skeleton height="1rem" width="200px" />
        <div className="space-y-4 p-4 border rounded">
          <Skeleton height="1rem" width="100px" />
          <Skeleton height="3rem" width="100%" className="rounded" />
          <Skeleton height="3rem" width="100%" className="rounded mt-2" />
          <Skeleton height="2.5rem" width="100%" className="rounded" />
        </div>
      </div>
    </div>

    {/* Navigation skeleton */}
    <div className="flex justify-between items-center">
      <Skeleton width="120px" height="2.5rem" className="rounded" />
      <Skeleton width="100px" height="1rem" />
      <Skeleton width="120px" height="2.5rem" className="rounded" />
    </div>
  </div>
);

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const sessionId = params.sessionId as string;

  const pathSegments = pathname.split("/");
  const trainingId = pathSegments[2];
  const currentUser = useSelector(selectCurrentUser);
  const { data: studentTrainingSession, isLoading: isLoadingSession } =
    useGetStudentTrainingSessionByIdQuery({ id: sessionId });
  const [createFreeUserInSession, { isLoading: isCreatingFreeSession }] =
    useCreateFreeUserInSessionMutation();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  // Payment state
  const [paymentData, setPaymentData] = useState<any | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const session = studentTrainingSession?.data;

  const stepConfig = useMemo(() => {
    if (!session) return { hasPayment: false, totalSteps: 1 };

    const price = parseFloat(session.trainings?.prix || "0");
    const hasPayment = (session.payment_method?.length ?? 0) > 0 && price > 0;
    const totalSteps = hasPayment ? 2 : 1;

    return { hasPayment, totalSteps };
  }, [session]);

  const { stripeFee, totalAmount } = useMemo(() => {
    const basePrice = parseFloat(session?.trainings?.prix || "0");
    return calculateStripeTotal(basePrice);
  }, [session?.trainings?.prix]);

  const { hasPayment, totalSteps } = stepConfig;

  useEffect(() => {
    if (currentStep > totalSteps && totalSteps > 0) {
      setCurrentStep(totalSteps);
    }
  }, [currentStep, totalSteps]);

  const isSignatureValid = (): boolean => {
    return termsAccepted;
  };

  const isPaymentValid = (): boolean => {
    return paymentData !== null;
  };

  const canProceedToNext = (): boolean => {
    if (currentStep === 1) {
      return isSignatureValid();
    }

    if (currentStep === 2) {
      return isPaymentValid();
    }

    return false;
  };

  const isCurrentStep = (stepType: "signature" | "payment"): boolean => {
    if (stepType === "signature") return currentStep === 1;
    if (stepType === "payment") return currentStep === 2;
    return false;
  };

  const getStepTitle = (step: number): string => {
    if (step === 1) return hasPayment ? "Signature du contrat" : "Inscription à la session";
    if (step === 2) return "Paiement";
    return "";
  };

  const handleNext = async () => {
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
    } else if (currentStep === totalSteps && !hasPayment) {
      // For free sessions, enroll directly after signature
      try {
        await createFreeUserInSession({ id_session: sessionId }).unwrap();
        toast.success("Inscription réussie !");
        router.push(`/${currentUser?.role}`);
      } catch (error: any) {
        const errorMessage =
          error?.data?.error ||
          error?.message ||
          "Erreur lors de l'inscription. Veuillez réessayer.";
        toast.error(errorMessage, {
          duration: 60000, // 1 minute in milliseconds
        });
        console.error(error);
      }
    }
    // Note: For payment step, the submission is handled by the payment handlers
    // No need to call handleApplyToSessionMutation here as it's already handled in payment methods
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isLoadingSession) {
    return <PageSkeleton />;
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

      {/* Step 1: Signature */}
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
                    {session.regulation_text || "Conditions générales de la formation..."}
                  </div>
                </div>
              </ScrollArea>

              <div className="flex items-start space-x-2 pt-4">
                <Checkbox
                  id="conditions"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                />
                <label htmlFor="conditions" className="font-normal leading-snug">
                  Je reconnais avoir lu et accepté les conditions générales de participation et
                  m'engage à poursuivre la formation dans les règles établies.
                </label>
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
                      {session.trainings?.title || "Formation"}
                    </h2>
                    <p className="text-sm font-medium mt-1 text-blue-600/70">
                      {session.trainings?.subtitle || session.title}
                    </p>
                  </div>
                  <Badge variant="outline">{session.trainings?.trainingtype}</Badge>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    {session.trainings?.description ||
                      session.regulation_text?.slice(0, 200) + "..."}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Prix de la formation</span>
                    <span className="text-lg text-gray-700">
                      {Number(session.trainings?.prix || 0).toFixed(2)} €
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
                <PaymentCardUI
                  amount={session.trainings.prix}
                  sessionId={sessionId}
                  trainingId={trainingId}
                  availableMethods={
                    session.payment_method?.map((m: string) => m.toUpperCase()) || []
                  }
                  cpfLink={session.cpf_link}
                />
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
            disabled={!canProceedToNext() || isProcessingPayment || isCreatingFreeSession}
            className="flex items-center gap-2"
          >
            {isProcessingPayment || isCreatingFreeSession ? (
              <>
                <Loader2 className="animate-spin" />
                {isCreatingFreeSession ? "Inscription..." : "Traitement..."}
              </>
            ) : (
              <>
                {hasPayment ? "Continuer" : "S'inscrire à la session"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
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
