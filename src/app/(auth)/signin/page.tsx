"use client";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/features/auth/auth-slice";
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
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SignInFormValues, signInSchema } from "@/lib/validators/signin-schema";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch } from "react-redux";
import { useSigninMutation, useAuthWithGoogleMutation } from "@/lib/api";
import { setCredentials } from "@/features/auth/auth-slice";

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: SignInFormValues) {
    try {
      setIsLoading(true);
      // Call the signin API
      const result = await signin({
        user_name: values.email,
        password: values.password,
      }).unwrap();

      // Store credentials in Redux
      dispatch(
        setCredentials({
          token: result.access_token,
          refreshToken: result.refresh_token,
          expiresIn: result.expires_in,
          // Add user info if available in the response
        })
      );

      toast.success("Connexion réussie!");

      // Save to localStorage if "remember me" is checked
      if (values.rememberMe) {
        localStorage.setItem("refreshToken", result.refresh_token);
      }

      // Redirect to dashboard
      router.push("/dashboard/student");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.data?.message || "Échec de la connexion. Veuillez vérifier vos identifiants."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function signInWithGoogle() {
    try {
      setIsLoading(true);

      // Use the mutation trigger function
      const result = await triggerGoogleAuth().unwrap();

      // Rest remains the same
      dispatch(
        setCredentials({
          token: result.access_token,
          refreshToken: result.refresh_token,
          expiresIn: result.expires_in,
        })
      );

      toast.success("Connexion avec Google réussie!");
      router.push("/dashboard/student");
    } catch (error) {
      console.error(error);
      toast.error("Échec de la connexion avec Google");
    } finally {
      setIsLoading(false);
    }
  }

  const dispatch = useDispatch();
  const [signin, { isLoading: isSigningIn }] = useSigninMutation();
  const [triggerGoogleAuth, { isLoading: isGoogleAuthLoading }] = useAuthWithGoogleMutation();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard/student");
    }

    // Check for stored refresh token
    const storedToken = localStorage.getItem("refreshToken");
    if (storedToken && !isAuthenticated) {
      // You could dispatch a token refresh action here
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full px-4">
        {/* Left section with illustration */}
        <div className="hidden md:flex flex-col justify-center gap-0">
          <Image
            src="/sign-in-img.svg"
            alt="Learning illustration"
            className="max-w-full object-contain"
            width={300}
            height={300}
          />
          <h2 className="text-2xl font-bold text-primary">
            Accédez à des formations de qualité, où que vous soyez.
          </h2>
        </div>

        {/* Right section with sign up form */}
        <div className="w-full max-w-md mx-auto py-6">
          <div className="text-center mb-6">
            <h1 className="text-[28px] font-bold text-primary">Bienvenue sur TANTOR-LEARNING</h1>
          </div>

          <div className="flex items-center justify-between mb-8 gap-4 bg-[#8FAEF9] rounded-full py-2 px-6">
            <Button size="sm" className="rounded-full flex-1 bg-[#0466C8]">
              Se Connecter
            </Button>
            <Button
              variant="ghost"
              className="rounded-full flex-1 text-white"
              size="sm"
              onClick={() => router.push("/signup")}
            >
              S'inscrire
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Addresse mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Entrer votre addresse mail"
                        className="rounded-full p-6 border border-[#0466C8]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Entrer votre mot de passe"
                          className="rounded-full pr-12 p-6 border border-[#0466C8]"
                          {...field}
                        />
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          onClick={togglePasswordVisibility}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <div className="flex items-center">
                      <Checkbox
                        id="remember-me"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-3 block text-sm text-slate-500">
                        Se rappeler de moi
                      </label>
                    </div>
                  )}
                />
                <div className="text-sm">
                  <Link href="/recover" className="text-[#0466C8] hover:underline font-medium">
                    Mot de passe Oublié?
                  </Link>
                </div>
              </div>

              <Button
                className="w-full bg-[#0466C8] mt-4"
                type="submit"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Vous n’avez pas encore de compte?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Inscrivez-vous ici
              </Link>
            </p>
          </div>

          <div className="my-6 flex items-center gap-4">
            <hr className="w-full border-border" />
            <p className="text-sm whitespace-nowrap">OU</p>
            <hr className="w-full border-border" />
          </div>

          <Button
            variant="outline"
            className="w-full"
            type="button"
            size="lg"
            onClick={signInWithGoogle}
            disabled={isLoading}
          >
            <GoogleIcon />
            Se connecter avec Google
          </Button>
        </div>
      </div>
    </div>
  );
}
