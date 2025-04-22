"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { buttonVariants } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";

export function Reset({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    // Your custom logic or function
    console.log("Function executed before showing dialog");

    // Then open the dialog
    setOpen(true);
  };
  return (
    <>
      <form className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Réinitialiser votre mot de passe</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Veuillez entrer votre nouveau mot de passe ci-dessous.
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input
              id="email"
              type="password"
              placeholder="Entrez votre nouveau mot de passe"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Confirmer le mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="Confirmez votre nouveau mot de passe"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-blue-500" onClick={handleClick}>
            Réinitialiser le mot de passe
          </Button>
        </div>
      </form>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center justify-center">
              <BadgeCheck className="text-blue-500" size={50} />
            </div>
            <AlertDialogTitle className="font-bold text-center">Succès !</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Votre mot de passe a été réinitialisé avec succès.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-1 gap-4">
            <AlertDialogAction
              onClick={() => console.log("Confirmed")}
              className="bg-blue-500 w-full"
            >
              Aller au tableau de bord
            </AlertDialogAction>
            <AlertDialogCancel onClick={() => setOpen(false)} className={"border-none shadow-none"}>
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
