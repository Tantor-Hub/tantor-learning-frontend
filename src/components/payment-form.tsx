"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, AlertCircle, LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { on } from "events";

type PaymentFormProps = {
  onSubmit?: () => void;
  className?: string;
  onSuccess?: () => void;
};

export default function PaymentForm({ onSubmit, onSuccess, className }: PaymentFormProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formState, setFormState] = useState({
    name: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvc: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit();
    }

    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/success");
    }
  };
  return (
    <div className={className}>
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-blue-900">Méthode de paiement</h2>
        <p className="text-sm text-gray-500">Ajouter un nouveau paiement à votre compte</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="mb-6">
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="grid grid-cols-3 gap-4"
          >
            <div className="relative">
              <RadioGroupItem value="card" id="card" className="peer sr-only" />
              <Label
                htmlFor="card"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600"
              >
                <CreditCard className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">Card</span>
              </Label>
            </div>

            <div className="relative">
              <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
              <Label
                htmlFor="paypal"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600"
              >
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
                  className="mb-3 h-6 w-6"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span className="text-sm font-medium">Paypal</span>
              </Label>
            </div>

            <div className="relative">
              <RadioGroupItem value="apple" id="apple" className="peer sr-only" />
              <Label
                htmlFor="apple"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600"
              >
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
                  className="mb-3 h-6 w-6"
                >
                  <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
                  <path d="M10 2c1 .5 2 2 2 5" />
                </svg>
                <span className="text-sm font-medium">Apple</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {paymentMethod === "card" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Nom sur la carte
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="mt-1 bg-gray-50 focus:bg-white transition-colors"
                  value={formState.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="cardNumber" className="text-sm font-medium">
                  Numéro de carte
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="bg-gray-50 focus:bg-white transition-colors pl-10"
                    value={formState.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <Label htmlFor="expMonth" className="text-sm font-medium">
                    Mois
                  </Label>
                  <Input
                    id="expMonth"
                    placeholder="MM"
                    className="mt-1 bg-gray-50 focus:bg-white transition-colors"
                    value={formState.expMonth}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-span-1">
                  <Label htmlFor="expYear" className="text-sm font-medium">
                    Année
                  </Label>
                  <Input
                    id="expYear"
                    placeholder="YY"
                    className="mt-1 bg-gray-50 focus:bg-white transition-colors"
                    value={formState.expYear}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-span-1">
                  <Label htmlFor="cvc" className="text-sm font-medium">
                    CVC
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="cvc"
                      placeholder="123"
                      className="bg-gray-50 focus:bg-white transition-colors"
                      value={formState.cvc}
                      onChange={handleInputChange}
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 group">
                      <AlertCircle className="h-4 w-4 text-gray-400" />
                      <div className="absolute bottom-full right-0 mb-2 hidden w-48 rounded bg-black p-2 text-xs text-white group-hover:block z-10">
                        Le code de sécurité (CVC) est un code à 3 ou 4 chiffres situé au dos de
                        votre carte.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "paypal" && (
          <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700">
            <p>Vous serez redirigé vers PayPal pour finaliser votre paiement.</p>
          </div>
        )}

        {paymentMethod === "apple" && (
          <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700">
            <p>Vous serez redirigé vers Apple Pay pour finaliser votre paiement.</p>
          </div>
        )}

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Retour
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md transition-colors"
          >
            <LockIcon className="mr-2 h-4 w-4" />
            Payer maintenant
          </Button>
        </div>
      </form>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <div className="flex items-center justify-center h-8 w-12 bg-gray-100 rounded">
          <span className="text-xs font-bold text-gray-600">VISA</span>
        </div>
        <div className="flex items-center justify-center h-8 w-12 bg-gray-100 rounded">
          <span className="text-xs font-bold text-gray-600">MC</span>
        </div>
        <div className="flex items-center justify-center h-8 w-12 bg-gray-100 rounded">
          <span className="text-xs font-bold text-gray-600">AMEX</span>
        </div>
        <div className="flex items-center justify-center h-8 w-12 bg-gray-100 rounded">
          <span className="text-xs font-bold text-gray-600">PAYPAL</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
        <LockIcon size={14} />
        <span>Paiement sécurisé par cryptage SSL</span>
      </div>
    </div>
  );
}
