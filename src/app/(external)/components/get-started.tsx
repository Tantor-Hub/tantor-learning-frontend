"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/features/auth/auth-slice";
import { useAuth } from "@/hooks/use-auth";

const stepsData = [
  {
    id: 1,
    icon: "/icons/step1.png",

    title: "Inscrivez-vous",
    description:
      "Créez un compte en quelques secondes et connectez-vous. Peu après, passez à la seconde étape.",
  },
  {
    id: 2,
    icon: "/icons/step2.png",

    title: "Choisissez votre formation",
    description:
      "Accédez au large catalogue de nos formations et choisissez celui qui vous convient le mieux : en présentiel, en ligne ou même les deux.",
  },
  {
    id: 3,
    icon: "/icons/step3.png",
    title: "Apprenez et Progressez",
    description: "Suivez vos cours à votre rythme en trackant votre progrès.",
  },
];

export const features = [
  {
    title: "Prise en charge employeur",
    subtitle: "(OPCO)",
  },
  {
    title: "Mon Compte Formation",
    subtitle: "(CPF)",
  },
  {
    title: "Paiement par Cartes",
    subtitle: "(CARD)",
  },
];

export function GetStarted() {
  const isAuthenticated = useAuth(); // Use the improved useAuth hook for server-side validation
  const router = useRouter();
  return (
    <section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <h2 className="text-4xl font-medium font-work-sans text-primary mb-12 text-center">
          Démarrez en trois Étapes Simples
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stepsData.map((step) => (
            <div
              key={step.id}
              className="bg-white p-8 rounded-2xl shadow-lg  border text-center flex flex-col items-center min-h-60 md:min-h-80"
            >
              <Image
                src={step.icon}
                height={100}
                width={100}
                alt={`step ${step.id} icon`}
                className="size-[100px] relative -top-20"
              />
              <h3 className="text-[18px] md:text-[24px] font-semibold -mt-10 text-gray-800">
                {step.title}
              </h3>
              <p className="text-[#979DAC] mt-2 leading-8">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row max-w-[1200px] mt-7 justify-between gap-5 mx-auto">
          {features.map((feature, id) => (
            <div key={"feature" + id} className="flex gap-8 items-center">
              <picture className="size-[60px] shadow-sm rounded-full flex items-center justify-center">
                <Image
                  src="/icons/feature.svg"
                  height={60}
                  width={60}
                  alt={`feature ${id + 1} icon`}
                  className="size-[20px]"
                />
              </picture>
              <div className="text-[#696984] font-light">
                <p>{feature.title}</p>
                <p>{feature.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-6 mt-6">
          <p className="text-2xl font-medium font-work-sans text-primary text-center">
            Prêt à apprendre ? Rejoignez-nous aujourd'hui !{" "}
          </p>
          {!isAuthenticated && (
            <Button size="lg" onClick={() => router.push("/signup")}>
              S'inscrire
              <ArrowRight />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
