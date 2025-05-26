"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, SquarePen, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useState } from "react";

// Validation schema
const profileFormSchema = z.object({
  email: z.string().email("Email invalide"),
  phone: z.string().min(3, "Numéro requis"),
  address: z.string().min(2),
  city: z.string().min(2),
  country: z.string().min(2),
  identityNumber: z.string().min(2),
  photo: z.any().optional(),
});

export function UpdateProfile() {
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: "tantorelearning@gmail.com",
      phone: "tantorlearning",
      address: "GOMA",
      city: "ville",
      country: "pays",
      identityNumber: "num",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      // Simuler une requête
      await new Promise((res) => setTimeout(res, 1000));
      toast.success("Profil mis à jour !");
      form.reset();
    } catch (e: any) {
      toast.error("Erreur", { description: e.message });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg">
          <SquarePen className="mr-2 h-4 w-4" />
          MODIFIER LE PROFIL
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Modifier le Profil</AlertDialogTitle>
          <AlertDialogDescription>
            Veuillez remplir les informations de votre profil.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/** Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/** Téléphone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="Téléphone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/** Adresse */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="Adresse" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/** Ville */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/** Pays */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays</FormLabel>
                    <FormControl>
                      <Input placeholder="Pays" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/** Pièce d'identité */}
              <FormField
                control={form.control}
                name="identityNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pièce d'identité</FormLabel>
                    <FormControl>
                      <Input placeholder="Numéro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/** Photo de profil - Pleine largeur */}
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Photo de profil</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setPreview(url);
                          field.onChange(file);
                        }
                      }}
                    />
                  </FormControl>
                  {preview && (
                    <div className="mt-2">
                      <img
                        src={preview}
                        alt="Aperçu du profil"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel type="button" onClick={() => form.reset()}>
                Annuler
              </AlertDialogCancel>
              <Button
                type="submit"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Mettre à jour"
                )}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
