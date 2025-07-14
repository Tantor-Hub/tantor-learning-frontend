"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { TrainingLayout } from "../../training-layout";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  const router = useRouter();
  return (
    <TrainingLayout>
      <Card className="border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Signature du contrat de formation</CardTitle>
          <p className="text-gray-600 mt-2">
            Finalisez votre inscription en signant électroniquement votre contrat
          </p>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Conditions générales</h2>
            <p className="text-sm text-muted-foreground">
              Veuillez lire attentivement les conditions générales avant de continuer :
            </p>

            <ScrollArea className="h-64 rounded-md border p-4">
              <div className="space-y-4">
                <h3 className="font-medium">Conditions de participation</h3>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget
                  ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
                </p>
                <p className="text-sm">
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                  minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                  commodo consequat.
                </p>

                <h3 className="font-medium">Engagements</h3>
                <p className="text-sm">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                  fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                  culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </ScrollArea>

            <div className="flex items-start space-x-2 pt-4">
              <Checkbox id="conditions" required />
              <Label htmlFor="conditions" className="font-normal leading-snug">
                Je reconnais avoir lu et accepté les conditions générales de participation et
                m'engage à poursuivre la formation dans les règles établies.
              </Label>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              Retour
            </Button>
            <Button onClick={() => router.push("/trainings/id/payment")}>
              Signer et continuer
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2"
              >
                <path d="M12 19V5" />
                <path d="m5 12 7 7 7-7" />
              </svg>
            </Button>
          </div>
        </CardContent>
      </Card>
    </TrainingLayout>
  );
}
