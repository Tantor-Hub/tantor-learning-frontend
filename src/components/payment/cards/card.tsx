"use client";
import { useEffect } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "@/features/auth/auth-slice";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function CardPayment({ sessionId, amount }: { sessionId: string; amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const token = useSelector(selectToken);
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  // the to communicate with the backend

  useEffect(() => {
    fetch(
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
    )
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [sessionId]);

  // handle submit to the server

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={!stripe || !elements || isLoading || !isReady}
        className="w-full disabled:cursor-not-allowed"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : `Pay ${+amount} €`}
      </Button>
    </form>
  );
}
