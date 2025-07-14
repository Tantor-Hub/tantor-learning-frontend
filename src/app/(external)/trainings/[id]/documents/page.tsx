"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TrainingLayout } from "../../training-layout";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  const router = useRouter();
  const [step, setStep] = useState<"documents" | "generated">("documents");
  const [documents, setDocuments] = useState({
    idCard: false,
    cv: false,
    diploma: false,
    photo: false,
    motivation: false,
    references: false,
  });

  const handleFileUpload = (docType: keyof typeof documents) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setDocuments((prev) => ({
        ...prev,
        [docType]: !!e.target.files?.length,
      }));
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("generated");
  };

  const handlePrevious = () => {
    // Navigation vers la page précédente
    router.back();
  };

  const isFormValid = () => {
    return Object.values(documents).every((uploaded) => uploaded);
  };

  const requiredDocuments = [
    {
      id: "idCard",
      label: "Pièce d'identité",
      accept: ".pdf,.jpg,.jpeg,.png",
      description: "Carte d'identité, passeport ou permis de conduire",
      icon: "👤",
      required: true,
    },
    {
      id: "cv",
      label: "Curriculum Vitae",
      accept: ".pdf,.doc,.docx",
      description: "CV détaillé avec expériences et formations",
      icon: "📄",
      required: true,
    },
    {
      id: "diploma",
      label: "Diplômes et Certificats",
      accept: ".pdf,.jpg,.jpeg,.png",
      description: "Diplômes les plus récents ou certificats professionnels",
      icon: "🎓",
      required: true,
    },
    {
      id: "photo",
      label: "Photo d'identité",
      accept: ".jpg,.jpeg,.png",
      description: "Photo récente format identité (fond blanc de préférence)",
      icon: "📸",
      required: true,
    },
    {
      id: "motivation",
      label: "Lettre de motivation",
      accept: ".pdf,.doc,.docx",
      description: "Lettre expliquant votre intérêt pour la formation",
      icon: "✍️",
      required: true,
    },
    {
      id: "references",
      label: "Références professionnelles",
      accept: ".pdf,.doc,.docx",
      description: "Contacts de références ou lettres de recommandation",
      icon: "📋",
      required: false,
    },
  ];

  return (
    <TrainingLayout>
      {step === "documents" ? (
        <Card className="border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Documents requis pour l'inscription
            </CardTitle>
            <p className="text-muted-foreground">
              Veuillez téléverser tous les documents nécessaires pour finaliser votre inscription
            </p>
          </CardHeader>
          <Separator />
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Documents grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {requiredDocuments.map((doc) => (
                  <div key={doc.id} className="relative">
                    <Card
                      className={`transition-all duration-200 border ${
                        documents[doc.id as keyof typeof documents]
                          ? "border-green-300 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="text-3xl">{doc.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Label
                                htmlFor={doc.id}
                                className="text-lg font-semibold text-gray-900"
                              >
                                {doc.label}
                              </Label>
                              {doc.required && <span className="text-red-500 text-sm">*</span>}
                            </div>
                            <p className="text-sm text-gray-600 mb-4">{doc.description}</p>

                            <div className="space-y-2">
                              <Input
                                id={doc.id}
                                type="file"
                                accept={doc.accept}
                                onChange={handleFileUpload(doc.id as keyof typeof documents)}
                                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
                              <p className="text-xs text-gray-500">
                                Formats acceptés: {doc.accept.replace(/\./g, "").toUpperCase()} •
                                Max 5MB
                              </p>
                            </div>
                          </div>
                        </div>

                        {documents[doc.id as keyof typeof documents] && (
                          <div className="absolute top-4 right-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                              <svg
                                className="w-5 h-5 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center pt-6">
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  <ArrowLeft />
                  Précédent
                </Button>

                <Button type="submit" disabled={!isFormValid()}>
                  Continuer
                  <ArrowRight />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border">
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="m9 11 3 3L22 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Votre document d'inscription est prêt
              </h3>
              <p className="text-green-700">
                Nous avons généré automatiquement votre contrat d'inscription basé sur les
                informations et documents fournis.
              </p>
            </div>

            {/* <div className="space-y-3">
              <Button variant="outline" className="w-full h-12 text-lg">
                <Download />
                Télécharger le contrat
              </Button>
            </div> */}

            {/* Navigation buttons */}
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => setStep("documents")}>
                <ArrowLeft />
                Précédent
              </Button>

              <Button onClick={() => router.push("/trainings/id/signature")}>
                Continuer
                <ArrowRight />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </TrainingLayout>
  );
}
