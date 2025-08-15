"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { GoogleIcon } from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignupMutation, useAuthWithGoogleMutation } from "@/lib/apis/auth-api";
import { ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { signUpSchema, SignUpFormValues } from "@/lib/validators/auth-schema";

export function SignUpForm() {
  const router = useRouter();
  const [emailSignup, { isLoading: isEmailLoading }] = useSignupMutation();
  const [googleSignup, { isLoading: isGoogleLoading, error: googleError }] =
    useAuthWithGoogleMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  async function onSubmit(values: SignUpFormValues) {
    try {
      const loadingToast = toast.loading("Inscription en cours...");
      const response = await emailSignup({
        fs_name: values.fullName.split(" ")[0],
        ls_name: values.fullName.split(" ")[1] || values.fullName.split(" ")[0],
        password: values.password,
        nick_name: values.fullName.split(" ")[0].toLowerCase(),
        email: values.email,
      }).unwrap();

      toast.dismiss(loadingToast);
      toast.success(response.data.message || "Compte créé avec succès!");
      router.push(`/verify-account?email=${encodeURIComponent(values.email)}`);
    } catch (error: any) {
      toast.dismiss();
      const errorMessage = error?.data?.data || "Erreur lors de l'inscription";
      toast.error(errorMessage);
    }
  }

  const signInWithGoogle = async () => {
    try {
      const loadingToast = toast.loading("Connexion avec Google en cours...");
      window.location.href = "https://tantor-learning.up.railway.app/api/users/user/authwithgoogle";
      // const result = await googleSignup().unwrap();

      toast.dismiss(loadingToast);
      toast.success("Redirection vers Google...");
    } catch (error) {
      toast.dismiss();
      toast.error("Échec de la connexion avec Google");
      console.error("Google signup error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 text-center">
        <h1 className="text-xl font-semibold md:font-bold">S'inscrire</h1>
        <p className="text-sm text-muted-foreground">
          Inscrivez-vous en remplissant les informations ci-dessous
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="fullName">Nom Complet</FormLabel>
                <FormControl>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Jean Dupont"
                    className="py-5"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jeandupont@gmail.com"
                    className="py-5"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="password">Mot de passe</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10 py-5"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-primary"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="confirmPassword">Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      placeholder="••••••••"
                      type={showConfirmPassword ? "text" : "password"}
                      className="pr-10 py-5 text-sm md:text-base"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-primary"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <div className="flex items-center">
                    <FormLabel htmlFor="terms">
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-5 w-5 text-primary rounded mt-1"
                      />
                    </FormLabel>
                    <p className="text-sm ml-2">
                      J'accepte{" "}
                      <Link href="/" className="text-primary hover:underline">
                        les termes
                      </Link>{" "}
                      et{" "}
                      <Link href="/" className="text-primary hover:underline">
                        les conditions
                      </Link>
                    </p>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isEmailLoading || !form.formState.isValid}
          >
            {isEmailLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                S'inscrire <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Form>

      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">OU</span>
      </div>

      {/* Google Sign Up Button - Outside of form */}
      <Button
        variant="outline"
        className="w-full border-primary"
        onClick={signInWithGoogle}
        disabled={isGoogleLoading}
        type="button"
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="mr-2" />
        )}
        S'inscrire avec Google
      </Button>

      <div className="text-center text-sm">
        Avez-vous déjà un compte?{" "}
        <Link href="/signin" className="text-primary hover:underline">
          Connectez-vous ici
        </Link>
      </div>
    </div>
  );
}
