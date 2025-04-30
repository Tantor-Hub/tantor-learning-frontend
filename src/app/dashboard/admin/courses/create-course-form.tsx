"use client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Files, Video } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Veuillez entrer un titre pour le cours",
  }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères",
  }),
  author: z.string().min(1, {
    message: "Veuillez choisir un formateur",
  }),
  courseType: z.string().min(1, {
    message: "Veuillez choisir le type de cours",
  }),
});

type CourseFormValues = z.infer<typeof formSchema>;

interface CreateCourseFormProps {
  onCancel: () => void;
  onSubmit?: (data: CourseFormValues) => void;
}

export function CreateCourseForm({ onCancel, onSubmit }: CreateCourseFormProps) {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      courseType: "",
      author: "",
    },
    mode: "onChange",
  });

  const isFormValid = form.formState.isValid;

  const handleSubmit = (data: CourseFormValues) => {
    // Submit form data to parent component or API
    if (onSubmit) {
      onSubmit(data);
    }
    console.log("Form submitted successfully:", data);
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
              <FormLabel>Titre du cours</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  placeholder="Entrez le titre du cours"
                  className="text-sm font-extralight py-5"
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
                  rows={10}
                  {...field}
                  placeholder="Décrivez brièvement le contenu du cours"
                  className="min-h-20 max-h-28 overflow-y-auto resize-none text-sm font-extralight"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="courseType"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2.5">
              <FormLabel>Type de cours</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="visioconference" id="visioconference" />
                    <Label
                      htmlFor="visioconference"
                      className="font-normal flex items-center gap-2"
                    >
                      <Video className="h-4 w-4" color="#333" />
                      Cours en visioconférence
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="prerecorded" id="prerecorded" />
                    <Label htmlFor="prerecorded" className="font-normal flex items-center gap-2">
                      <Files className="h-4 w-4" color="#333" />
                      Cours pré-enregistré
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2.5">
              <FormLabel>Formateur</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full py-5">
                    <SelectValue placeholder="Sélectionnez un formateur" />
                  </SelectTrigger>
                  <SelectContent className="font-extralight">
                    <SelectItem value="birusha">Birusha Ndegeya</SelectItem>
                    <SelectItem value="sofia">SOFIA Kim</SelectItem>
                    <SelectItem value="oliver">OLIVER Tomson</SelectItem>
                    <SelectItem value="marie">Marie Le Roy</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-5 md:gap-10 justify-end md:mt-5">
          <Button
            variant="outline"
            className="p-5 px-7 border-[#0466C8] text-[#0466C8] cursor-pointer"
            type="button"
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="p-5 px-7 bg-[#0466C8] hover:bg-[#0353a4]"
            disabled={!isFormValid}
          >
            Créer le cours
          </Button>
        </div>
      </form>
    </Form>
  );
}
