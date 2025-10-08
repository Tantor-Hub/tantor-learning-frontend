"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  CreditCard,
  Building,
  Euro,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  useGetSessionByIdQuery,
  useUpdateSessionPaymentMutation,
} from "@/lib/apis/secretary/session-secretary-api";
import { PaymentSkeleton } from "@/app/(dashboard)/secretary/training/skeletons/PaymentSkeleton";

const paymentMethods = [
  {
    id: "card",
    label: "Fonds propres",
    description: "Paiement personnel de l'étudiant",
    icon: CreditCard,
  },
  {
    id: "opco",
    label: "OPCO",
    description: "Opérateur de compétences (financement employeur)",
    icon: Building,
  },
  {
    id: "cpf",
    label: "CPF",
    description: "Compte Personnel de Formation",
    icon: Euro,
  },
];

export default function Payment() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [cpfLink, setCpfLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch session data
  const {
    data: sessionData,
    isLoading,
    error: fetchError,
  } = useGetSessionByIdQuery({ id: sessionId });

  // Update payment mutation
  const [updatePayment] = useUpdateSessionPaymentMutation();

  // Initialize form with existing data
  useEffect(() => {
    if (sessionData?.data) {
      setSelectedMethods(sessionData.data.payment_method || []);
      setCpfLink(sessionData.data.cpf_link || "");
    }
  }, [sessionData]);

  const handleMethodChange = (methodId: string, checked: boolean) => {
    if (checked) {
      setSelectedMethods((prev) => [...prev, methodId]);
    } else {
      setSelectedMethods((prev) => prev.filter((id) => id !== methodId));
      // Clear CPF link if CPF is deselected
      if (methodId === "cpf") {
        setCpfLink("");
      }
    }
  };

  const handleCpfLinkChange = (value: string) => {
    setCpfLink(value);
  };

  const validateForm = () => {
    if (selectedMethods.length === 0) {
      setError("Veuillez sélectionner au moins une méthode de paiement.");
      return false;
    }

    if (selectedMethods.includes("cpf") && !cpfLink.trim()) {
      setError("Veuillez fournir un lien CPF valide.");
      return false;
    }

    // Basic URL validation for CPF link
    if (selectedMethods.includes("cpf") && cpfLink.trim()) {
      try {
        new URL(cpfLink);
      } catch {
        setError("Veuillez fournir une URL valide pour le lien CPF.");
        return false;
      }
    }

    // Check CPF link length
    if (selectedMethods.includes("cpf") && cpfLink.length > 255) {
      setError("Le lien CPF ne peut pas dépasser 255 caractères.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updatePayment({
        id: sessionId,
        payment_method: selectedMethods,
        cpf_link: selectedMethods.includes("cpf") ? cpfLink : undefined,
      }).unwrap();

      setSuccess("Options de paiement mises à jour avec succès !");
    } catch (err: any) {
      setError(err?.data?.message || "Une erreur est survenue lors de la mise à jour.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <PaymentSkeleton />;
  }

  if (fetchError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Erreur lors du chargement des données de paiement.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Payment Methods Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Options de financement acceptées
          </CardTitle>
          <CardDescription>
            Sélectionnez les options de financement que vous acceptez pour cette formation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethods.includes(method.id);

            return (
              <div
                key={method.id}
                className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Checkbox
                  id={method.id}
                  checked={isSelected}
                  onCheckedChange={(checked) => handleMethodChange(method.id, checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <Label htmlFor={method.id} className="text-base font-medium cursor-pointer">
                      {method.label}
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* CPF Link Section */}
      {selectedMethods.includes("cpf") && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Lien CPF
            </CardTitle>
            <CardDescription>
              Fournissez le lien vers la page CPF pour cette formation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpf-link">URL du lien CPF</Label>
              <Input
                id="cpf-link"
                type="url"
                placeholder="https://www.moncompteformation.gouv.fr/..."
                value={cpfLink}
                onChange={(e) => handleCpfLinkChange(e.target.value)}
                className="w-full"
                maxLength={255}
              />
              <p className="text-xs text-gray-500">
                Les étudiants pourront accéder à ce lien pour effectuer leur paiement CPF
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Note */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Les étudiants pourront choisir leur mode de financement préféré lors de l'inscription,
          parmi ceux que vous avez sélectionnés.
        </AlertDescription>
      </Alert>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || selectedMethods.length === 0}
          className="min-w-[200px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mise à jour...
            </>
          ) : (
            "Enregistrer les modifications"
          )}
        </Button>
      </div>
    </div>
  );
}
