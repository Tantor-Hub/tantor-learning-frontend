"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GoogleIcon } from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { signUpSchema, SignUpFormValues } from "@/lib/validators/signup-schema";
import { useRouter } from "next/navigation";
import { useSignupMutation, useAuthWithGoogleMutation } from "@/lib/apis/auth-api";

export function SignUpForm() {
  const router = useRouter();
  const [emailSignup, { isLoading: isEmailLoading }] = useSignupMutation();
  const [googleSignup, { isLoading: isGoogleLoading, error: googleError }] =
    useAuthWithGoogleMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  async function onSubmit(values: SignUpFormValues) {
    try {
      toast.loading("Inscription en cours...");
      const promise = await emailSignup({
        fs_name: values.fullName.split(" ")[0],
        ls_name: values.fullName.split(" ")[1] || values.fullName.split(" ")[0],
        password: values.password,
        nick_name: values.username,
        email: values.email,
      }).unwrap();
      router.push(`/verify-account?email=${encodeURIComponent(values.email)}`);
      toast.dismiss();
      toast.success(promise.data.message || "Compte créé avec succès!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Erreur lors de l'inscription");
      } else {
        toast.error("Une erreur inattendue s'est produite");
      }
    }
  }

  const signInWithGoogle = async () => {
    try {
      toast.loading("Connexion avec Google en cours...");
      window.location.href = "https://tantor-learning.up.railway.app/api/users/user/authwithgoogle";
      const result = await googleSignup().unwrap();
      // console.log(result);

      toast.dismiss();

      if (result) {
        // Handle successful Google sign-in
        toast.success("Connexion avec Google réussie!");
        router.push("/"); // Redirect to dashboard or appropriate page
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Échec de la connexion avec Google");
      console.error("Google signup error:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl md:text-3xl font-semibold md:font-bold">S'inscrire</h1>
        <p className="text-balance text-base text-muted-foreground">
          Inscrivez-vous en remplissant les informations ci-dessous
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="fullName">Noms</FormLabel>
                <FormControl>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Entrer votre Nom et Post-nom"
                    required
                    {...field}
                    className="py-5 text-sm md:text-base"
                  />
                </FormControl>
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
                    placeholder="sofia@gmail.com"
                    required
                    {...field}
                    className="py-5 text-sm md:text-base"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="username">Nom d'utilisateur</FormLabel>
                <FormControl>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Entrer votre nom d'utilisateur"
                    required
                    {...field}
                    className="py-5 text-sm md:text-base"
                  />
                </FormControl>
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
                      placeholder="Entrer votre mot de passe"
                      required
                      className="pr-10 py-5 text-sm md:text-base"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-primary"
                      tabIndex={-1}
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
                </FormControl>
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
                      placeholder="Entrer votre mot de passe"
                      required
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
                </FormControl>
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
                    <p className="text-sm font-normal ml-2">
                      J'accepte <span className="text-primary">les termes</span> et{" "}
                      <span className="text-primary">les conditions</span>
                    </p>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full py-5" disabled={isEmailLoading}>
            {isEmailLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">OU</span>
          </div>

          <Button variant="outline" className="w-full py-5" onClick={signInWithGoogle}>
            <GoogleIcon />
            Se connecter avec Google
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm md:text-base">
        Avez-vous déjà un compte?{" "}
        <Link href="/signin" className="text-primary font-semibold hover:underline">
          Connectez-vous ici
        </Link>
      </div>
    </div>
  );
}
