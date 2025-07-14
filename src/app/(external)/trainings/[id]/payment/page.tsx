"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LockIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PaymentForm from "@/components/payment-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckoutPage } from "@/components/payment/checkout-page";
import { convertToSubcurrency } from "@/lib/convert-to-subcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Badge } from "@/components/ui/badge";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Page() {
  const [open, setOpen] = useState(false);
  const amount = 40;
  const router = useRouter();

  // Function to handle success
  const handlePaymentSuccess = () => {
    setOpen(true);
    // Show confirmation dialog briefly then redirect
    setTimeout(() => {
      router.push("/formations/payment/success-payment");
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left - Info course */}
          <div>
            <div>
              <Card className="border">
                <div className="h-2 bg-gradient-to-r from-blue-400 to-primary"></div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-primary">
                        Diplôme de Comptabilité et de Gestion (DCG)
                      </h2>
                      <p className="text-sm font-medium mt-1 text-primary/50">
                        Comptabilité et Finance • Bac+3
                      </p>
                    </div>
                    <Badge variant="outline">RNCP35526</Badge>
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    <p>
                      Le Diplôme de Comptabilité et de Gestion (DCG) est un diplôme d&apos;État de
                      niveau licence (Bac+3) qui constitue la première étape du cursus
                      d&apos;expertise comptable.
                    </p>
                  </div>

                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 p-1 rounded-full">
                        {/* calendar icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-blue-800"
                          width="24"
                          height="24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="18" height="18" x="3" y="3" rx="2" />
                          <path d="M3 9h18" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-700">
                        Alternance, En ligne, À la carte
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 p-1 rounded-full">
                        {/* clock icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-blue-800"
                          width="24"
                          height="24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-700">3 ans</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 p-1 rounded-full">
                        {/* info icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-blue-800"
                          width="24"
                          height="24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" x2="12" y1="8" y2="12" />
                          <line x1="12" x2="12.01" y1="16" y2="16" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-700">À partir de 199€</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Total à payer</span>
                      <span className="text-xl font-bold text-primary">199,00 €</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right - Form + modal trigger */}
          <div>
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">
                  Méthode de paiement
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Ajouter un nouveau CardDescriptionaiement à votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Elements
                  stripe={stripePromise}
                  options={{
                    mode: "payment",
                    amount: convertToSubcurrency(amount),
                    currency: "eur",
                  }}
                >
                  <CheckoutPage amount={amount} />
                </Elements>
              </CardContent>

              {/* <CardContent className="p-6">
                <PaymentForm onSuccess={handlePaymentSuccess} />
              </CardContent> */}
            </Card>
          </div>
        </div>
      </div>

      {/*  Modal de confirmation */}
      {/*       
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paiement réussi 🎉</DialogTitle>
            <DialogDescription>
              Merci pour votre inscription. Vous recevrez un email de confirmation sous peu.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setOpen(false)}>Fermer</Button>
          </div>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
