"use client";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResendCodeMutation, useVerifyBeforeResetPasswordMutation } from "@/lib/apis/auth-api";
import { toast } from "react-hot-toast";
import { verifyAccountCodeSchema, verifyAccountCodeValues } from "@/lib/validators/auth-schema";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";

const RESEND_COOLDOWN = 60; // 60 secondes

export function VerifyCodeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") as string;
  const [verifyBeforeResetPassword, { isLoading }] = useVerifyBeforeResetPasswordMutation();
  const [resendCode, { isLoading: isResending }] = useResendCodeMutation();
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const toastRef = useRef<string | null>(null);

  const form = useForm<verifyAccountCodeValues>({
    resolver: zodResolver(verifyAccountCodeSchema),
    mode: "onChange",
    defaultValues: {
      pin: "",
    },
  });

  // Nettoyage et initialisation du timer au chargement
  useEffect(() => {
    // Nettoyer les toasts existants
    toast.dismiss();

    // Réinitialiser le formulaire
    form.reset({ pin: "" });

    // Démarrer le timer de cooldown
    startCountdown();

    // Nettoyage à la destruction du composant
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
      }
    };
  }, [form]);

  const startCountdown = useCallback(() => {
    setCanResend(false);
    setCountdown(RESEND_COOLDOWN);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const isFormValid = form.formState.isValid;

  const handleVerify = async (pin: string) => {
    try {
      // Nettoyer les toasts précédents
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
      }

      toastRef.current = toast.loading("Vérification en cours...");

      const response = await verifyBeforeResetPassword({
        email_user: email,
        verication_code: parseInt(pin),
      }).unwrap();

      toast.dismiss(toastRef.current);
      toastRef.current = null;

      if (response.status === 200) {
        toast.success("Code validé avec succès");
        router.push(`/reset?email=${encodeURIComponent(email)}&pin=${pin}`);
        return;
      }

      toast.error("Erreur inattendue");
    } catch (error: any) {
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
        toastRef.current = null;
      }

      // Gestion d'erreur plus spécifique
      if (error?.status === 400) {
        toast.error("Le code saisi est invalide");
      } else if (error?.status === 404) {
        toast.error("Code non trouvé ou expiré");
      } else if (error?.status === 429) {
        toast.error("Trop de tentatives. Veuillez patienter.");
      } else {
        toast.error("Le code saisi est incorrect ou a expiré");
      }
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;

    try {
      // Nettoyer les toasts précédents
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
      }

      toastRef.current = toast.loading("Envoi en cours...");

      await resendCode({ user_email: email }).unwrap();

      toast.dismiss(toastRef.current);
      toastRef.current = null;

      toast.success(`Un nouveau code a été envoyé à ${email}`);

      // Redémarrer le timer
      startCountdown();

      // Nettoyer le champ PIN
      form.setValue("pin", "");
    } catch (error: any) {
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
        toastRef.current = null;
      }

      if (error?.status === 404) {
        toast.error("Adresse email non trouvée");
      } else if (error?.status === 429) {
        toast.error("Trop de demandes. Veuillez patienter avant de réessayer.");
      } else if (error?.status === 500) {
        toast.error("Erreur serveur. Veuillez réessayer plus tard.");
      } else {
        toast.error("Échec de l'envoi du code");
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Redirection si pas d'email
  useEffect(() => {
    if (!email) {
      toast.error("Email manquant");
      router.push("/forgot-password");
    }
  }, [email, router]);

  if (!email) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-xl font-bold">Vérification de compte</h2>
        <p className="text-sm text-muted-foreground">
          Un code de vérification a été envoyé à <span className="text-primary">{email}</span>.
          Veuillez l&apos;entrer ci-dessous.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => handleVerify(data.pin))} className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="pin">Code de vérification (6 chiffres)</Label>
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP maxLength={6} {...field} className="w-full" disabled={isLoading}>
                      <InputOTPGroup className="flex gap-2 w-full">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className={cn(
                              "flex-1 border border-border h-12 text-lg",
                              !isFormValid &&
                                field.value &&
                                field.value.length === 6 &&
                                "border-red-400"
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

          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            {isLoading ? "Vérification..." : "Vérifier le code"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground mb-2">Vous n&apos;avez pas reçu de code ?</p>

        {canResend ? (
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-primary hover:text-ring hover:underline disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isResending ? "Envoi..." : "Renvoyer le code"}
          </button>
        ) : (
          <p className="text-muted-foreground">
            Renvoyer le code dans{" "}
            <span className="font-medium text-foreground">{formatTime(countdown)}</span>
          </p>
        )}
      </div>
    </div>
  );
}
