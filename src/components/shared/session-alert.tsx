import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CircleFadingArrowUp } from "lucide-react";

export function SessionAlert() {
  return (
    <Alert className="bg-blue-500/10 border-0 border-l-4 border-l-primary rounded mb-4">
      <CircleFadingArrowUp className="h-4 w-4 text-primary" />
      <AlertTitle>Aucune session disponible</AlertTitle>
      <AlertDescription className="text-sm text-muted-foreground">
        Veuillez sélectionner une session ou vous inscrire pour voir les détails.
      </AlertDescription>
    </Alert>
  );
}
