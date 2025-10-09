"use client";
import React, { useState, useEffect } from "react";
import { CPFCard } from "./cards/cpf-card";
import { OPCOCard } from "./cards/opco-card";
import { CardPayment } from "./cards/card";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { useSelector } from "react-redux";
import { selectToken } from "@/features/auth/auth-slice";
// Types pour les props du composant
export interface CheckoutPageProps {
  amount: number;
  sessionId: string;
  trainingId: string;
  availableMethods?: string[];
  cpfLink?: string;
}

export function PaymentCardUI({
  amount,
  sessionId,
  availableMethods = ["opco", "cpf", "card"],
  cpfLink,
}: CheckoutPageProps) {
  const [selectedOption, setSelectedOption] = useState<"opco" | "cpf" | "card" | null>(null);
  const token = useSelector(selectToken);
  // selection helpers
  const select = (k: "opco" | "cpf" | "card") => setSelectedOption(k);

  // Determine which options to show based on availableMethods prop (values expected uppercase)
  const showOPCO = availableMethods.map((m) => m.toUpperCase()).includes("OPCO");
  const showCPF = availableMethods.map((m) => m.toUpperCase()).includes("CPF");
  const showCARD = availableMethods.map((m) => m.toUpperCase()).includes("CARD");

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch payment intent from your backend
    const createPaymentIntent = async () => {
      try {
        const response = await fetch(
          "https://modules-exemption-warrior-chronicles.trycloudflare.com/api/paymentmethodcard/create",
          {
            method: "POST",
            headers: {
              "x-connexion-tantor": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id_session: sessionId,
            }),
          }
        );

        const data = await response.json();

        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error("Failed to create payment intent");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [sessionId]);

  if (loading) return <div>Loading...</div>;
  if (!clientSecret) return <div>Failed to load payment form</div>;

  return (
    <div className="space-y-6">
      {/* Options de paiement */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Option OPCO */}
        {showOPCO && (
          <OPCOCard
            sessionId={sessionId}
            isSelected={selectedOption === "opco"}
            onSelect={() => select("opco")}
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
        {!showCARD && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
              },
            }}
          >
            <CardPayment
              amount={amount}
              isSelected={selectedOption === "card"}
              onSelect={() => select("card")}
              sessionId={sessionId}
            />
          </Elements>
        )}
      </div>

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
      {selectedOption === "opco" && (
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
