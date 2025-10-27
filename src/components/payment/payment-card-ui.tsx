"use client";
import React, { useState } from "react";
import { CPFCard } from "./cards/cpf-card";
import { OPCOCard } from "./cards/opco-card";
import { CardPayment } from "./cards/card";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { convertToSubcurrency } from "@/lib/convert-to-subcurrency";

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
  availableMethods = ["card"],
  cpfLink,
}: CheckoutPageProps) {
  const [selectedOption, setSelectedOption] = useState<"opco" | "cpf" | "card" | null>("card");

  const [error, setError] = useState<string | null>(null);

  // Determine which options to show
  const showOPCO = availableMethods.map((m) => m.toUpperCase()).includes("OPCO");
  const showCPF = availableMethods.map((m) => m.toUpperCase()).includes("CPF");
  const showCARD = availableMethods.map((m) => m.toUpperCase()).includes("CARD");

  const handleSelectCard = (e: React.MouseEvent) => {
    setSelectedOption("card");
  };

  return (
    <div className="space-y-6">
      {/* Payment options */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* OPCO Option */}
        {showOPCO && (
          <OPCOCard
            sessionId={sessionId}
            isSelected={selectedOption === "opco"}
            onSelect={() => setSelectedOption("opco")}
          />
        )}

        {/* CPF Option */}
        {showCPF && (
          <CPFCard
            sessionId={sessionId}
            cpfLink={cpfLink}
            isSelected={selectedOption === "cpf"}
            onSelect={() => setSelectedOption("cpf")}
          />
        )}

        {/* Card Option - Just the selection card, not the form */}
        {showCARD && selectedOption !== "card" && (
          <div
            className="flex-1 rounded-lg border-2 p-4 cursor-pointer transition-all border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900"
            onClick={handleSelectCard}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
              <p className="font-semibold">Card</p>
              <p className="text-xs text-gray-500">Instant payment</p>
            </div>
          </div>
        )}
      </div>

      {/* Card payment form - rendered separately when card is selected */}
      {selectedOption === "card" && (
        <div className="bg-white border-2 border-primary rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
              <h3 className="font-semibold text-lg">Card Payment</h3>
            </div>
            <button
              onClick={() => {
                setSelectedOption(null);
                setError(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <Elements
            stripe={stripePromise}
            options={{
              amount: convertToSubcurrency(amount),
              mode: "payment",
              currency: "eur",
              locale: "fr",
            }}
          >
            <CardPayment amount={amount} sessionId={sessionId} />
          </Elements>
        </div>
      )}

      {/* CPF confirmation message */}
      {selectedOption === "cpf" && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h3 className="font-medium text-green-900 mb-2">Paiement CPF sélectionné</h3>
          <p className="text-sm text-green-700">
            Vous avez choisi de payer via votre Compte Personnel de Formation. Une nouvelle fenêtre
            s'est ouverte vers MonCompteFormation.gouv.fr
          </p>
        </div>
      )}

      {/* OPCO confirmation message */}
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
