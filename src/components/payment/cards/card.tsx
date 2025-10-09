"use client";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { CreditCard } from "lucide-react";
import { FormEvent, useState } from "react";

export function CardPayment({
  sessionId,
  amount,
  isSelected,
  onSelect,
}: {
  sessionId: string;
  amount: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?sessionId=${sessionId}`,
        },
      });
      if (error) {
        setErrorMessage(error.message || "An error occurred during payment");
      } else {
        console.log("Payment successful for session:", sessionId);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex-1 rounded-lg border-2 p-4 cursor-pointer transition-all ${
        isSelected
          ? "border-primary bg-primary/5 text-primary"
          : "border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900"
      }`}
      onClick={onSelect}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <CreditCard size={24} />
        <p className="font-semibold">Card</p>
        <p className="text-xs text-gray-500">Instant payment</p>
      </div>

      {isSelected && (
        <>
          {errorMessage && <p className="text-sm text-red-600 mt-3">{errorMessage}</p>}
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <PaymentElement options={{ layout: "tabs" }} />
            <button
              type="submit"
              disabled={!stripe || isLoading}
              className="w-full bg-primary text-white py-2 px-4 rounded-md font-bold hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Processing..." : `Pay ${amount} €`}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
