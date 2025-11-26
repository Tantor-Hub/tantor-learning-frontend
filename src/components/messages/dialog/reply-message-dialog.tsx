"use client";
import { useState } from "react";
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
import { Loader2, Reply } from "lucide-react";
import { useCreateReplyMutation } from "@/lib/apis/common/chat-api";
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
import { useSearchParams } from "next/navigation";

const replyFormSchema = z.object({
  content: z
    .string()
    .min(1, "Le message est requis")
    .max(1000, "Le message ne doit pas dépasser 1000 caractères"),
});

interface ReplyMessageDialogProps {
  messageId: string;
  isTransferred?: boolean;
  transferId?: string;
}

export function ReplyMessageDialog({
  messageId,
  isTransferred = false,
  transferId,
}: ReplyMessageDialogProps) {
  const [open, setOpen] = useState(false);
  const [createReply, { isLoading }] = useCreateReplyMutation();
  const searchParams = useSearchParams();

  // Check URL params as fallback to ensure we use transfer reply when URL indicates transfer
  const isTransferredParam = searchParams.get("istransfered");
  const transferIdParam = searchParams.get("transferId");

  // Filter out "null" strings and ensure we only use valid transferIds
  const validTransferId = transferId && transferId !== "null" ? transferId : undefined;
  const validTransferIdParam =
    transferIdParam && transferIdParam !== "null" ? transferIdParam : undefined;

  // Determine if we should use transfer reply (check both props and URL params)
  const shouldUseTransferReply =
    (isTransferred && validTransferId) || (Boolean(isTransferredParam) && validTransferIdParam);

  // Use transferId from props first, then fall back to URL param
  // If finalTransferId is null/undefined, we'll use messageId with id_chat instead
  const finalTransferId = validTransferId || validTransferIdParam || undefined;

  const form = useForm<z.infer<typeof replyFormSchema>>({
    resolver: zodResolver(replyFormSchema),
    defaultValues: {
      content: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof replyFormSchema>) => {
    try {
      // Use id_transferechat if we have a valid transferId, otherwise use id_chat with messageId
      // If finalTransferId is null/undefined, fall back to using messageId with id_chat
      const payload = {
        content: values.content,
        ...(shouldUseTransferReply && finalTransferId
          ? { id_transferechat: finalTransferId }
          : { id_chat: messageId }),
        is_public: false,
      };

      await createReply(payload).unwrap();
      toast.success("Réponse envoyée");
      form.reset();
      setOpen(false);
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const isFormValid = form.formState.isValid;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
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

            <AlertDialogFooter>
              <AlertDialogCancel
                type="button"
                onClick={() => {
                  form.reset();
                }}
              >
                Annuler
              </AlertDialogCancel>
              <Button type="submit" disabled={!isFormValid || isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Envoyer"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
