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
import { useSigninMutation } from "@/lib/apis/auth-api";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { signInSchema, SignInFormValues } from "@/lib/validators/auth-schema";

export function SignInForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false);
  const [signin, { isLoading: isSignInLoading }] = useSigninMutation();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle Google authentication response
  useEffect(() => {
    const successParam = searchParams.get("success");
    // console.log(successParam);

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
      setLoadingGoogle(true);
      const loadingToast = toast.loading("Connexion avec Google en cours...");

      const w = 500;
      const h = 600;
      const left = (window.innerWidth - w) / 2;
      const top = (window.innerHeight - h) / 2;
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/users/user/authwithgoogle`;
      router.push(url);
      // Open Google auth in a popup window
      // window.open(url, "GoogleAuth", `width=${w},height=${h},left=${left},top=${top}`);

      toast.dismiss(loadingToast);
    } catch (error) {
      setLoadingGoogle(false);
      toast.error("Échec de l'ouverture de l'authentification Google");
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
