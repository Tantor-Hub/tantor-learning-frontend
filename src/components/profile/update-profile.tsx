"use client";
import {
  AlertDialog,
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
import { Loader2, SquarePen } from "lucide-react";
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
import { useUpdateUserProfileMutation } from "@/lib/apis/users-api";
import Image from "next/image";

// Updated validation schema - all fields are truly optional
const profileFormSchema = z.object({
  phone: z
    .string()
    .refine((val) => !val || (val.length >= 9 && /^[0-9]+$/.test(val)), {
      message: "Le numéro doit contenir au moins 9 chiffres",
    })
    .optional(),
  address: z
    .string()
    .refine((val) => !val || val.length >= 2, {
      message: "L'adresse doit contenir au moins 2 caractères",
    })
    .optional(),
  city: z
    .string()
    .refine((val) => !val || val.length >= 2, {
      message: "La ville doit contenir au moins 2 caractères",
    })
    .optional(),
  country: z
    .string()
    .refine((val) => !val || val.length >= 2, {
      message: "Le pays doit contenir au moins 2 caractères",
    })
    .optional(),
  identityNumber: z
    .string()
    .refine((val) => !val || val.length >= 2, {
      message: "Le numéro d'identité doit contenir au moins 2 caractères",
    })
    .optional(),
  photo: z.any().optional(),
});

export function UpdateProfile() {
  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      address: "",
      country: "",
      identityNumber: "",
      phone: "",
      city: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      toast.loading("En cours ...", {
        description: "Mise à jour de votre profil en cours",
      });

      // Filter out empty values before sending to API
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined
        )
      );

      await updateProfile({
        ...(filteredValues.photo && { avatar: filteredValues.photo }),
        ...(filteredValues.address && { adresse_physique: filteredValues.address }),
        ...(filteredValues.country && { pays_residance: filteredValues.country }),
        ...(filteredValues.identityNumber && { num_piece_identite: filteredValues.identityNumber }),
        ...(filteredValues.city && { ville_residance: filteredValues.city }),
        ...(filteredValues.phone && { phone: filteredValues.phone }),
      });

      toast.success("Profil mis à jour !", {
        description: "Votre profil a été modifié avec succès",
      });

      form.reset();
      setPreview(null);
    } catch (e: any) {
      toast.error("Erreur", {
        description: e.message || "Une erreur s'est produite lors de la mise à jour",
      });
    } finally {
      toast.dismiss();
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
            Veuillez remplir les informations de votre profil. Tous les champs sont optionnels.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de Téléphone (optionnel)</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+33 612 345 678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Rue de la République" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Paris" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="France" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="identityNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pièce d'identité (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo de profil (optionnel)</FormLabel>
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
                      <Image
                        src={preview}
                        alt="Aperçu du profil"
                        width={24}
                        height={24}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel
                type="button"
                onClick={() => {
                  form.reset();
                  setPreview(null);
                }}
              >
                Annuler
              </AlertDialogCancel>
              <Button type="submit" disabled={form.formState.isSubmitting || isLoading}>
                {form.formState.isSubmitting || isLoading ? (
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
