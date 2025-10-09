"use client";
import React, { useState, useEffect } from "react";
import { CPFCard } from "./cards/cpf-card";
import { OPCOCard } from "./cards/opco-card";
import { CardPayment } from "./cards/card";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { useSelector } from "react-redux";
import { selectToken } from "@/features/auth/auth-slice";

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

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine which options to show
  const showOPCO = availableMethods.map((m) => m.toUpperCase()).includes("OPCO");
  const showCPF = availableMethods.map((m) => m.toUpperCase()).includes("CPF");
  const showCARD = availableMethods.map((m) => m.toUpperCase()).includes("CARD");

  // Fetch payment intent only when card option is selected and clientSecret doesn't exist
  useEffect(() => {
    if (selectedOption !== "card" || clientSecret !== null || loading) {
      return;
    }

    // Check if token exists
    if (!token) {
      setError("Authentication token is missing. Please log in again.");
      return;
    }

    const createPaymentIntent = async () => {
      setLoading(true);
      setError(null);

      // Debug logging
      console.log("Creating payment intent with:", {
        sessionId,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 10)}...` : "none",
      });

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

        if (!response.ok) {
          // Log the full error response for debugging
          console.error("API Error Response:", data);
          const errorMessage = data.message || data.error || `Server error: ${response.status}`;
          throw new Error(errorMessage);
        }

        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          console.log("Payment intent created successfully");
        } else {
          console.error("No clientSecret in response:", data);
          setError("Failed to create payment intent - no client secret returned");
        }
      } catch (error) {
        console.error("Payment Intent Creation Error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An error occurred while loading the payment form";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [sessionId, token, selectedOption, clientSecret, loading]);

  const handleSelectCard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

          {loading && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading payment form...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-sm text-red-700 mb-2">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setClientSecret(null);
                  setLoading(false);
                }}
                className="text-sm text-red-600 hover:text-red-800 underline font-medium"
              >
                Try again
              </button>
            </div>
          )}

          {clientSecret && !loading && !error && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#0066cc",
                  },
                },
              }}
            >
              <CardPayment amount={amount} sessionId={sessionId} />
            </Elements>
          )}
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
