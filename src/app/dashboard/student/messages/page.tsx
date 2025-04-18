import { Button } from "@/components/ui/button";
import { Plus, Paperclip } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCard } from "./components/message-card";
import { Textarea } from "@/components/ui/textarea";
import { messages } from "./data";

export default function Page() {
  return (
    <div className="bg-white p-4">
      <div className="flex items-center justify-between">
        <p>1 message(s) non lu</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="bg-blue-500">
              <Plus /> Nouveau Message
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Sujet</Label>
              <Input id="name" placeholder="" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Message</Label>
              <Textarea id="name" placeholder="Ecrivez votre message ici..." />
            </div>
            <Button
              variant="ghost"
              className="space-x-2 flex justify-start items-center hover:cursor-pointer"
            >
              <Paperclip size={16} /> <span>Attachez une piece jointe</span>
            </Button>
            <AlertDialogFooter>
              <AlertDialogCancel className="hover:cursor-pointer">Annuler</AlertDialogCancel>
              <AlertDialogAction className="hover:cursor-pointer">Envoyer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="my-4 grid grid-cols-1 gap-4">
        {messages.map((msg) => (
          <MessageCard
            key={msg.id}
            name={msg.name}
            role={msg.role}
            title={msg.title}
            message={msg.message}
            isRead={msg.isRead}
          />
        ))}
      </div>
    </div>
  );
}
