"use client";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/auth-slice";
import { useRegisterPasswordLessMutation } from "@/lib/apis/auth-api";
import { ArrowRight, Loader2 } from "lucide-react";
import { signUpSchema, SignUpFormValues } from "@/lib/validators/auth-schema";

export function SignUpForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [emailSignup, { isLoading: isEmailLoading }] = useRegisterPasswordLessMutation();
  const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      termsAccepted: false,
    },
  });

  // Handle Google authentication response
  useEffect(() => {
    const successParam = searchParams.get("success");

    if (successParam) {
      setLoadingGoogle(true);

      try {
        // Decode base64 and parse JSON
        const decodedData = atob(successParam);
        const response = JSON.parse(decodedData);

        if (response.status === 200) {
          dispatch(
            setCredentials({
              token: response.auth_token,
              refreshToken: response.refresh_token,
              expiresIn: response.expires_in,
              user: response.user,
            })
          );
          toast.success("Connexion avec Google réussie!");
          router.push("/");
        } else {
          toast.error("Échec de la connexion avec Google");
        }
      } catch (error) {
        console.error("Error parsing Google auth response:", error);
        toast.error("Erreur lors du traitement de la réponse Google");
      } finally {
        setLoadingGoogle(false);

        // Clean up the URL by removing the success parameter
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, [searchParams, dispatch, router]);

  async function onSubmit(values: SignUpFormValues) {
    try {
      const response = await emailSignup({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email.toLowerCase(),
      }).unwrap();
      toast.success(response.message);
      router.push(`/verify?email=${encodeURIComponent(values.email)}`);
    } catch (error: any) {
      const errorMessage = error?.message || "Erreur lors de l'inscription";
      toast.error(errorMessage);
    }
  }

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
      <div className="space-y-4 text-center">
        <h1 className="text-xl font-semibold">Créez votre compte</h1>
        <p className="text-sm text-muted-foreground">
          Bienvenue ! Veuillez compléter les informations pour commencer.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="lastName">Prénom</FormLabel>
                  <FormControl>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Jean"
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
              name="firstName"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="firstName">Nom</FormLabel>
                  <FormControl>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Dupont"
                      className="py-5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="email">Adresse email</FormLabel>
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
                      <Link
                        href="/legales?tab=mentions"
                        target="_blank"
                        className="text-primary hover:underline"
                      >
                        les termes
                      </Link>{" "}
                      et{" "}
                      <Link
                        href="/legales?tab=cgu"
                        target="_blank"
                        className="text-primary hover:underline"
                      >
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
        disabled={loadingGoogle}
        type="button"
      >
        {loadingGoogle ? (
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
