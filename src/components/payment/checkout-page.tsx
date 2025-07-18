"use client";
import React, { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { convertToSubcurrency } from "@/lib/convert-to-subcurrency";
import { Button } from "../ui/button";
import { Building, Euro } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRouter } from "next/navigation";

export function CheckoutPage({ amount }: { amount: number }) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"OPCO" | "CPF" | null>(null);
  const [showOpcoForm, setShowOpcoForm] = useState(false);
  const [formData, setFormData] = useState({
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
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  useEffect(() => {
    if (selectedOption === "CPF") {
      router.replace("/");
      window.open("https://www.wikipedia.org", "_blank");
    }
  }, [selectedOption]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://www.localhost:3000/trainings/id/payment/success-payment?amount=${amount}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
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
      await fetch("/api/submit-opco-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      setSubmissionSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      setErrorMessage("Erreur lors de la soumission");
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
    <div className="">
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div
          tabIndex={0}
          className={`rounded-sm border p-3 hover:cursor-pointer shadow m-0 ${
            selectedOption === "OPCO"
              ? "border border-ring text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 rounded-md p-2"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => {
            setSelectedOption("OPCO");
            setShowOpcoForm(true);
          }}
        >
          <div className="p-0">
            <Building size={18} className="mb-1" />
            <p className="text-sm font-semibold">OPCO</p>
          </div>
        </div>
        <div
          tabIndex={1}
          className={`rounded-sm border p-3 hover:cursor-pointer shadow m-0 ${
            selectedOption === "CPF"
              ? "border border-ring text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 rounded-md p-2"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setSelectedOption("CPF")}
        >
          <div className="p-0">
            <Euro size={18} className="mb-1" />
            <p className="text-sm font-semibold">CPF</p>
          </div>
        </div>
      </div>

      {/* Formulaire OPCO */}
      <Dialog open={showOpcoForm} onOpenChange={setShowOpcoForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informations employeur</DialogTitle>
          </DialogHeader>

          {submissionSuccess ? (
            <div className="space-y-4">
              <p>
                Votre demande a été envoyée au secrétariat. Votre inscription sera validée après
                vérification. Vous serez redirigé vers la page d'accueil.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Renseignez les informations de votre employeur. Votre dossier sera mis en attente de
                validation.
              </p>

              <div className="space-y-2">
                <Label>Nom de l'entreprise</Label>
                <Input
                  placeholder="Entrez le nom de l'entreprise"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
                {formErrors.companyName && (
                  <p className="text-sm text-red-500">Ce champ est obligatoire</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Numéro SIREN (9 chiffres)</Label>
                <Input
                  placeholder="123456789"
                  value={formData.siren}
                  onChange={(e) => setFormData({ ...formData, siren: e.target.value })}
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
                <Label>Responsable formation</Label>
                <Input
                  placeholder="Nom du responsable"
                  value={formData.managerName}
                  onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                />
                {formErrors.managerName && (
                  <p className="text-sm text-red-500">Ce champ est obligatoire</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  placeholder="+33 6 12 34 56 78"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                <Label>Email</Label>
                <Input
                  placeholder="contact@entreprise.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                {submissionLoading ? "Envoi en cours..." : "Soumettre"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Paiement standard */}
      <form onSubmit={handleSubmit}>
        {clientSecret && <PaymentElement options={{ layout: "tabs" }} />}
        {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
        <Button
          disabled={!stripe || loading}
          className="w-full font-bold disabled:opacity-50 disabled:animate-pulse mt-4"
          size="lg"
        >
          {!loading ? `Payer maintenant $${amount}` : "Traitement..."}
        </Button>
      </form>
    </div>
  );
}
