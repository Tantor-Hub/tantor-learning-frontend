"use client";
import React, { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import { Building, Euro, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { CPFCard } from "./cards/cpf-card";
import { OPCOCard } from "./cards/opco-card";
import { CardPayment } from "./cards/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { convertToSubcurrency } from "@/lib/convert-to-subcurrency";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";

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
  availableMethods?: string[];
  cpfLink?: string;
  handleOPCOPayment: (formData: OpcoFormData) => Promise<void>;
  handleCARDPayment: (paymentData: any) => Promise<void>;
  hasDocument: boolean;
  isValidOPCO: boolean;
}

export function CheckoutPage({
  amount,
  sessionId,
  trainingId,
  availableMethods = ["opco", "cpf", "card"],
  cpfLink,
  isValidOPCO,
  handleOPCOPayment,
  handleCARDPayment,
  hasDocument,
}: CheckoutPageProps) {
  // const amount = parseFloat((0.5 * 100).toFixed(2));
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"opco" | "cpf" | "card" | null>(null);
  const [showOpcoForm, setShowOpcoForm] = useState(false);
  const [formData, setFormData] = useState<OpcoFormData>({
    companyName: "",
    siren: "",
    managerName: "",
    phone: "",
    email: "",
  });
  const currentUser = useSelector(selectCurrentUser);
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
    // Pre-create card intent even if card isn't chosen yet to save time
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/stripe/payment/card`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: amount, session_id: sessionId, user_id: currentUser?.id }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => {
        console.error("Erreur lors de la création du payment intent:", error);
        setErrorMessage("Erreur lors de l'initialisation du paiement");
      });
  }, [amount, sessionId, currentUser?.id]);

  // selection helpers
  const select = (k: "opco" | "cpf" | "card") => setSelectedOption(k);

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
      // Appeler la fonction du parent pour gérer le paiement par carte
      await handleCARDPayment({
        stripe,
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/trainings/${trainingId}/${sessionId}/success-payment?amount=${amount}&hasDocument=${hasDocument}&trainingId=${trainingId}&sessionId=${sessionId}`,
        },
      });
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
        setSubmissionSuccess(isValidOPCO);
      });
    } catch (error: any) {
      setErrorMessage(error.message || "Erreur lors de la soumission");
    } finally {
      setSubmissionLoading(false);
    }
  };

  // Determine which options to show based on availableMethods prop (values expected uppercase)
  const showOPCO = availableMethods.map((m) => m.toUpperCase()).includes("OPCO");
  const showCPF = availableMethods.map((m) => m.toUpperCase()).includes("CPF");
  const showCARD = availableMethods.map((m) => m.toUpperCase()).includes("CARD");

  return (
    <div className="space-y-6">
      {/* Options de paiement */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Option OPCO */}
        {showOPCO && (
          <OPCOCard
            isSelected={selectedOption === "opco"}
            onSelect={() => select("opco")}
            onConfigured={async (opco) => {
              // delegate to parent handler
              await handleOPCOPayment({
                companyName: opco.nom_entreprise,
                siren: opco.siren,
                managerName: opco.nom_responsable,
                phone: opco.telephone_responsable,
                email: opco.email_responsable,
              });
            }}
          />
        )}

        {/* Option CPF */}
        {showCPF && (
          <CPFCard
            sessionId={sessionId}
            cpfLink={cpfLink}
            isSelected={selectedOption === "cpf"}
            onSelect={() => select("cpf")}
          />
        )}

        {/* Option Carte */}
        {showCARD && (
          <CardPayment
            amount={amount}
            returnUrl={`${process.env.NEXT_PUBLIC_APP_URL}/trainings/${trainingId}/${sessionId}/success-payment?amount=${amount}&hasDocument=${hasDocument}&trainingId=${trainingId}&sessionId=${sessionId}`}
            clientSecret={clientSecret}
            isSelected={selectedOption === "card"}
            onSelect={() => select("card")}
            onConfirm={async (payload) => {
              await handleCARDPayment(payload);
            }}
          />
        )}
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

      {/* Card details now rendered inside CardPayment when selected */}

      {/* Message de confirmation pour CPF */}
      {selectedOption === "cpf" && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h3 className="font-medium text-green-900 mb-2">Paiement CPF sélectionné</h3>
          <p className="text-sm text-green-700">
            Vous avez choisi de payer via votre Compte Personnel de Formation. Une nouvelle fenêtre
            s'est ouverte vers MonCompteFormation.gouv.fr
          </p>
        </div>
      )}

      {/* Message de confirmation pour OPCO */}
      {selectedOption === "opco" && !showOpcoForm && (
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
