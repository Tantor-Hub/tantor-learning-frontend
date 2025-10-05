"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewEventForm } from "./new-event-form";
import { useState } from "react";

export function NewEvent() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Emploi du Temps
        </Button>
      </DialogTrigger>
      <DialogContent className="!w-full !max-w-3xl pt-12 pb-5 flex flex-col gap-5">
        <DialogHeader className="flex flex-col gap-2.5">
          <DialogTitle className="text-2xl font-medium">Ajouter un nouvel évènement</DialogTitle>
          <DialogDescription className="text-[#ACACAC]">
            Créér un nouvel évènement dans votre planning ou pour votre classe
          </DialogDescription>
        </DialogHeader>
        <NewEventForm onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
