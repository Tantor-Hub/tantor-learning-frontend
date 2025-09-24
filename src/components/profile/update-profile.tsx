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
import { Loader2, SquarePen, User, CheckCircle, Camera, Upload } from "lucide-react";
import Image from "next/image";
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
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useUpdateUserProfileMutation } from "@/lib/apis/users-api";
import { useSelector } from "react-redux";
import { selectToken } from "@/features/auth/auth-slice";
// Schema de validation sans la photo
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
});

type UserProfileData = {
  fs_name: string;
  ls_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  identityNumber?: string;
  avatarURL?: string;
};

// Composant pour la barre de progression de l'upload
function UploadProgress({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
      <div
        className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

function ProfileCompletionBar({
  userData,
  formValues,
}: {
  userData: UserProfileData;
  formValues: any;
}) {
  // Calculate completion based on current form values
  const calculateCompletion = () => {
    const allFields = [
      { label: "Prénom", value: userData.fs_name, required: true },
      { label: "Nom", value: userData.ls_name, required: true },
      { label: "Email", value: userData.email, required: true },
      { label: "Téléphone", value: formValues.phone || userData.phone },
      { label: "Adresse", value: formValues.address || userData.address },
      { label: "Ville", value: formValues.city || userData.city },
      { label: "Pays", value: formValues.country || userData.country },
      { label: "Pièce d'identité", value: formValues.identityNumber || userData.identityNumber },
      { label: "Photo de profil", value: userData.avatarURL },
    ];

    const completedFields = allFields.filter(
      (field) =>
        field.value && field.value !== "" && field.value !== null && field.value !== undefined
    );

    return {
      completed: completedFields.length,
      total: allFields.length,
      percentage: Math.round((completedFields.length / allFields.length) * 100),
      fields: allFields,
    };
  };

  const completion = calculateCompletion();

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTextColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-yellow-600";
    return "text-red-500";
  };

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-gray-600" />
          <h4 className="font-semibold text-gray-800">Completion du Profil</h4>
        </div>
        <div className={`text-xl font-bold ${getTextColor(completion.percentage)}`}>
          {completion.percentage}%
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">
            {completion.completed}/{completion.total} champs complétés
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full ${getProgressColor(completion.percentage)} rounded-full transition-all duration-500 ease-out relative`}
            style={{ width: `${completion.percentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 text-xs">
        {completion.fields.map((field, index) => {
          const isCompleted =
            field.value && field.value !== "" && field.value !== null && field.value !== undefined;
          return (
            <div
              key={index}
              className={`flex items-center gap-1 p-1 rounded text-center ${
                isCompleted ? "text-green-700" : "text-gray-500"
              }`}
            >
              <CheckCircle
                className={`h-3 w-3 ${isCompleted ? "text-green-500" : "text-gray-300"}`}
              />
              <span className="truncate">{field.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function UpdateProfile({
  address,
  country,
  identityNumber,
  phone,
  city,
  avatarURL,
  fs_name = "",
  ls_name = "",
  email = "",
}: {
  address?: string;
  country?: string;
  identityNumber?: string;
  phone?: string;
  city?: string;
  avatarURL?: string;
  fs_name?: string;
  ls_name?: string;
  email?: string;
}) {
  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();
  const [hasChanges, setHasChanges] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const token = useSelector(selectToken);
  // États pour la photo
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      address: address || "",
      country: country || "",
      identityNumber: identityNumber || "",
      phone: phone || "",
      city: city || "",
    },
    mode: "onChange",
  });

  const watchedFields = form.watch();

  // Check for changes whenever form values change
  useEffect(() => {
    const currentValues = form.getValues();
    const originalValues = {
      address: address || "",
      country: country || "",
      identityNumber: identityNumber || "",
      phone: phone || "",
      city: city || "",
    };

    const hasFormChanges = Object.keys(currentValues).some((key) => {
      const currentValue = currentValues[key as keyof typeof currentValues] || "";
      const originalValue = originalValues[key as keyof typeof originalValues] || "";
      return currentValue !== originalValue;
    });

    setHasChanges(hasFormChanges);
  }, [watchedFields, address, country, identityNumber, phone, city, form]);

  const userData: UserProfileData = {
    fs_name,
    ls_name,
    email,
    phone,
    address,
    city,
    country,
    identityNumber,
    avatarURL,
  };

  // Fonction pour uploader la photo séparément
  const handlePhotoUpload = async () => {
    if (!selectedPhoto) {
      toast.error("Veuillez sélectionner une photo");
      return;
    }

    setIsUploadingPhoto(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("avatar", selectedPhoto);

      // Simuler le progrès
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/user/update`, {
        method: "PUT",
        body: formData,
        headers: {
          "x-connexion-tantor": `Bearer ${token}`,
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      toast.success("Vous avez changé votre photo avec succès!");

      // Réinitialiser les états de la photo
      setSelectedPhoto(null);
      setPhotoPreview(null);
      setUploadProgress(0);

      // Fermer le modal
      setTimeout(() => {
        setIsDialogOpen(false);
      }, 1000);
    } catch (error) {
      console.error("Error uploading photo:", error);
      if (error instanceof Error) {
        toast.error(`Erreur: ${error.message}`);
      } else {
        toast.error("Échec de l'upload de la photo");
      }
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Fonction pour soumettre les autres informations (sans l'avatar)
  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    if (!hasChanges) {
      toast.error("Aucune modification détectée");
      return;
    }

    try {
      const toastId = toast.loading("En cours ...");

      // Filter out empty values before sending to API
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined
        )
      );

      await updateProfile({
        ...(filteredValues.address && { adresse_physique: filteredValues.address }),
        ...(filteredValues.country && { pays_residance: filteredValues.country }),
        ...(filteredValues.identityNumber && { num_piece_identite: filteredValues.identityNumber }),
        ...(filteredValues.city && { ville_residance: filteredValues.city }),
        ...(filteredValues.phone && { phone: filteredValues.phone }),
        // Note: We don't include avatar here to avoid sending null
      }).unwrap();

      toast.dismiss(toastId);
      toast.success("Votre profil a été modifié avec succès");

      form.reset();
      setHasChanges(false);
      setIsDialogOpen(false);
    } catch (e: any) {
      toast.dismiss();
      toast.error("Une erreur s'est produite lors de la mise à jour");
    }
  };

  const handleCancel = () => {
    form.reset({
      address: address || "",
      country: country || "",
      identityNumber: identityNumber || "",
      phone: phone || "",
      city: city || "",
    });
    setSelectedPhoto(null);
    setPhotoPreview(null);
    setHasChanges(false);
    setUploadProgress(0);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button size="lg">
          <SquarePen className="mr-2 h-4 w-4" />
          MODIFIER LE PROFILE
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Modifier le Profile</AlertDialogTitle>
          <AlertDialogDescription>
            Veuillez remplir les informations de votre profil. Tous les champs sont optionnels.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Profile Completion Bar */}
        <ProfileCompletionBar userData={userData} formValues={watchedFields} />

        {/* Section Photo de Profil Séparée */}
        <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <Camera className="h-6 w-6 text-gray-600" />
            <div>
              <h4 className="font-semibold text-gray-800">Photo de Profil</h4>
              <p className="text-sm text-gray-600">Changez votre photo de profil</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Photo actuelle ou preview */}
            <div className="flex gap-4">
              {avatarURL && !photoPreview && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Photo actuelle:</p>
                  <Image
                    src={avatarURL}
                    alt="Photo de profil actuelle"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover border-2 border-green-500"
                  />
                </div>
              )}
              {photoPreview && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nouvelle photo:</p>
                  <Image
                    src={photoPreview}
                    alt="Nouvelle photo de profil"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Contrôles photo */}
            <div className="flex-1 space-y-3">
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="cursor-pointer"
              />

              {selectedPhoto && (
                <div>
                  <Button
                    type="button"
                    onClick={handlePhotoUpload}
                    disabled={isUploadingPhoto}
                    className="w-full sm:w-auto"
                  >
                    {isUploadingPhoto ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        Upload en cours...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Changer l'Avatar
                      </>
                    )}
                  </Button>

                  {isUploadingPhoto && (
                    <div className="mt-2">
                      <UploadProgress progress={uploadProgress} />
                      <p className="text-sm text-gray-600 text-center mt-1">
                        {uploadProgress}% terminé
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <Form {...form}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Numéro de Téléphone
                      {phone && <span className="text-green-600 ml-1">✓</span>}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+33 612 345 678"
                        {...field}
                        className={phone ? "border-green-200 bg-green-50" : ""}
                      />
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
                    <FormLabel>
                      Adresse
                      {address && <span className="text-green-600 ml-1">✓</span>}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Rue de la République"
                        {...field}
                        className={address ? "border-green-200 bg-green-50" : ""}
                      />
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
                    <FormLabel>
                      Ville
                      {city && <span className="text-green-600 ml-1">✓</span>}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Paris"
                        {...field}
                        className={city ? "border-green-200 bg-green-50" : ""}
                      />
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
                    <FormLabel>
                      Pays
                      {country && <span className="text-green-600 ml-1">✓</span>}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="France"
                        {...field}
                        className={country ? "border-green-200 bg-green-50" : ""}
                      />
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
                    <FormLabel>
                      Pièce d'identité
                      {identityNumber && <span className="text-green-600 ml-1">✓</span>}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1234567890123"
                        {...field}
                        className={identityNumber ? "border-green-200 bg-green-50" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!hasChanges && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 text-sm">
                  💡 Modifiez au moins un champ pour pouvoir sauvegarder les changements.
                </p>
              </div>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel type="button" onClick={handleCancel}>
                Annuler
              </AlertDialogCancel>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={!hasChanges || form.formState.isSubmitting || isLoading}
                className={!hasChanges ? "opacity-50 cursor-not-allowed" : ""}
              >
                {form.formState.isSubmitting || isLoading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </AlertDialogFooter>
          </div>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
