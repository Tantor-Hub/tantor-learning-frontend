"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LottieSuccessView } from "@/components/payment/lottie-success-view";
import { useSearchParams } from "next/navigation";
export default function PageSuccess() {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount") as string;
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/"); // Changez cette route selon votre structure
          return 0;
        }
        return prev - 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <>
      <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">Paiement réussi 🎉</h1>
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
