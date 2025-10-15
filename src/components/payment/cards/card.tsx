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
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(true);

  // the to communicate with the backend

  useEffect(() => {
    setIsCreating(true);
    // console.log("Fetching client secret for sessionId:", sessionId);
    fetch(`${BASE_URL}/paymentmethodcard/payment-intent`, {
      method: "POST",
      headers: {
        "x-connexion-tantor": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_session: sessionId,
      }),
    })
      .then((res) => {
        // console.log(res);
        // console.log("Fetch response status:", res.status);
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.data?.message || `HTTP error! status: ${res.status}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        // console.log(data.data.clientSecret);
        setClientSecret(data.data.clientSecret);
        // console.log("Received data:", data);
        if (!data.data.clientSecret) {
          throw new Error("No client secret received from server");
        }
        // console.log("Client secret set:", data.data.clientSecret);
        setIsCreating(false);
      })
      .catch((error) => {
        // console.error("Error fetching client secret:", error);
        setErrorMessage(error.message || "Failed to initialize payment");
        setIsCreating(false);
      });
  }, [sessionId, BASE_URL, token]);
  // handle submit to the server

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    if (!clientSecret) {
      setErrorMessage("Payment initialization failed. Please refresh and try again.");
      setLoading(false);
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    //
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://www.localhost:3000/trainings/id/payment/success-payment?amount=${amount}`,
      },
      redirect: "if_required",
    });

    if (error) {
      console.log(error);
      setErrorMessage(error.message);
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Payment succeeded, redirect to success page
      window.location.href = `http://www.localhost:3000/trainings/id/payment/success-payment?amount=${amount}`;
    } else {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        {
          <PaymentElement
            options={{
              layout: "tabs",
            }}
          />
        }
      </div>

      {errorMessage && <div className="text-red-600 text-sm">{errorMessage}</div>}

      <Button
        type="submit"
        size="lg"
        disabled={!stripe || loading || !clientSecret}
        className="w-full disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="animate-spin" /> : `Payer ${+amount} €`}
      </Button>
    </form>
  );
}
