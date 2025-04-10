"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import CourseModal from "@/components/course-modal"; // Import the CourseModal component

export default function PaymentPage() {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // State for CourseModal
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
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">
          Vous êtes sur le point de finaliser votre paiement en ligne de manière sécurisée
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left - Info course */}
          <div>
            <div className="sticky top-8">
              <p className="text-sm font-medium text-gray-700 mb-3">Formation sélectionnée :</p>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-800"></div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-blue-800">
                        Diplôme de Comptabilité et de Gestion (DCG)
                      </h2>
                      <p className="text-sm font-medium mt-1 text-blue-700">
                        Comptabilité et Finance • Bac+3
                      </p>
                    </div>
                    <div className="bg-blue-800 text-white text-xs font-bold px-2 py-1 rounded-full">
                      RNCP35526
                    </div>
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
                      <span className="text-xl font-bold text-blue-800">199,00 €</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="mt-6 w-full border-blue-800 text-blue-800 hover:bg-blue-50"
                    onClick={() => setModalOpen(true)}
                  >
                    Plus de détails
                  </Button>
                </CardContent>
              </Card>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                <LockIcon size={14} />
                <span>Paiement sécurisé par cryptage SSL</span>
              </div>
            </div>
          </div>

          {/* Right - Form + modal trigger */}
          <div>
            <Card className="shadow-lg border-gray-200">
              <CardContent className="p-6">
                <PaymentForm onSuccess={handlePaymentSuccess} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/*  Modal de confirmation */}
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
      </Dialog>

      {/* Course Details Modal */}
      <CourseModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
