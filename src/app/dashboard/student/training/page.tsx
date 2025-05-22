import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeEuro, Clock, GraduationCap, School } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

// FAKE DATA

const dcgData = {
  title: "Diplôme de Comptabilité et de Gestion (DCG)",
  category: "Comptabilité et Finance",
  level: "Bac+3",
  description:
    "Le Diplôme de Comptabilité et de Gestion (DCG) est un diplôme d’État de niveau licence (Bac+3)...",
  modalities: ["Alternance", "En ligne", "À la carte"],
  duration: "3 ans",
  rncp: "RNCP35526",
  price: "À partir de 199€",
};

const dcgArray = Array.from({ length: 8 }, () => ({ ...dcgData }));

export default function Page() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dcgArray.map((dcgData, index) => (
          <Link key={index} href={"#"}>
            <Card className="border border-[#007AFF26] shadow-sm mt-0 pt-0 overflow-hidden">
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
              <CardFooter>
                <Button size="lg" className="w-full">
                  S'inscire
                  <ArrowRight />
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
