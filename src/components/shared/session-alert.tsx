import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CircleFadingArrowUp, AlertTriangle } from "lucide-react";

interface SessionAlertProps {
  variant?: "default" | "warning";
  status?: number;
  message?: string;
}

export function SessionAlert({ variant = "default", status, message }: SessionAlertProps) {
  if (variant === "warning") {
    return (
      <Alert className="bg-yellow-500/10 border-0 border-l-4 border-l-yellow-500 rounded mb-4">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <AlertTitle>Status: {status}</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">{message}</AlertDescription>
      </Alert>
    );
  }

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
