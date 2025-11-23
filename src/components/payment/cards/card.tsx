"use client";
import { useEffect } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "@/features/auth/auth-slice";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCreatePaymentIntentMutation } from "@/lib/apis/payment-method-card";

export function CardPayment({ sessionId, amount }: { sessionId: string; amount: number }) {
  const stripe = useStripe();
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
  const elements = useElements();
  const token = useSelector(selectToken);
  const [createPayment] = useCreatePaymentIntentMutation();
  const [clientSecret, setClientSecret] = useState("");
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(true);

  // the to communicate with the backend

  useEffect(() => {
    setIsCreating(true);

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
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.data?.message || `HTTP error! status: ${res.status}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.data.clientSecret);

        if (!data.data.clientSecret) {
          throw new Error("No client secret received from server");
        }

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
        return_url: `${APP_URL}/trainings/id/payment/success-payment?amount=${amount}`,
      },
      // payment_method_types: ["card"],
      redirect: "if_required",
    });
    // if sucess

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Create the payment record on the backend
      try {
        await createPayment({
          id_session: sessionId,
          stripe_payment_intent_id: paymentIntent.id,
        }).unwrap();
        // Payment record created, redirect to success page
        window.location.href = `http://localhost:3000/trainings/id/payment/success-payment?amount=${amount}`;
      } catch (error) {
        // console.error("Error creating payment record:", error);
        setErrorMessage("Payment succeeded but failed to record. Please contact support.");
        setLoading(false);
      }
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
              // wallets: { applePay: "never", googlePay: "never" },
              layout: "tabs",
              // fields: {
              //   billingDetails: {
              //     email: "never", // Adjust as needed
              //     phone: "never",
              //     name: "never",
              //     address: "never",
              //   },
              // },
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
