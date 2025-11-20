"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useLoginPasswordLessMutation } from "@/lib/apis/auth-api";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { signInSchema, SignInFormValues } from "@/lib/validators/auth-schema";

export function SignInForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false);
  const [signin, { isLoading: isSignInLoading }] = useLoginPasswordLessMutation();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  // Handle Google authentication response
  useEffect(() => {
    const successParam = searchParams.get("success");
    const errorParam = searchParams.get("error");

    if (successParam) {
      setLoadingGoogle(true);
      try {
        // Decode base64 and parse JSON
        const decodedData = atob(successParam);
        const response = JSON.parse(decodedData);

        if (response.status === 200 && response.data) {
          dispatch(
            setCredentials({
              token: response.data.auth_token,
              refreshToken: response.data.refresh_token,
              expiresIn: 3600,
              user: response.data.user,
            })
          );
          toast.success("Connexion avec Google réussie!");

          // Clean up the URL before redirecting
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);

          // Redirect to home page
          router.replace("/");
        } else {
          toast.error("Échec de la connexion avec Google");
          setLoadingGoogle(false);
        }
      } catch (error) {
        console.error("Error parsing Google auth response:", error);
        toast.error("Erreur lors du traitement de la réponse Google");
        setLoadingGoogle(false);

        // Clean up the URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }

    if (errorParam) {
      try {
        const decodedData = atob(errorParam);
        const errorResponse = JSON.parse(decodedData);
        toast.error(errorResponse.message || "Échec de l'authentification Google");
      } catch (error) {
        console.error("Error parsing Google auth error:", error);
        toast.error("Erreur lors de l'authentification Google");
      } finally {
        // Clean up the URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, [searchParams, dispatch, router]);

  const handleSubmit = async (values: SignInFormValues) => {
    try {
      const response = await signin({
        email: values.email.toLowerCase(),
      }).unwrap();
      toast.success(response.message);
      router.push(`/verify?email=${encodeURIComponent(values.email)}`);
    } catch (error: any) {
      // Check if it's a 404 error (email not found)
      if (error.status === 404 || error.statusCode === 404) {
        form.setError("email", {
          type: "manual",
          message: "Email introuvable. Veuillez vérifier votre adresse email ou vous inscrire.",
        });
      } else {
        const errorMessage = error.message || "Échec de la connexion. Veuillez réessayer.";
        toast.error(errorMessage);
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoadingGoogle(true);
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/users/user/authwithgoogle`;
      router.push(url);
    } catch (error) {
      toast.error("Échec de l'ouverture de l'authentification Google");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4 text-center">
        <h1 className="text-xl font-semibold">Se Connecter</h1>
        <p className="text-sm text-muted-foreground">
          Bienvenue ! Veuillez vous connecter pour continuer.
        </p>
      </div>

      {/* Sign In Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid gap-6">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse email</FormLabel>
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

      {/* Google Sign In Button */}
      <Button
        variant="outline"
        className="w-full border-primary"
        onClick={signInWithGoogle}
        disabled={loadingGoogle}
        type="button"
      >
        {loadingGoogle ? (
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
