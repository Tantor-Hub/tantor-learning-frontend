"use client";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Archive,
  Reply,
  Forward,
  Loader2,
  Send,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import {
  useGetChatByIdQuery,
  useArchivedChatMutation,
  useCreateMessageMutation,
  useGetRepliesByChatIdQuery,
  useCreateReplyMutation,
  useDeleteChatMutation,
  useRestoreChatMutation,
  useMarkAsReadMutation,
} from "@/lib/apis/common/chat-api";
import { DeleteMessageDialog } from "@/components/messages/dialog/delete-message-dialog";
import { toast } from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { RepliesSkeleton } from "./replies-skeleton";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import { MessageActionsSkeleton } from "./message-actions-skeleton";
interface MessageActionsProps {
  messageId: string;
}

export function MessageActions({ messageId }: MessageActionsProps) {
  const router = useRouter();
  const currentUser = useSelector(selectCurrentUser);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const [deleteChat] = useDeleteChatMutation();
  const [restoreChat] = useRestoreChatMutation();

  // Fetch message data
  const {
    data: message,
    isLoading,
    isError,
  } = useGetChatByIdQuery({ id: messageId }, { skip: !messageId });

  const [archivedMessage, { isLoading: isLoadingArchived }] = useArchivedChatMutation();
  const [sendReplyMessage, { isLoading: isLoadingSendReply }] = useCreateReplyMutation();
  const [markAsRead] = useMarkAsReadMutation();
  const {
    data: repliesData,
    isLoading: repliesLoading,
    isError: repliesError,
  } = useGetRepliesByChatIdQuery({ chatId: messageId });

  if (repliesError) {
    console.error("Error getting replies by chat id:", repliesError);
  }

  if (isLoading) return <MessageActionsSkeleton />;

  if (isError) {
    return (
      <div>
        <div className="flex items-center justify-between gap-4">
          <Button variant={"outline"} onClick={() => router.back()}>
            <ChevronLeft /> Retour
          </Button>
        </div>
        <div className="border border-border rounded-lg p-4 mt-4">
          <p>Erreur lors du chargement du message</p>
        </div>
      </div>
    );
  }

  if (!message || !message.data) {
    return (
      <div>
        <div className="flex items-center justify-between gap-4">
          <Button variant={"outline"} onClick={() => router.back()}>
            <ChevronLeft /> Retour
          </Button>
        </div>
        <div className="border border-border rounded-lg p-4 mt-4">
          <p>Message non trouvé</p>
        </div>
      </div>
    );
  }

  const msg = message.data;
  const replies = repliesData?.data.rows || [];

  const handleArchivedMessage = async () => {
    try {
      await archivedMessage({ id: messageId }).unwrap();
      toast("Message Archivé");
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteChat({ id: messageId }).unwrap();
      toast.success("Message supprimé avec succès.");
      router.back();
    } catch (error) {
      toast.error("Une erreur est survenue lors de la suppression du message.");
    }
  };

  const handleRestore = async () => {
    try {
      await restoreChat({ id: messageId }).unwrap();
      toast.success("Message restauré avec succès.");
      router.back();
    } catch (error) {
      toast.error("Une erreur est survenue lors de la restauration du message.");
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

    try {
      await sendReplyMessage({
        content: replyContent,
        id_chat: messageId,
        is_public: true, // Assuming replies are public by default
      }).unwrap();

      toast.success("Réponse envoyée");
      setReplyContent("");
      setIsReplying(false);
    } catch (error) {
      toast.error("Erreur lors de l'envoi de la réponse");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <Button variant={"outline"} onClick={() => router.back()}>
          <ChevronLeft /> Retour
        </Button>
        <div className="flex items-center gap-4">
          {currentUser?.id.toString() === msg.sender.id.toString()
            ? null
            : /* Remove the offline/archive button as per user request */
              /*
            <Button variant={"outline"} onClick={handleArchivedMessage}>
              {!isLoadingArchived ? (
                <>
                  <Archive /> Archiver
                </>
              ) : (
                <Loader2 className="animate-spin" />
              )}
            </Button>
            */
              null}
          <Button variant={"outline"} onClick={handleReply}>
            <Reply /> Répondre
          </Button>
          {/* Transfer button commented out */}
          {/* <Button variant={"outline"}>
            <Forward /> Transférer
          </Button> */}
          <Button variant={"outline"} onClick={handleDelete} className="flex items-center gap-2">
            <Trash2 />
            Supprimer
          </Button>
          {currentUser?.id.toString() === msg.sender.id.toString() ? (
            <DeleteMessageDialog id={messageId} />
          ) : null}
        </div>
      </div>

      {/* Main message */}
      <div className="border border-border rounded-lg p-4 mt-4">
        <div className="mb-4">
          <p className="text-primary text-xl font-bold">{msg.subject || "Message"}</p>
          <p className="text-[#979DAC]">
            De : {msg.sender.firstName} {msg.sender.lastName}.{" "}
            {new Date(msg.createdAt).toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <p>{msg.content}</p>
      </div>

      {/* Replies */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Réponses</h3>
        {repliesLoading ? (
          <RepliesSkeleton />
        ) : replies.length > 0 ? (
          replies.map((reply: any) => (
            <div key={reply.id} className="border border-border rounded-lg p-4 mb-4">
              <div className="mb-2">
                <p className="text-primary font-medium">
                  {reply.sender.firstName} {reply.sender.lastName}
                </p>
                <p className="text-[#979DAC] text-sm">
                  {new Date(reply.createdAt).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <p>{reply.content}</p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">Aucune réponse pour le moment.</p>
        )}
      </div>

      {/* Reply area */}
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
            <Button onClick={handleSendReply} disabled={isLoadingSendReply}>
              {isLoadingSendReply ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Envoyer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
