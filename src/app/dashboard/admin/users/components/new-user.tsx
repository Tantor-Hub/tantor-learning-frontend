"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import NewUserForm from "./new-user-form";

const NewUser = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="py-3 px-5 bg-[#0466C8] flex text-white rounded-md cursor-pointer h-fit text-sm justify-center gap-2.5">
        <Plus className="size-4" /> <span>Ajouter un utilisateur</span>
      </DialogTrigger>
      <DialogContent className="!w-full !max-w-3xl pt-12 pb-5 flex flex-col gap-5">
        <DialogHeader className="flex flex-col gap-2.5">
          <DialogTitle className="text-[#0466C8] text-2xl font-medium">
            Ajouter un nouvel utilisateur
          </DialogTitle>
          <DialogDescription className="text-[#ACACAC]">
            Créér un nouvel utilisateur
          </DialogDescription>
        </DialogHeader>
        <NewUserForm onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
export default NewUser;
