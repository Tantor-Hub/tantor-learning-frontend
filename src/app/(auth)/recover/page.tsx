"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/lib/apis/auth-api";

interface FormData {
  email: string;
}

export default function ResetPasswordPage() {
  const [forgottenPassword, { isLoading, error }] = useForgotPasswordMutation();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: "",
  });

  // Email validation function
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await forgottenPassword({
        user_email: formData.email,
      });
      router.push(`/verify-code?email=${encodeURIComponent(formData.email)}`);
      toast.success("Un email a été envoyé à votre adresse");
      return;
    } catch {
      toast.error("Echec! Une erreur s'est produite");
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Mot de passe oublié</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Entrez votre adresse e-mail pour réinitialiser votre compte
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="sofia@gmail.com"
            required
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !isValidEmail(formData.email)}
        >
          {isLoading ? "En cours..." : "Continuer"}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">OU</span>
        </div>
        <Link href="/signin" className={`${buttonVariants({ variant: "outline" })} w-full`}>
          Annuler
        </Link>
      </div>
    </form>
  );
}
