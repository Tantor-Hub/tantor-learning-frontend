"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BadgeEuro, Clock, GraduationCap, School } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";

// FAKE DATA
const dcgData = {
  id: Math.random() * 100,
  title: "Diplôme de Comptabilité et de Gestion (DCG)",
  category: "Comptabilité et Finance",
  level: "Bac+3",
  description:
    "Le Diplôme de Comptabilité et de Gestion (DCG) est un diplôme d'État de niveau licence (Bac+3) permettant d'acquérir des compétences complètes en gestion financière.",
  modalities: ["Alternance", "En ligne", "À la carte"],
  duration: "3 ans",
  rncp: "RNCP35526",
  price: "À partir de 199€",
};

const dcgArray = Array.from({ length: 8 }, () => ({ ...dcgData }));

export default function FormationsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* En-tête avec titre et description */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-3">
          Explorez Nos Formations Certifiantes
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Inscrivez-vous dès maintenant aux formations qui vous intéressent et obtenez une
          certification reconnue, que ce soit en ligne, en présentiel ou en format hybride. Adaptez
          votre apprentissage à votre rythme !
        </p>
      </div>

      {/* Grid des formations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dcgArray.map((dcgData, index) => (
          <Card
            key={index}
            className="border border-[#007AFF26] shadow-sm mt-0 pt-0 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-5 bg-[#007AFF26] flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-blue-900">{dcgData.title}</h2>
              <p className="text-gray-700 font-medium">
                {dcgData.category} • {dcgData.level}
              </p>
            </div>
            <CardContent className="my-0 py-0">
              <div className="flex flex-col gap-4">
                <p className="text-muted-foreground">{dcgData.description}</p>

                <div className="flex gap-2.5">
                  <School className="text-foreground size-5" />
                  <p>
                    {dcgData.modalities.map((modality, index) => (
                      <span key={index}>{modality + ", "}</span>
                    ))}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="text-foreground size-5" />
                  {dcgData.duration}
                </div>
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="text-foreground size-5" /> {""}
                  {dcgData.rncp}
                </div>
                <div className="flex items-center gap-2.5">
                  <BadgeEuro className="text-foreground size-5" /> {dcgData.price}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => router.push(`/dashboard/student/training/${dcgData.id}`)}
              >
                Détails
              </Button>

              <Button size="lg" className="flex-1">
                S'inscrire
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Section d'appel à l'action */}
      <div className="bg-blue-50 rounded-lg p-6 mt-8 text-center">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">Vous hésitez encore ?</h2>
        <p className="text-gray-600 mb-4">
          Nos conseillers pédagogiques sont à votre disposition pour vous aider à choisir la
          formation la plus adaptée à vos objectifs professionnels.
        </p>
        <Button variant="outline" className="border-blue-600 text-blue-600">
          Contactez un conseiller
        </Button>
      </div>
    </div>
  );
}
