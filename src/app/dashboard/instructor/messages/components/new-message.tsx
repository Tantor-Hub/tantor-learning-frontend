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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Paperclip, Plus } from "lucide-react";

export function NewMessageAlert() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg">
          <Plus /> Nouveau Message
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Nouveau Message</AlertDialogTitle>
          <AlertDialogDescription>
            Ce message sera visible par tous les étudiants, formateurs, administrateurs et
            secrétaires.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="subject">Sujet</Label>
          <Input id="subject" placeholder="Entrez le sujet" />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" placeholder="Écrivez votre message ici..." />
        </div>
        <Button
          variant="ghost"
          className="space-x-2 flex justify-start items-center hover:cursor-pointer"
        >
          <Paperclip size={16} /> <span>Attachez une pièce jointe</span>
        </Button>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:cursor-pointer">Annuler</AlertDialogCancel>
          <AlertDialogAction className="hover:cursor-pointer">Envoyer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
