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
import { Plus } from "lucide-react";
import { CreateCourseForm } from "./create-course-form";
import { useState } from "react";

export function CreateCourse() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="py-3 px-5 bg-primary flex text-white rounded-md cursor-pointer h-fit text-sm justify-center gap-2.5">
        <Plus className="size-4" /> <span>Ajouter un cours</span>
      </DialogTrigger>
      <DialogContent className="!w-full !max-w-3xl pt-12 pb-5 flex flex-col gap-5">
        <DialogHeader className="flex flex-col gap-2.5">
          <DialogTitle className="text-primary text-2xl font-medium">
            Ajouter un nouveau cours
          </DialogTitle>
          <DialogDescription className="text-[#ACACAC]">
            Creer un nouveau cours. Les contenus peuvent etre ajouter apres la creation
          </DialogDescription>
        </DialogHeader>
        <CreateCourseForm onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
