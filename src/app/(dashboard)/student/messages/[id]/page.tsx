"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Archive, Reply, Forward, Loader2, Send } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Loading } from "@/components/shared/loading";
import {
  useGetMessageByIdQuery,
  useArchivedChatMutation,
  useCreateMessageMutation,
} from "@/lib/apis/common/chat-api";
import { DeleteMessageDialog } from "@/components/messages/dialog/delete-message-dialog";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

function MessageActions() {
  const router = useRouter();
  const params = useParams();
  const messageId = params.id as string;
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [replies, setReplies] = useState<{ content: string; date: Date }[]>([]);

  const {
    data: message,
    isLoading,
    isError,
  } = useGetMessageByIdQuery(
    { id: messageId },
    { skip: !messageId } // Skip if no messageId
  );

  const [archivedMessage, { isLoading: isLoadingArchived }] = useArchivedChatMutation();
  const [sendReplyMessage, { isLoading: isLoadingSendReply }] = useCreateMessageMutation();
  const handleArchivedMessage = async () => {
    try {
      await archivedMessage({ id: messageId }).unwrap();
      toast.info("Message Archivé");
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const handleReply = () => {
    setIsReplying(true);
  };

  const handleSendReply = async () => {
    if (replyContent.trim() === "") {
      toast.error("Le message ne peut pas être vide");
      return;
    }
    const promise = sendReplyMessage({
      id_user_receiver: String(message?.data.Receiver.id),
      subject: String(message?.data.subject),
      is_replied_to: messageId,
      content: replyContent,
    }).unwrap();
    // console.log(promise);
    // Ici vous devriez normalement appeler une API pour enregistrer la réponse
    // Pour l'exemple, nous l'ajoutons simplement à l'état local
    // const newReply = {
    //   content: replyContent,
    //   date: new Date(),
    // };

    // setReplies([...replies, newReply]);
    // setReplyContent("");
    // setIsReplying(false);
    toast.success("Réponse envoyée");
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Erreur lors du chargement du message</div>;
  if (!message) return <div>Message non trouvé</div>;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <Button variant={"outline"} onClick={() => router.back()}>
          <ChevronLeft /> Retour
        </Button>
        <div className="flex items-center gap-4">
          <Button variant={"outline"} onClick={handleArchivedMessage}>
            {!isLoadingArchived ? (
              <>
                <Archive /> Archiver
              </>
            ) : (
              <Loader2 className="animate-spin" />
            )}
          </Button>
          <Button variant={"outline"} onClick={handleReply}>
            <Reply /> Répondre
          </Button>
          <Button variant={"outline"}>
            <Forward /> Transférer
          </Button>
          <DeleteMessageDialog id={messageId} />
        </div>
      </div>

      <div className="border border-border rounded-lg p-4 mt-4">
        <div className="mb-4">
          <p className="text-primary text-xl font-bold">{message.data.subject}</p>
          <p className="text-[#979DAC]">
            De : {message.data.Sender.fs_name} (Role,formateur).{" "}
            {new Date(message.data.createdAt).toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <p>{message.data.content}</p>
      </div>

      {/* Liste des réponses */}
      {replies.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="font-medium">Réponses</h3>
          {replies.map((reply, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="mb-2">
                <p className="text-[#979DAC] text-sm">
                  {reply.date.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <p>{reply.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Zone de réponse */}
      {isReplying && (
        <div className="mt-6 space-y-2">
          <Textarea
            placeholder="Écrivez votre réponse ici..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsReplying(false)}>
              Annuler
            </Button>
            <Button onClick={handleSendReply}>
              <Send className="mr-2 h-4 w-4" /> Envoyer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <MessageActions />
    </Suspense>
  );
}
