import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IStudentEvaluation } from "@/types/student-evaluations";

interface ConfirmDialogProps {
  showConfirmDialog: boolean;
  setShowConfirmDialog?: (open: boolean) => void;
  selectedEvaluation: IStudentEvaluation | null;
  hasExistingAnswers: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  showConfirmDialog,
  setShowConfirmDialog,
  selectedEvaluation,
  hasExistingAnswers,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog || (() => {})}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Démarrer {selectedEvaluation?.type} ?</AlertDialogTitle>
          <AlertDialogDescription>
            Vous êtes sur le point de commencer l'évaluation {selectedEvaluation?.title}.
            {hasExistingAnswers
              ? " Vous avez déjà terminé cette évaluation."
              : " Assurez-vous d'avoir suffisamment de temps pour la terminer."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={hasExistingAnswers}>
            Démarrer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
