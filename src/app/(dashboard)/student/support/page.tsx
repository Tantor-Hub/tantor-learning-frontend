"use client";
import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Download, File, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useContactFormAPIMutation } from "@/lib/apis/public/public-api";
import { contactUsFormSchema, type ContactUsFormValues } from "@/lib/validators/form-schema";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";

export default function Page() {
  const router = useRouter();
  const currentUser = useSelector(selectCurrentUser);
  const [contactForm, { isLoading }] = useContactFormAPIMutation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const form = useForm<ContactUsFormValues>({
    resolver: zodResolver(contactUsFormSchema),
    defaultValues: {
      file: null,
      subject: "",
      message: "",
    },
    mode: "onChange",
  });

  const isFormValid: boolean = form.formState.isValid;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    form.setValue("file", file);
  };

  const handleCancel = (): void => {
    form.reset();
    setSelectedFile(null);
  };

  const handleDownloadGuide = (): void => {
    // Logique pour télécharger le guide
    // console.log("Téléchargement du guide d'aide");
  };

  // Form submission handler
  const handleSubmit = async (values: ContactUsFormValues) => {
    const toastId = toast.loading("Envoi en cours...");
    try {
      const response = await contactForm({
        from_name: currentUser?.nick_name || "",
        from_mail: currentUser?.email || "",
        subject: values.subject,
        content: values.message,
      }).unwrap();
      // console.log(response);
      if (response.status === 201) {
        toast.success("Requête envoyée avec succès", {
          id: toastId,
        });
        form.reset();
      } else {
        throw new Error("Réponse inattendue du serveur");
      }
    } catch {
      toast.error("Échec de l'envoi", {
        id: toastId,
      });
      return values;
    }
  };
  return (
    <section className="flex flex-col gap-6 mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <Button size="lg" onClick={handleDownloadGuide}>
          <Download />
          Télécharger le guide d'aide
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4 text-primary" />
          <span>Temps de réponse moyen: 24-48h</span>
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <div className="bg-ring text-secondary-foreground px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="bg-transparent text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-xl text-white">Nouvelle requête de support</h1>
          </div>
        </div>

        <div className="p-6">
          <Form {...form}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Sujet de votre demande <span className="text-destructive text-xl">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Décrivez brièvement votre problème"
                        {...field}
                        className="transition-all duration-200 focus:ring-2 focus:ring-[#0466C8] focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Description détaillée <span className="text-destructive text-xl">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={8}
                        {...field}
                        placeholder="Décrivez votre problème en détail. Plus vous fournirez d'informations, plus nous pourrons vous aider efficacement."
                        className="min-h-32 resize-none transition-all duration-200 focus:ring-2 focus:ring-[#0466C8] focus:border-transparent"
                      />
                    </FormControl>
                    <div className="flex justify-between items-center">
                      <FormMessage />
                      <span className="text-xs text-gray-500">
                        {field.value?.length || 0} caractères
                      </span>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 transition-colors hover:border-[#0466C8] hover:bg-blue-50/50">
                      <FormLabel className="flex flex-col items-center gap-2 cursor-pointer text-center">
                        <File className="w-8 h-8 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          Joindre un fichier (optionnel)
                        </span>
                        <span className="text-xs text-gray-500">PNG, JPG, PDF jusqu'à 10MB</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </FormControl>
                      {selectedFile && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-md flex items-center justify-between">
                          <span className="text-sm text-blue-700 font-medium">
                            {selectedFile.name}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedFile(null);
                              form.setValue("file", null);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Supprimer
                          </Button>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  onClick={form.handleSubmit(handleSubmit)}
                  className="bg-[#0466C8] hover:bg-[#0353A4] transition-colors duration-200 min-w-32"
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Envoi en cours...
                    </div>
                  ) : (
                    "Envoyer la requête"
                  )}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>

      <div className="bg-secondary text-secondary-foreground rounded-lg p-6 border">
        <h3 className="font-semibold mb-3">Besoin d'aide immédiate ?</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Questions fréquentes</p>
            <p className="text-ring text-sm">Consultez notre FAQ pour des réponses rapides</p>
          </div>
          <div>
            <p className="font-medium">Chat en direct</p>
            <p className="text-ring text-sm">Disponible du lundi au vendredi, 9h-18h</p>
          </div>
        </div>
      </div>
    </section>
  );
}
