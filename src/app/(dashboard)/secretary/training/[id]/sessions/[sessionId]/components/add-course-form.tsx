"use client";
import { useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAddCourseMutation } from "@/lib/apis/common/courses-api";
import { toast } from "react-hot-toast"; // ou autre lib de notifications
import { Loader2, Plus } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Veuillez entrer un titre pour le cours"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  ponderation: z.number().min(1, "La pondération doit être au moins 1"),
});

type CourseFormValues = z.infer<typeof formSchema>;

interface CreateCourseFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
  onSubmitSuccess?: (data: CourseFormValues) => void;
  sessionId: string;
  setIsLoading?: (loading: boolean) => void;
}

export function AddCourseForm({
  onCancel,
  onSuccess,
  onSubmitSuccess,
  sessionId,
  setIsLoading,
}: CreateCourseFormProps) {
  const [addCourse, { isLoading }] = useAddCourseMutation();
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", ponderation: 1 },
    mode: "onChange",
  });

  const handleSubmit = async (data: CourseFormValues) => {
    setIsLoading?.(true);
    try {
      const response = await addCourse({
        title: data.title,
        description: data.description,
        id_session: sessionId,
        ponderation: data.ponderation,
      }).unwrap();

      toast.success("Cours créé avec succès");

      if (onSubmitSuccess) {
        onSubmitSuccess(data);
      }

      if (onSuccess) {
        onSuccess();
      }

      form.reset();
    } catch (error) {
      if (error instanceof Error && error.message.includes("Network Error")) {
        toast.error("Erreur de connexion - Veuillez vérifier votre internet");
      } else {
        toast.error("Erreur lors de la création du cours");
      }
      console.error("Submission error:", error);
    } finally {
      setIsLoading?.(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col text-sm font-normal gap-5"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2.5">
              <FormLabel>Titre de la matière</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Entrez le titre de la matière"
                  className="text-sm font-extralight py-5"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2.5">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Décrivez brièvement le contenu du cours"
                  className="min-h-20 max-h-28 text-sm font-extralight"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ponderation"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2.5">
              <FormLabel>Pondération</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Entrez la pondération"
                  className="text-sm font-extralight py-5"
                  disabled={isLoading}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 md:gap-8 justify-end md:mt-4">
          <Button
            variant="outline"
            className="border-primary text-primary"
            type="button"
            onClick={onCancel}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={!form.formState.isValid || isLoading}>
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Plus /> Créer une matière
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
