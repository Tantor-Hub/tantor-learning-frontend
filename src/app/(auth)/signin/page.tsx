"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/features/auth/auth-slice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GoogleIcon } from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignInFormValues, signInSchema } from "@/lib/validators/signin-schema";
import { useDispatch } from "react-redux";
import { useSigninMutation, useAuthWithGoogleMutation } from "@/lib/api";
import { Label } from "@/components/ui/label";
import { setCredentials } from "@/features/auth/auth-slice";

interface FormData {
  email: string;
  password: string;
}

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [signin, { isLoading: isSigningIn }] = useSigninMutation();
  const [triggerGoogleAuth, { isLoading: isGoogleAuthLoading }] = useAuthWithGoogleMutation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      toast.loading("Connexion en cours...");
      setIsLoading(true);
      // Call the signin API
      const promise = await signin({
        user_name: formData.email,
        password: formData.password,
      }).unwrap();

      // Store credentials in Redux
      dispatch(
        setCredentials({
          token: promise.access_token,
          refreshToken: promise.refresh_token,
          expiresIn: promise.expires_in,
        })
      );
      router.push("/dashboard/student");
      toast.success(`Connexion réussie!`);
      toast.dismiss();
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.data?.data || "Échec de la connexion. Veuillez vérifier vos identifiants.");
    } finally {
      //
      setIsLoading(false);
    }
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
      toast.error("Échec de la connexion avec Google");
    } finally {
      setIsLoading(false);
    }
  }

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
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-5 text-center">
        <h1 className="text-2xl md:text-3xl font-semibold md:font-bold ">Se connecter</h1>
        <p className="text-base sm:text-[18px] font-medium text-muted-foreground">
          Entrez votre email ci-dessous pour vous connecter à votre compte
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-sm md:text-base">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="sofia@gmail.com"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="py-5 text-sm md:text-base"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password" className="text-sm md:text-base">
              Mot de passe
            </Label>
            <Link
              href="/recover"
              className="ml-auto text-sm md:text-base underline-offset-4 text-primary hover:underline font-medium"
            >
              Mot de passe Oublié?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Mot de passe"
              required
              className="pr-10 py-5 text-sm md:text-base"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prevState) => !prevState)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-primary hover:cursor-pointer"
              tabIndex={-2}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.547-4.2M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1l11.8 11.8"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full text-sm md:text-base  py-5" disabled={isLoading}>
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </Button>
        <div className="relative text-center text-sm md:text-base after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">OU</span>
        </div>
        <Button
          variant="outline"
          className="w-full text-sm md:text-base py-5"
          onClick={signInWithGoogle}
        >
          <GoogleIcon />
          Se connecter avec Google
        </Button>
      </div>
      <div className="text-center text-sm md:text-base">
        Vous n’avez pas encore de compte?{" "}
        <Link href="/signup" className="text-primary font-medium hover:underline">
          Inscrivez-vous ici
        </Link>
      </div>
    </form>
  );
}
