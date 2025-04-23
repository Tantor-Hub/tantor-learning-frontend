"use client";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResendCodeMutation, useVerifyMutation } from "@/lib/api";
import { toast } from "sonner";
import { verifyAccountSchema, verifyAccountValues } from "@/lib/validators/verify-account-schema";
import { getDecodedEmail } from "@/lib/get-decoded-email";

interface VerifyAccountProps {
  email?: string | string[];
  className?: string;
}

export function VerifyAccount({ email, className }: VerifyAccountProps) {
  const [resendCode, { isLoading }] = useResendCodeMutation();
  const [verifyAccount, { isLoading: isVerifying }] = useVerifyMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const decodedEmail = getDecodedEmail(email);
  const form = useForm<verifyAccountValues>({
    resolver: zodResolver(verifyAccountSchema),
    mode: "onChange",
    defaultValues: {
      pin: "",
    },
  });

  const isFormValid = form.formState.isValid;

  const handleVerify = async (pin: string) => {
    setIsSubmitting(true);
    const result = await verifyAccount({ user_email: decodedEmail, verication_code: pin }).unwrap();
    // Example verification logic
    console.log("Verifying OTP:", pin);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      console.log("Verification complete for pin:", pin);
    }, 1000);
  };

  const handleResend = async () => {
    try {
      const result = await resendCode({ user_email: decodedEmail }).unwrap();
      console.log(result);
      console.log("Code de vérification renvoyé à l'email:", decodedEmail);
    } catch (error) {
      toast.error("Erreur lors de l'envoi du code de vérification");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
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
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full bg-blue-500"
          >
            {isSubmitting ? "Vérification..." : "Vérifier le compte"}
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
