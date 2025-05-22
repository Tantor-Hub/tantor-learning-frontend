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
import { useAddEventMutation } from "@/lib/apis/planning";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Veuillez entrer un sujet",
  }),
  description: z.string().min(1, {
    message: "Le message ne doit pas être vide",
  }),
  author: z.string().min(1, { message: "Veillez choisir l'auteur de l'évènement" }),
  eventType: z.string().min(1, { message: "Veillez choisir le type d'évènement" }),
});

type SupportFormValues = z.infer<typeof formSchema>;

interface NewEventFormProps {
  onCancel: () => void;
}

export function NewEventForm({ onCancel }: NewEventFormProps) {
  const [addEvent, { isLoading }] = useAddEventMutation();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      eventType: "",
      author: "",
    },
    mode: "onChange",
  });
  const isFormValid = form.formState.isValid;

  const handleSubmit = async (data: SupportFormValues) => {
    // console.log(data);
    try {
      await addEvent({
        titre: data.title,
        description: data.description,
        type: data.eventType,
        id_cibling: null,
        timeline: ["2025-05-17T16:09:07.079Z", "2025-05-19T16:09:07.079Z"],
      }).unwrap();
      toast.success("Evenement creer", {
        description: "L'evenement creer vous pouvez le voir dans la liste de vos evenements",
      });
      form.reset();
    } catch {
      toast.error("Erreur", {
        description: "une erreur s'est produite lors de la creatiion de l'evenement",
      });
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
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel>Titre de l'évènement</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder="Entrez le titre de l'évènement"
                    className="text-sm font-extralight py-5"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={10}
                    {...field}
                    placeholder="Decrivez l'évènement"
                    className="min-h-20 max-h-28 overflow-y-auto resize-none text-sm font-extralight"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2.5">
              <FormLabel>Type d'évènement</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full py-5">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent className="font-extralight">
                    <SelectItem value="Cours">Cours</SelectItem>
                    <SelectItem value="Examen">Examen</SelectItem>
                    <SelectItem value="Sortie scolaire">Evènement</SelectItem>
                  </SelectContent>
                </Select>
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
              <FormLabel>Par qui ?</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full py-5">
                    <SelectValue placeholder="Sélectionnez l'auteur" />
                  </SelectTrigger>
                  <SelectContent className="font-extralight">
                    <SelectItem value="Cours">Moi uniquement</SelectItem>
                    <SelectItem value="Examen">Joel</SelectItem>
                    <SelectItem value="Sortie scolaire">Semjo</SelectItem>
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
            className="!p-5 !px-7 border-[#0466C8] text-[#0466C8] cursor-pointer"
            type="button"
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="!p-5 !px-7 bg-[#0466C8] cursor-pointer"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Créér l'évènement"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
