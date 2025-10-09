"use client";
import { CreditCard } from "lucide-react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

interface CardPaymentProps {
  // Fallback amount to show until backend returns authoritative amount
  amount?: number;
  // URL where Stripe should redirect after confirmation
  returnUrl: string;
  // Selection state controlled by parent UI container
  isSelected: boolean;
  onSelect: () => void;

  // Backend identifiers to create a payment on the server
  idSession?: string;
  idUser?: string;

  // Optional: base URL for the API if different domain; defaults to relative
  apiBaseUrl?: string;

  // Back-compat props (optional): if parent still provides these we will use them
  clientSecret?: string | null;
  onConfirm?: (payload: {
    stripe: any;
    elements: any;
    clientSecret: string;
    confirmParams: { return_url: string };
  }) => Promise<void> | void;
}

export function CardPayment({
  amount,
  returnUrl,
  isSelected,
  onSelect,
  idSession,
  idUser,
  apiBaseUrl,
  clientSecret: clientSecretProp,
  onConfirm,
}: CardPaymentProps) {
  const [serverClientSecret, setServerClientSecret] = useState<string | null>(
    clientSecretProp ?? null
  );
  const [resolvedAmount, setResolvedAmount] = useState<number | undefined>(amount);
  const [initializing, setInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string | undefined;
  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey) : null),
    [publishableKey]
  );

  useEffect(() => {
    let cancelled = false;
    async function createPayment() {
      if (!isSelected) return;
      if (serverClientSecret) return; // already have one
      // Only attempt server init if identifiers are provided
      if (!idSession || !idUser) return;
      setInitializing(true);
      setError(null);
      try {
        const endpoint = `${apiBaseUrl ?? ""}/paymentmethodcard/create`;
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_session: idSession, id_user: idUser }),
        });
        if (!res.ok) {
          throw new Error(`Échec de l'initialisation du paiement (${res.status})`);
        }
        const data = await res.json();
        // Accept only proper client secret; if URL is provided instead, redirect to it
        const cs: string | undefined = data.clientSecret || data.client_secret || null;
        const checkoutUrl: string | undefined = data.url || data.checkout_url || undefined;
        if (!cs && checkoutUrl) {
          // Redirect to hosted checkout if server chose that flow
          window.location.assign(checkoutUrl);
          return;
        }
        if (!cs) {
          throw new Error("Le serveur n'a pas renvoyé de client secret");
        }
        if (!cancelled) {
          setServerClientSecret(cs);
          if (typeof data.amount === "number") setResolvedAmount(data.amount);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Une erreur est survenue");
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }
    createPayment();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, idSession, idUser, isSelected, serverClientSecret]);

  const amountLabel = useMemo(() => {
    if (typeof resolvedAmount === "number") return resolvedAmount;
    if (typeof amount === "number") return amount;
    return undefined;
  }, [resolvedAmount, amount]);

  const Inner = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements || !serverClientSecret) return;
      setSubmitting(true);
      try {
        if (onConfirm) {
          await onConfirm({
            stripe,
            elements,
            clientSecret: serverClientSecret,
            confirmParams: { return_url: returnUrl },
          });
        } else {
          const result = await stripe.confirmPayment({
            elements,
            clientSecret: serverClientSecret,
            confirmParams: { return_url: returnUrl },
            redirect: "if_required",
          });
          if (result.error) {
            throw new Error(result.error.message || "Le paiement a échoué");
          }
        }
      } catch (e: any) {
        setError(e?.message ?? "Une erreur est survenue lors du paiement");
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {serverClientSecret && <PaymentElement options={{ layout: "tabs" }} />}
        <Button
          type="submit"
          disabled={!stripe || !serverClientSecret || submitting}
          className="w-full font-bold"
          size="lg"
        >
          {submitting ? "Traitement..." : `Payer ${amountLabel ?? ""} €`}
        </Button>
      </form>
    );
  };

  return (
    <div
      className={`flex-1 rounded-lg border-2 p-4 ${isSelected ? "border-primary bg-primary/5 text-primary" : "border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900"}`}
      onClick={onSelect}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <CreditCard size={24} />
        <p className="font-semibold">Carte</p>
        <p className="text-xs text-gray-500">Paiement immédiat</p>
      </div>
      {isSelected && (
        <>
          {!!error && <p className="text-sm text-red-600 mt-3">{error}</p>}
          {serverClientSecret ? (
            publishableKey && stripePromise ? (
              <Elements stripe={stripePromise} options={{ clientSecret: serverClientSecret }}>
                <Inner />
              </Elements>
            ) : (
              <p className="text-sm text-red-600 mt-3">Clé Stripe publique manquante</p>
            )
          ) : (
            <div className="mt-4 text-sm text-gray-500">
              {initializing ? "Préparation du paiement..." : "En attente d'initialisation"}
            </div>
          )}
        </>
      )}
    </div>
  );
}
