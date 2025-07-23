"use client";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResendCodeMutation, useVerifyBeforeResetPasswordMutation } from "@/lib/apis/auth-api";
import { toast } from "react-hot-toast";
import { verifyAccountSchema, verifyAccountValues } from "@/lib/validators/verify-account-schema";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export function VerifyCode() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") as string;
  const [verifyBeforeResetPassword, { isLoading }] = useVerifyBeforeResetPasswordMutation();
  const [resendCode, { error }] = useResendCodeMutation();
  const form = useForm<verifyAccountValues>({
    resolver: zodResolver(verifyAccountSchema),
    mode: "onChange",
    defaultValues: {
      pin: "",
    },
  });

  const isFormValid = form.formState.isValid;
  const handleVerify = async (pin: string) => {
    try {
      const loadingToast = toast.loading("Vérification en cours...");

      const response = await verifyBeforeResetPassword({
        email_user: email,
        verication_code: parseInt(pin),
      }).unwrap();

      toast.dismiss(loadingToast);

      if (response.status === 200) {
        toast.success("Code validé avec succès");
        router.push(`/reset?email=${encodeURIComponent(email)}&pin=${pin}`);
        return;
      }

      // Cas où le statut n'est pas 200
      toast.error("Erreur inattendue");
    } catch (error) {
      toast.dismiss();
      toast.error("Le code saisi est incorrect ou a expiré");
    }
  };

  const handleResend = async () => {
    try {
      const loadingToast = toast.loading("Envoi en cours...");

      await resendCode({ user_email: email }).unwrap();

      toast.dismiss(loadingToast);

      toast.success(`Un code de vérification a été renvoyé à ${email}`);
    } catch (error: any) {
      toast.dismiss();

      if (error?.status === 404) {
        toast.error("Email non trouvé");
      } else if (error?.status === 429) {
        toast.error("Trop de demandes");
      } else if (error?.status === 500) {
        toast.error("Erreur serveur");
      } else {
        toast.error("Échec de l'envoi");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-bold">Vérification de compte</h2>
        <p className="text-balance text-sm text-muted-foreground">
          Un code de vérification a été envoyé à votre adresse email. Veuillez l&apos;entrer
          ci-dessous.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => handleVerify(data.pin))} className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="pin">Code de vérification (OTP)</Label>
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP maxLength={6} {...field} className="w-full">
                      <InputOTPGroup className="flex gap-2 w-full">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className={cn(
                              "flex-1 border border-border",
                              !isFormValid && field.value && "border-red-400"
                            )}
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={!isFormValid || isLoading} className="w-full bg-blue-500">
            {isLoading ? "Vérification..." : "Vérifier le compte"}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        <p>
          Vous n&apos;avez pas reçu de code?{" "}
          <span
            onClick={handleResend}
            className="text-blue-500 hover:underline hover:cursor-pointer"
          >
            Renvoyer le code
          </span>
        </p>
      </div>
    </div>
  );
}
