"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export default function VerifyCodePage() {
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

  return (
    <div className="max-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <Image src="/kids_studying.svg" alt="kids_studying" width={1000} height={1000} />
          <p className="mt-6 text-blue-700 font-semibold text-lg">
            Accédez à des formations de qualité, où
          </p>
          <p className="mt-6 text-blue-700 font-semibold font-poppins text-lg">que vous soyez.</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-center text-3xl font-extrabold poppins text-[#0353A4]">
            TANTOR–LEARNING
          </h2>
          <h3 className="text-center text-xl font-bold text-[#001845]">
            Entrer le Code de vérification
          </h3>
          <p className="text-center text-[12px] -mt-3.5 text-blue-500">
            Nous avons envoyé un code à votre adresse email
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-10">
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
                            className={`flex-[1] h-[25px] md:h-[60px]  rounded-[8px] ${
                              !isFormValid && field.value && "border-red-400"
                            }`}
                          />
                          <InputOTPSlot
                            index={1}
                            className={`flex-[1] h-[30px] md:h-[60px]  rounded-[8px] ${
                              !isFormValid && field.value && "border-red-400"
                            }`}
                          />
                          <InputOTPSlot
                            index={2}
                            className={`flex-[1] h-[30px] md:h-[60px]  rounded-[8px] ${
                              !isFormValid && field.value && "border-red-400"
                            }`}
                          />
                          <InputOTPSlot
                            index={3}
                            className={`flex-[1] h-[30px] md:h-[60px]  rounded-[8px] ${
                              !isFormValid && field.value && "border-red-400"
                            }`}
                          />
                          <InputOTPSlot
                            index={4}
                            className={`flex-[1] h-[30px] md:h-[60px]  rounded-[8px] ${
                              !isFormValid && field.value && "border-red-400"
                            }`}
                          />
                          <InputOTPSlot
                            index={5}
                            className={`flex-[1] h-[30px] md:h-[60px]  rounded-[8px] ${
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

              <Button
                className="h-10 bg-[#0466C8] rounded-[15px] hover:cursor-pointer hover:bg-[#1E3A8A]"
                type="submit"
                disabled={!isFormValid}
              >
                Sign in
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-gray-500">
            Vous n'avez pas reçu le code ?{" "}
            <a href="#" className="text-blue-600 underline">
              Renvoyer le Code
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
