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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Paperclip, Plus } from "lucide-react";
import { useCreateMessageMutation } from "@/lib/apis/messages-api";
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

const messageFormSchema = z.object({
  subject: z
    .string()
    .min(1, "Le sujet est requis")
    .max(100, "Le sujet ne doit pas dépasser 100 caractères"),
  content: z
    .string()
    .min(1, "Le message est requis")
    .max(1000, "Le message ne doit pas dépasser 1000 caractères"),
  attachment: z.any().optional(),
});

export function NewMessageAlert() {
  const [createMessage, { isLoading }] = useCreateMessageMutation();

  const form = useForm<z.infer<typeof messageFormSchema>>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      subject: "",
      content: "",
    },
    mode: "onChange", // Validation en temps réel
  });

  const onSubmit = async (values: z.infer<typeof messageFormSchema>) => {
    console.log("Form data:", values);
    try {
      const promise = await createMessage(values).unwrap();
      toast.success("Message envoye", {
        description: "Message envoye avec success",
      });
      console.log(promise);
      form.reset();
    } catch (e: any) {
      toast.error(`${e.name}`, {
        description: `${e.message}`,
      });
    }
  };

  // Vérifie si le formulaire est valide
  const isFormValid = form.formState.isValid;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg">
          <Plus className="mr-2 h-4 w-4" /> Nouveau Message
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Nouveau Message</AlertDialogTitle>
          <AlertDialogDescription>
            Ce message sera visible par tous les étudiants, formateurs, administrateurs et
            secrétaires.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sujet</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez le sujet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Écrivez votre message ici..." {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attachment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Button
                      variant="ghost"
                      type="button"
                      className="space-x-2 flex justify-start items-center hover:cursor-pointer"
                      onClick={() => document.getElementById("attachment")?.click()}
                    >
                      <Paperclip size={16} />
                      <span>Attachez une pièce jointe</span>
                    </Button>
                    {field.value?.name && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Fichier sélectionné: {field.value.name}
                      </p>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="attachment"
                      type="file"
                      className="hidden"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
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
                disabled={!isFormValid || form.formState.isSubmitting || isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Envoyer"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
