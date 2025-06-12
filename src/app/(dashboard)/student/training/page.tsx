"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BadgeEuro, Clock, GraduationCap, School } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useGetAllTrainingsQuery } from "@/lib/apis/public/public-api";
import { Loading } from "@/components/shared/loading";

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

export default function Page() {
  const router = useRouter();
  const { data, isLoading } = useGetAllTrainingsQuery();
  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data.list.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.Formation.titre}</CardTitle>
              <CardDescription>{item.Formation.sous_titre}</CardDescription>
            </CardHeader>
            <CardContent>
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
          </Card>
        ))}
      </div>
    </div>
  );
}
