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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Reply } from "lucide-react";
import { useCreateMessageMutation } from "@/lib/apis/common/chat-api";
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

const replyFormSchema = z.object({
  subject: z
    .string()
    .min(1, "Le sujet est requis")
    .max(100, "Le sujet ne doit pas dépasser 100 caractères"),
  content: z
    .string()
    .min(1, "Le message est requis")
    .max(1000, "Le message ne doit pas dépasser 1000 caractères"),
  piece_joint: z.array(z.any()).optional(),
});

interface ReplyMessageDialogProps {
  messageId: string;
  originalSubject: string;
  recipientId: string;
}

export function ReplyMessageDialog({
  messageId,
  originalSubject,
  recipientId,
}: ReplyMessageDialogProps) {
  const [createMessage, { isLoading }] = useCreateMessageMutation();

  const form = useForm<z.infer<typeof replyFormSchema>>({
    resolver: zodResolver(replyFormSchema),
    defaultValues: {
      subject: `Re: ${originalSubject}`,
      content: "",
      piece_joint: [],
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof replyFormSchema>) => {
    try {
      const payload: any = {
        subject: values.subject,
        content: values.content,
        id_user_receiver: [recipientId],
        is_replied_to: messageId,
      };

      if (values.piece_joint && values.piece_joint.length > 0) {
        const piece_jointe = await Promise.all(
          values.piece_joint.map(async (file: File) => {
            // Implement file upload logic here
            return file.name;
          })
        );
        payload.piece_jointe = piece_jointe;
      }

      await createMessage(payload).unwrap();
      toast.success("Réponse envoyée");
      form.reset();
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const isFormValid = form.formState.isValid;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"}>
          <Reply /> Répondre
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Répondre au message</AlertDialogTitle>
          <AlertDialogDescription>Composez votre réponse.</AlertDialogDescription>
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
                    <Textarea placeholder="Écrivez votre réponse ici..." {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="piece_joint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pièces jointes (optionnel)</FormLabel>
                  <FormControl>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                          form.setValue("piece_joint", Array.from(files));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel
                type="button"
                onClick={() => {
                  form.reset();
                }}
              >
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
