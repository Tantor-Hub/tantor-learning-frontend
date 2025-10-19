"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { AddCourseForm } from "./add-course-form";
import { useState } from "react";

interface AddCourseModalProps {
  sessionId: string;
  onCourseAdded?: () => void;
}

export function AddCourseModal({ sessionId, onCourseAdded }: AddCourseModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={isLoading}>
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          {isLoading ? "Ajout en cours..." : "Ajouter une Matière"}
        </Button>
      </DialogTrigger>
      <DialogContent className="!w-full !max-w-3xl pt-12 pb-5 flex flex-col gap-5">
        <DialogHeader className="flex flex-col gap-2.5">
          <DialogTitle className="text-primary text-2xl font-medium">
            Ajout d’une nouvelle matière
          </DialogTitle>
          <DialogDescription className="text-[#ACACAC]">
            Creer une nouvelle matière. Les contenus peuvent etre ajouter apres la creation
          </DialogDescription>
        </DialogHeader>
        <AddCourseForm
          onCancel={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            onCourseAdded?.();
          }}
          sessionId={sessionId}
          setIsLoading={setIsLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
