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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllTrainingsQuery } from "@/lib/apis/public/public-api";

const formSchema = z.object({
  title: z.string().min(1, "Veuillez entrer un titre pour le cours"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
});

type CourseFormValues = z.infer<typeof formSchema>;

interface CreateCourseFormProps {
  onCancel: () => void;
  onSubmitSuccess?: (data: CourseFormValues) => void;
}

export function AddCourseForm({ onCancel, onSubmitSuccess }: CreateCourseFormProps) {
  const [addCourse, { isLoading }] = useAddCourseMutation();
  const { data: sessionsData, isLoading: isLoadingSessions } = useGetAllTrainingsQuery();
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "" },
    mode: "onChange",
  });

  const handleSubmit = async (data: CourseFormValues) => {
    try {
      const response = await addCourse({
        title: data.title,
        description: data.description,
        id_session: parseInt(selectedSessionId),
        id_formateurs: [],
      }).unwrap();
      console.log(response);

      toast.success("Cours créé avec succès");

      if (onSubmitSuccess) {
        onSubmitSuccess(data);
      }

      form.reset();
    } catch (error) {
      if (error instanceof Error && error.message.includes("Network Error")) {
        toast.error("Erreur de connexion - Veuillez vérifier votre internet");
      } else {
        toast.error("Erreur lors de la création du cours");
      }
      console.error("Submission error:", error);
    }
  };

  const sessionsList = sessionsData?.data?.list || [];

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
              <FormLabel>Titre du cours</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Entrez le titre du cours"
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

        <Select value={selectedSessionId} onValueChange={(value) => setSelectedSessionId(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner une session" />
          </SelectTrigger>
          <SelectContent>
            {sessionsList.map((session: any) => (
              <SelectItem key={session.id} value={session.id.toString()}>
                {session.Formation.titre} - {session.designation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-5 md:gap-10 justify-end md:mt-5">
          <Button
            variant="outline"
            className="p-5 px-7 border-[#0466C8] text-[#0466C8]"
            type="button"
            onClick={onCancel}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="p-5 px-7 bg-[#0466C8] hover:bg-[#0353a4]"
            disabled={!form.formState.isValid || isLoading}
          >
            {isLoading ? "Création..." : "Créer le cours"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
