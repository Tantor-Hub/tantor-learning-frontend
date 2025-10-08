"use client";
import { CreditCard } from "lucide-react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CardPaymentProps {
  amount: number;
  returnUrl: string;
  clientSecret: string | null;
  isSelected: boolean;
  onSelect: () => void;
  onConfirm: (payload: {
    stripe: any;
    elements: any;
    clientSecret: string;
    confirmParams: { return_url: string };
  }) => Promise<void> | void;
}

export function CardPayment({
  amount,
  returnUrl,
  clientSecret,
  isSelected,
  onSelect,
  onConfirm,
}: CardPaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;
    setLoading(true);
    try {
      await onConfirm({ stripe, elements, clientSecret, confirmParams: { return_url: returnUrl } });
    } finally {
      setLoading(false);
    }
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
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {clientSecret && <PaymentElement options={{ layout: "tabs" }} />}
          <Button
            type="submit"
            disabled={!stripe || !clientSecret || loading}
            className="w-full font-bold"
            size="lg"
          >
            {loading ? "Traitement..." : `Payer ${amount} €`}
          </Button>
        </form>
      )}
    </div>
  );
}
