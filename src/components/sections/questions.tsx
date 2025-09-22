"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TrainingLayout } from "../layout/training-layout";

export default function Questions() {
  const router = useRouter();
  const [diplome, setDiplome] = useState("");
  const [situation, setSituation] = useState("");
  const [experience, setExperience] = useState("");

  const handleNext = () => {
    if (!diplome || !situation || !experience) {
      alert("Veuillez répondre à toutes les questions");
      return;
    }
    router.push("/trainings/id/documents");
  };

  return (
    <TrainingLayout>
      <Card className="border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Questionnaire d'évaluation
          </CardTitle>
          <p className="text-muted-foreground text-center">
            Aidez-nous à mieux comprendre votre profil
          </p>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-8">
          {/* Question 1 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Avez-vous un diplôme ?</h3>
            <RadioGroup value={diplome} onValueChange={setDiplome} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oui" id="diplome-oui" />
                <Label htmlFor="diplome-oui">Oui, j'ai obtenu un diplôme</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non" id="diplome-non" />
                <Label htmlFor="diplome-non">Non, je n'ai pas de diplôme</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Question 2 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Quelle est votre situation professionnelle actuelle ?
            </h3>
            <RadioGroup value={situation} onValueChange={setSituation} className="grid gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="employe" id="situation-employe" />
                <Label htmlFor="situation-employe">Employé(e)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="chomage" id="situation-chomage" />
                <Label htmlFor="situation-chomage">En recherche d'emploi</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="etudiant" id="situation-etudiant" />
                <Label htmlFor="situation-etudiant">Étudiant(e)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="independant" id="situation-independant" />
                <Label htmlFor="situation-independant">Travailleur indépendant</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Question 3 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Quel est votre niveau d'expérience dans ce domaine ?
            </h3>
            <RadioGroup
              value={experience}
              onValueChange={setExperience}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2 rounded-md border p-4">
                <RadioGroupItem value="debutant" id="exp-debutant" />
                <Label htmlFor="exp-debutant" className="cursor-pointer w-full">
                  <div>
                    <div className="font-medium">Débutant</div>
                    <div className="text-sm text-muted-foreground">Moins de 1 an</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 rounded-md border p-4">
                <RadioGroupItem value="intermediaire" id="exp-intermediaire" />
                <Label htmlFor="exp-intermediaire" className="cursor-pointer w-full">
                  <div>
                    <div className="font-medium">Intermédiaire</div>
                    <div className="text-sm text-muted-foreground">1-3 ans</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 rounded-md border p-4">
                <RadioGroupItem value="avance" id="exp-avance" />
                <Label htmlFor="exp-avance" className="cursor-pointer w-full">
                  <div>
                    <div className="font-medium">Avancé</div>
                    <div className="text-sm text-muted-foreground">Plus de 3 ans</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => router.push("/trainings/id/documents")}
            className="w-full"
            size="lg"
          >
            Continuer
          </Button>
        </CardFooter>
      </Card>
    </TrainingLayout>
  );
}
