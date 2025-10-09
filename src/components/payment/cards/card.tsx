"use client";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { FormEvent, useState } from "react";

export function CardPayment({ sessionId, amount }: { sessionId: string; amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isReady, setIsReady] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!stripe || !elements) {
      console.log("Stripe.js has not loaded yet.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Validate the form before submitting
      const { error: submitError } = await elements.submit();

      if (submitError) {
        setErrorMessage(submitError.message || "Please check your card details");
        setIsLoading(false);
        return;
      }

      console.log("Confirming payment for session:", sessionId);

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?sessionId=${sessionId}`,
        },
      });

      if (error) {
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Show error to your customer (for example, payment
        // details incomplete)
        setErrorMessage(error.message || "An error occurred during payment");
        console.error("Payment confirmation error:", error);
      } else {
        // The payment will redirect to return_url if successful
        console.log("Payment successful - redirecting...");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="min-h-[200px]">
          <PaymentElement
            options={{
              layout: "tabs",
            }}
            onReady={() => {
              console.log("Payment Element is ready");
              setIsReady(true);
            }}
            onLoadError={(error) => {
              console.error("Payment Element load error:", error);
              setErrorMessage("Failed to load payment form. Please refresh the page.");
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!stripe || !elements || isLoading || !isReady}
          className="w-full bg-primary text-white py-3 px-4 rounded-md font-bold hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-base"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Processing...
            </span>
          ) : (
            `Pay ${amount} €`
          )}
        </button>

        {!isReady && !errorMessage && (
          <p className="text-sm text-gray-500 text-center">Loading payment fields...</p>
        )}
      </form>
    </div>
  );
}
