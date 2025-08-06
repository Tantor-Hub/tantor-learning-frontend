"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LottieSuccessView } from "@/components/payment/lottie-success-view";
import { useSearchParams } from "next/navigation";
export default function PageSuccess() {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount") as string;
  const hasDocument = searchParams.get("hasDocument");
  const trainingId = searchParams.get("trainingId");
  const sessionId = searchParams.get("sessionId");
  // trainings/${trainingId}/${sessionId}/success-payment?amount=${amount}&hasDocument=${hasDocument}`,
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (hasDocument) {
            router.push(`/trainings/${trainingId}/${sessionId}/documents`);
          } else {
            router.replace("/");
          }

          return 0;
        }
        return prev - 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <>
      <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-primary to-primary/60">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">Inscription réussie ! 🎉</h1>
          <h2 className="text-2xl">Félicitations! Votre paiement a été effectué avec succès</h2>
          <div className="bg-white p-2 rounded-md mt-5 text-4xl font-bold text-black">
            ${amount}
          </div>
          <div className="mt-8 text-lg">
            <p>Redirection vers le tableau de bord dans {countdown} secondes...</p>
            <div className="mt-4 bg-white/20 rounded-full h-2 w-full max-w-md mx-auto overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((5 - countdown) / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </main>
      <LottieSuccessView />
    </>
  );
}
