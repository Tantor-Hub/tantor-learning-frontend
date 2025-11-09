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
import { useAddEventMutation } from "@/lib/apis/common/planning";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

const formSchema = z
  .object({
    title: z.string().min(1, {
      message: "Veuillez entrer un sujet",
    }),
    description: z.string().min(1, {
      message: "Le message ne doit pas être vide",
    }),
    eventType: z.string().min(1, {
      message: "Veuillez choisir le type d'évènement",
    }),
    startDate: z.string().min(1, {
      message: "Veuillez sélectionner la date de début",
    }),
    endDate: z.string().min(1, {
      message: "Veuillez sélectionner la date de fin",
    }),
  })
  .refine(
    (data) => {
      // Vérifier que la date de fin est après la date de début
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end >= start;
    },
    {
      message: "La date de fin doit être égale ou postérieure à la date de début",
      path: ["endDate"],
    }
  );

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
      startDate: "",
      endDate: "",
    },
    mode: "onChange",
  });
  const isFormValid = form.formState.isValid;

  const handleSubmit = async (data: SupportFormValues) => {
    try {
      // Convertir les dates en format ISO
      const startDate = new Date(data.startDate).toISOString();
      const endDate = new Date(data.endDate).toISOString();

      await addEvent({
        titre: data.title,
        description: data.description,
        type: data.eventType,
        timeline: [startDate, endDate],
      }).unwrap();

      toast.success("Evénement créé");
      form.reset();
    } catch {
      toast.error("Une erreur s'est produite lors de la création de l'événement");
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
                    placeholder="Décrivez l'évènement"
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
                    <SelectItem value="Réunion">Réunion</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel>Date de début</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    className="text-sm font-extralight py-5"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel>Date de fin</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    className="text-sm font-extralight py-5"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
            {isLoading ? <Loader2 className="animate-spin" /> : "Créer l'évènement"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
