"use client";
import React, { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import { Building, Euro, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRouter } from "next/navigation";

// Types pour les données OPCO
export interface OpcoFormData {
  companyName: string;
  siren: string;
  managerName: string;
  phone: string;
  email: string;
}

// Types pour les props du composant
export interface CheckoutPageProps {
  amount: number;
  sessionId: string;
  trainingId: string;
  handleCPFPayment: () => void;
  handleOPCOPayment: (formData: OpcoFormData) => Promise<void>;
  handleCARDPayment: (paymentData: any) => Promise<void>;
}

export function CheckoutPage({
  amount,
  sessionId,
  trainingId,
  handleCPFPayment,
  handleOPCOPayment,
  handleCARDPayment,
}: CheckoutPageProps) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"OPCO" | "CPF" | "CARD" | null>(null);
  const [showOpcoForm, setShowOpcoForm] = useState(false);
  const [formData, setFormData] = useState<OpcoFormData>({
    companyName: "",
    siren: "",
    managerName: "",
    phone: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState({
    companyName: false,
    siren: false,
    managerName: false,
    phone: false,
    email: false,
  });
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: amount * 100 }), // Stripe utilise les centimes
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => {
        console.error("Erreur lors de la création du payment intent:", error);
        setErrorMessage("Erreur lors de l'initialisation du paiement");
      });
  }, [amount]);

  // Gérer la sélection CPF
  const handleCPFSelection = () => {
    setSelectedOption("CPF");
    handleCPFPayment();
  };

  // Gérer le paiement par carte
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(undefined);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    try {
      // Préparer les données de paiement
      const paymentData = {
        stripe,
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}trainings/${trainingId}/${sessionId}/success-payment?amount=${amount}`,
        },
      };

      // Appeler la fonction du parent pour gérer le paiement par carte
      await handleCARDPayment(paymentData);
    } catch (error: any) {
      setErrorMessage(error.message || "Erreur lors du paiement");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {
      companyName: !formData.companyName.trim(),
      siren: !formData.siren.trim() || !/^\d{9}$/.test(formData.siren),
      managerName: !formData.managerName.trim(),
      phone: !formData.phone.trim() || !/^[0-9 +-]+$/.test(formData.phone),
      email: !formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email),
    };
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleOpcoSubmit = async () => {
    if (!validateForm()) return;

    setSubmissionLoading(true);
    try {
      // Appeler la fonction du parent pour gérer le paiement OPCO
      await handleOPCOPayment(formData);
      setSubmissionSuccess(true);
      setTimeout(() => {
        setShowOpcoForm(false);
        setSubmissionSuccess(false);
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error.message || "Erreur lors de la soumission");
    } finally {
      setSubmissionLoading(false);
    }
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center py-12">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Options de paiement */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {/* Option OPCO */}
        <div
          tabIndex={0}
          className={`rounded-lg border-2 p-4 hover:cursor-pointer transition-all duration-200 ${
            selectedOption === "OPCO"
              ? "border-primary bg-primary/5 text-primary"
              : "border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => {
            setSelectedOption("OPCO");
            setShowOpcoForm(true);
          }}
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <Building size={24} />
            <p className="font-semibold">OPCO</p>
            <p className="text-xs text-gray-500">Prise en charge employeur</p>
          </div>
        </div>

        {/* Option CPF */}
        <div
          tabIndex={1}
          className={`rounded-lg border-2 p-4 hover:cursor-pointer transition-all duration-200 ${
            selectedOption === "CPF"
              ? "border-primary bg-primary/5 text-primary"
              : "border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900"
          }`}
          onClick={handleCPFSelection}
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <Euro size={24} />
            <p className="font-semibold">CPF</p>
            <p className="text-xs text-gray-500">Mon Compte Formation</p>
          </div>
        </div>

        {/* Option Carte */}
        <div
          tabIndex={2}
          className={`rounded-lg border-2 p-4 hover:cursor-pointer transition-all duration-200 ${
            selectedOption === "CARD"
              ? "border-primary bg-primary/5 text-primary"
              : "border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setSelectedOption("CARD")}
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <CreditCard size={24} />
            <p className="font-semibold">Carte</p>
            <p className="text-xs text-gray-500">Paiement immédiat</p>
          </div>
        </div>
      </div>

      {/* Message d'erreur global */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      {/* Formulaire OPCO */}
      <Dialog open={showOpcoForm} onOpenChange={setShowOpcoForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Informations employeur</DialogTitle>
          </DialogHeader>

          {submissionSuccess ? (
            <div className="space-y-4 text-center">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-green-800 font-medium">✓ Demande OPCO enregistrée avec succès</p>
                <p className="text-sm text-green-600 mt-2">
                  Votre dossier sera traité par notre équipe
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Renseignez les informations de votre employeur. Votre dossier sera mis en attente de
                validation.
              </p>

              <div className="space-y-2">
                <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                <Input
                  id="companyName"
                  placeholder="Entrez le nom de l'entreprise"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className={formErrors.companyName ? "border-red-500" : ""}
                />
                {formErrors.companyName && (
                  <p className="text-sm text-red-500">Ce champ est obligatoire</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="siren">Numéro SIREN (9 chiffres) *</Label>
                <Input
                  id="siren"
                  placeholder="123456789"
                  value={formData.siren}
                  onChange={(e) => setFormData({ ...formData, siren: e.target.value })}
                  className={formErrors.siren ? "border-red-500" : ""}
                />
                {formErrors.siren && (
                  <p className="text-sm text-red-500">
                    {!formData.siren.trim()
                      ? "Ce champ est obligatoire"
                      : "SIREN invalide (9 chiffres requis)"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="managerName">Responsable formation *</Label>
                <Input
                  id="managerName"
                  placeholder="Nom du responsable"
                  value={formData.managerName}
                  onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                  className={formErrors.managerName ? "border-red-500" : ""}
                />
                {formErrors.managerName && (
                  <p className="text-sm text-red-500">Ce champ est obligatoire</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  placeholder="+33 6 12 34 56 78"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={formErrors.phone ? "border-red-500" : ""}
                />
                {formErrors.phone && (
                  <p className="text-sm text-red-500">
                    {!formData.phone.trim()
                      ? "Ce champ est obligatoire"
                      : "Format de téléphone invalide"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  placeholder="contact@entreprise.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && (
                  <p className="text-sm text-red-500">
                    {!formData.email.trim() ? "Ce champ est obligatoire" : "Email invalide"}
                  </p>
                )}
              </div>

              <Button
                onClick={handleOpcoSubmit}
                disabled={submissionLoading}
                className="w-full mt-4"
              >
                {submissionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Envoi en cours...
                  </>
                ) : (
                  "Soumettre la demande OPCO"
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Paiement par carte - affiché seulement si CARD est sélectionné */}
      {selectedOption === "CARD" && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="font-medium text-blue-900 mb-2">Paiement par carte bancaire</h3>
            <p className="text-sm text-blue-700">
              Votre paiement sera sécurisé via Stripe. Aucune donnée bancaire n'est stockée sur nos
              serveurs.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {clientSecret && <PaymentElement options={{ layout: "tabs" }} />}

            <Button
              type="submit"
              disabled={!stripe || loading}
              className="w-full font-bold disabled:opacity-50 disabled:animate-pulse"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Traitement en cours...
                </>
              ) : (
                `Payer ${amount},00 €`
              )}
            </Button>
          </form>
        </div>
      )}

      {/* Message de confirmation pour CPF */}
      {selectedOption === "CPF" && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h3 className="font-medium text-green-900 mb-2">Paiement CPF sélectionné</h3>
          <p className="text-sm text-green-700">
            Vous avez choisi de payer via votre Compte Personnel de Formation. Une nouvelle fenêtre
            s'est ouverte vers MonCompteFormation.gouv.fr
          </p>
        </div>
      )}

      {/* Message de confirmation pour OPCO */}
      {selectedOption === "OPCO" && !showOpcoForm && (
        <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
          <h3 className="font-medium text-orange-900 mb-2">Demande OPCO en cours</h3>
          <p className="text-sm text-orange-700">
            Votre demande de prise en charge OPCO a été enregistrée. Notre équipe traitera votre
            dossier dans les plus brefs délais.
          </p>
        </div>
      )}
    </div>
  );
}
