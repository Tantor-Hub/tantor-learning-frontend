"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GoogleIcon } from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/auth-slice";
import { useAuthWithGoogleMutation, useSigninMutation } from "@/lib/apis/auth-api";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { signInSchema, SignInFormValues } from "@/lib/validators/auth-schema";

export function SignInForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const [signin, { isLoading: isSignInLoading }] = useSigninMutation();
  const [triggerGoogleAuth, { isLoading: isGoogleAuthLoading }] = useAuthWithGoogleMutation();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: SignInFormValues) => {
    const loadingToast = toast.loading("Connexion en cours...");

    try {
      const response = await signin({
        user_name: values.email,
        password: values.password,
      }).unwrap();

      dispatch(
        setCredentials({
          token: response.data.auth_token,
          refreshToken: response.data.refresh_token,
          expiresIn: response.expires_in,
          user: response.data.user,
        })
      );

      toast.dismiss(loadingToast);
      toast.success("Connexion réussie!");
      router.back();
    } catch (error: any) {
      toast.dismiss(loadingToast);
      const errorMessage =
        error.data?.data || "Échec de la connexion. Veuillez vérifier vos identifiants.";
      toast.error(errorMessage);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const loadingToast = toast.loading("Connexion avec Google en cours...");

      const w = 500;
      const h = 600;
      const left = (window.innerWidth - w) / 2;
      const top = (window.innerHeight - h) / 2;
      const url = "https://tantor-learning.up.railway.app/api/users/user/authwithgoogle";

      window.open(
        url,
        "Google Auth",
        `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`
      );

      toast.dismiss(loadingToast);
      toast.success("Fenêtre d'authentification Google ouverte");

      // TODO: Handle the response from the popup window
      // You'll need to implement a message listener for window.postMessage
    } catch (error) {
      toast.error("Échec de la connexion avec Google");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4 text-center">
        <h1 className="text-xl font-semibold">Se connecter</h1>
        <p className="text-sm text-muted-foreground">
          Entrez votre email ci-dessous pour vous connecter à votre compte
        </p>
      </div>

      {/* Sign In Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid gap-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
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

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Mot de passe</FormLabel>
                    <Link
                      href="/recover"
                      className="ml-auto text-sm underline-offset-4 text-primary hover:underline"
                    >
                      Mot de passe Oublié?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pr-10 py-5"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-primary hover:cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? (
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

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSignInLoading || !form.formState.isValid}
            >
              {isSignInLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Divider */}
      <div className="relative text-center text-sm md:text-base after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">OU</span>
      </div>

      {/* Google Sign In Button - Outside of form */}
      <Button
        variant="outline"
        className="w-full border-primary"
        onClick={signInWithGoogle}
        disabled={isGoogleAuthLoading}
        type="button"
      >
        {isGoogleAuthLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="mr-2" />
        )}
        Se connecter avec Google
      </Button>

      {/* Sign Up Link */}
      <div className="text-center text-sm">
        Vous n'avez pas encore de compte?{" "}
        <Link href="/signup" className="text-primary font-medium hover:underline">
          Inscrivez-vous ici
        </Link>
      </div>
    </div>
  );
}
