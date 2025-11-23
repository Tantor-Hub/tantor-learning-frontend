"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResendCodeMutation, useVerifyPasswordLessMutation } from "@/lib/apis/auth-api";
import { toast } from "react-hot-toast";
import { verifyAccountCodeSchema, verifyAccountCodeValues } from "@/lib/validators/auth-schema";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/auth-slice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const RESEND_COOLDOWN = 60; // 60 secondes

export function VerifyAccountForm() {
  const router = useRouter();
  const [isLoadingPending, setIsLoadingPending] = useState(false);
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const email = searchParams.get("email") as string;
  const [resendCode, { isLoading: isResending }] = useResendCodeMutation();
  const [verifyAccount, { isLoading }] = useVerifyPasswordLessMutation();
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const [verifyError, setVerifyError] = useState<string>("");
  const [resendError, setResendError] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<verifyAccountCodeValues>({
    resolver: zodResolver(verifyAccountCodeSchema),
    mode: "onChange",
    defaultValues: {
      pin: "",
    },
  });

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

  // Nettoyage et initialisation du timer au chargement
  useEffect(() => {
    // Réinitialiser le formulaire
    form.reset({ pin: "" });

    // Démarrer le timer de cooldown
    startCountdown();

    // Nettoyage à la destruction du composant
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [form, startCountdown]);

  const isFormValid = form.formState.isValid;

  const handleVerify = async (pin: string) => {
    try {
      setIsLoadingPending(true);
      setVerifyError("");

      const response = await verifyAccount({
        email: email,
        otp: String(pin),
      }).unwrap();

      dispatch(
        setCredentials({
          token: response.data.auth_token,
          refreshToken: response.data.refresh_token,
          expiresIn: 3600,
          user: response.data.user,
        })
      );

      toast.success(response.message);
      router.replace(`/${response.data.user.role}`);
    } catch (error: any) {
      // Gestion d'erreur plus spécifique
      let errorMessage = "Erreur lors de la vérification";

      if (error?.status === 400) {
        errorMessage = "Le code saisi est invalide";
      } else if (error?.status === 404) {
        errorMessage = "Code non trouvé ou expiré";
      } else if (error?.status === 429) {
        errorMessage = "Trop de tentatives. Veuillez patienter.";
      } else if (error?.data?.data) {
        errorMessage = error.data.data;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      setVerifyError(errorMessage);
    } finally {
      setIsLoadingPending(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;

    try {
      setResendError("");
      setVerifyError("");

      await resendCode({ user_email: email }).unwrap();

      toast.success(`Un nouveau code a été envoyé à ${email}`);

      // Redémarrer le timer
      startCountdown();

      // Nettoyer le champ PIN
      form.setValue("pin", "");
    } catch (error: any) {
      let errorMessage = "Erreur lors de l'envoi du code";

      if (error?.status === 404) {
        errorMessage = "Adresse email non trouvée";
      } else if (error?.status === 429) {
        errorMessage = "Trop de demandes. Veuillez patienter avant de réessayer.";
      } else if (error?.status === 500) {
        errorMessage = "Erreur serveur. Veuillez réessayer plus tard.";
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      setResendError(errorMessage);
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
      router.push("/register");
    }
  }, [email, router]);

  if (!email) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-xl font-semibold">Vérifiez votre e-mail</h2>
        <p className="text-sm text-muted-foreground">pour continuer vers Tantor Learning</p>
        <p className="text-sm text-primary">{email}</p>
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
                    <InputOTP
                      maxLength={6}
                      {...field}
                      className="w-full"
                      disabled={isLoading}
                      onChange={(value) => {
                        field.onChange(value);
                        setVerifyError("");
                      }}
                    >
                      <InputOTPGroup className="flex gap-2 w-full">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className={cn(
                              "flex-1 border border-border h-12 text-lg",
                              verifyError && "border-red-500",
                              !isFormValid &&
                                field.value &&
                                field.value.length === 6 &&
                                !verifyError &&
                                "border-red-400"
                            )}
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  {verifyError && <p className="text-sm font-medium text-red-500">{verifyError}</p>}
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
            {isLoading || isLoadingPending ? (
              <Loader2 className="animate-spin text-white" />
            ) : (
              "Continuer"
            )}
          </Button>
        </form>
        <Button
          variant="outline"
          className="border-primary text-primary"
          onClick={() => router.push("/signin")}
        >
          Utiliser une autre méthode
        </Button>
      </Form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground mb-2">Vous n&apos;avez pas reçu de code ?</p>

        {canResend ? (
          <>
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-primary hover:text-ring hover:underline disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isResending ? "Envoi..." : "Renvoyer le code"}
            </button>
            {resendError && <p className="text-sm font-medium text-red-500 mt-2">{resendError}</p>}
          </>
        ) : (
          <p className="text-muted-foreground">
            Renvoyer le code dans{" "}
            <span className="font-medium text-foreground">{formatTime(countdown)}</span>
          </p>
        )}
      </div>

      <div className="text-center text-xs text-muted-foreground">
        <p>
          En vérifiant votre compte, vous acceptez nos{" "}
          <Link href="/legales?tab=cgu" target="_blank" className="text-primary hover:underline">
            conditions d&apos;utilisation
          </Link>{" "}
          et notre{" "}
          <Link href="/legales?tab=donnees" className="text-primary hover:underline">
            politique de confidentialité
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
