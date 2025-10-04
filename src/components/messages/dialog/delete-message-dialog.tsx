"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { useDeleteChatMutation } from "@/lib/apis/common/chat-api";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export function DeleteMessageDialog({ id }: { id: string }) {
  const router = useRouter();
  const [deleteMessage, { isLoading: isLoadingDelete }] = useDeleteChatMutation();
  const handleDeleteMessage = async () => {
    try {
      await deleteMessage({ id: id }).unwrap();
      router.back();
      toast("Message supprimé");
    } catch {
      toast.error("Erreur lors de suppression du message");
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          {" "}
          <Trash /> Supprimer
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>Voulez-vous supprimer ce message ?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteMessage}>
            {!isLoadingDelete ? "Supprimer" : <Loader2 className="animate-spin text-white" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
