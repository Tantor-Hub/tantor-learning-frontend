"use client";
import Image from "next/image";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function VerifyAccount({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const formSchema = z
    .object({
      pin: z.string().min(6, { message: "OTP code must 6 letters" }),
    })
    .refine((data) => data.pin == "123456", {
      message: "Invalid OTP code, Please try again.",
      path: ["pin"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const isFormValid = form.formState.isValid;

  const handleSubmit = () => {
    router.push("/success");
  };

  // h-[25px] md:h-[60px]  rounded-[8px]
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-bold">Vérification de compte</h2>
        <p className="text-balance text-sm text-muted-foreground">
          Un code de vérification a été envoyé à votre adresse email. Veuillez l'entrer ci-dessous.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Code de vérification (OTP)</Label>
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP maxLength={6} {...field} className="w-full">
                      <InputOTPGroup className="flex gap-2 w-full">
                        <InputOTPSlot
                          index={0}
                          className={`flex-[1] border border-border ${
                            !isFormValid && field.value && "border-red-400"
                          }`}
                        />
                        <InputOTPSlot
                          index={1}
                          className={`flex-[1] border border-border ${
                            !isFormValid && field.value && "border-red-400"
                          }`}
                        />
                        <InputOTPSlot
                          index={2}
                          className={`flex-[1] border border-border ${
                            !isFormValid && field.value && "border-red-400"
                          }`}
                        />
                        <InputOTPSlot
                          index={3}
                          className={`flex-[1] border border-border ${
                            !isFormValid && field.value && "border-red-400"
                          }`}
                        />
                        <InputOTPSlot
                          index={4}
                          className={`flex-[1] border border-border ${
                            !isFormValid && field.value && "border-red-400"
                          }`}
                        />
                        <InputOTPSlot
                          index={5}
                          className={`flex-[1] border border-border ${
                            !isFormValid && field.value && "border-red-400"
                          }`}
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={!isFormValid} className="w-full bg-blue-500">
            Vérifier le compte
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        <p>
          Vous n'avez pas reçu de code?{" "}
          <a href="#" className="text-blue-500 hover:underline" id="resendLink">
            Renvoyer le code
          </a>
        </p>
      </div>
    </div>
  );
}
