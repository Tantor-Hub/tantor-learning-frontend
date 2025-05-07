"use client";
import { useState, ChangeEvent } from "react";
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
import { BadgeCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "@/lib/apis/auth-api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface FormData {
  password: string;
  confirm: string;
}

export function Reset() {
  const router = useRouter();
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [open, setOpen] = useState(false);
  const email = searchParams.get("email") as string;
  const pin = searchParams.get("pin") as string;
  const [formData, setFormData] = useState<FormData>({
    confirm: "",
    password: "",
  });
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleClick = async () => {
    try {
      if (formData.password !== formData.confirm) {
        toast.warning("Les mots de passe ne correspondent pas");
        return;
      }
      await resetPassword({
        user_name: email,
        verification_code: pin,
        new_password: formData.password,
        repet_new_password: formData.confirm,
      });
      if (!error) {
        toast.success("Mot de passe réinitialisé avec succès");
        setOpen(true);
      }
    } catch {
      toast.error("Échec! Une erreur s'est produite");
    }
  };

  return (
    <>
      <form className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Réinitialiser votre mot de passe</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Veuillez entrer votre nouveau mot de passe ci-dessous.
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nouveau Mot de Passe"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-primary"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.547-4.2M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1l11.8 11.8"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Confirmer le mot de passe</Label>
            <div className="relative">
              <Input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                value={formData.confirm}
                onChange={handleInputChange}
                placeholder="Confirmez le mot de passe"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-primary"
                tabIndex={-1}
              >
                {showConfirm ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.547-4.2M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1l11.8 11.8"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" onClick={handleClick} disabled={isLoading}>
            {isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
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
              onClick={() => router.push("/dashboard/student")}
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
