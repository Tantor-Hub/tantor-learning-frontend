"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GoogleIcon } from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import Link from "next/link";
import { signUpSchema, SignUpFormValues } from "@/lib/validators/signup-schema";
import { useRouter } from "next/navigation";
import { useSignupMutation, useAuthWithGoogleMutation } from "@/lib/api";

export function SignUpForm() {
  const [signup, { isLoading }] = useSignupMutation();
  const router = useRouter();
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
      const promise = await signup({
        fs_name: values.fullName.split(" ")[0],
        ls_name: values.fullName.split(" ")[1],
        password: values.password,
        nick_name: values.username,
        email: values.email,
      });
      console.log(promise);
      if (isLoading) {
        toast.loading("Inscription en cours...");
      }
      if (promise.error) {
        toast.error("Erreur lors de l'inscription");
        console.log(promise.error);
        return;
      }
      if (promise.data) {
        toast.dismiss();
        router.push(`/signup/${values.email}`);
        toast.success("Compte créé avec succès!");
      }
    } catch {
      toast.error("Erreur lors de l'inscription");
    }
  }

  function signInWithGoogle() {
    // Implement Google authentication logic here
    toast.error("Connexion avec Google");
  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">S'inscrire</h1>
        <p className="text-balance text-sm text-muted-foreground">
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
                  <Input
                    id="password"
                    type="password"
                    placeholder="Entrer votre mot de passe"
                    required
                    {...field}
                  />
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
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    required
                    {...field}
                  />
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">OU</span>
          </div>

          <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
            <GoogleIcon />
            Se connecter avec Google
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        Avez-vous déjà un compte?{" "}
        <Link href="/signin" className="text-primary hover:underline">
          Connectez-vous ici
        </Link>
      </div>
    </div>
  );
}
