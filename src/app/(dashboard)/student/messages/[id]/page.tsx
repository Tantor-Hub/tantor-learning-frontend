"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Archive, Reply, Forward, Loader2, Send } from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { Loading } from "@/components/shared/loading";
import {
  useGetMessageByIdQuery,
  useArchivedChatMutation,
  useCreateMessageMutation,
  useListChatTreadQuery,
} from "@/lib/apis/common/chat-api";
import { DeleteMessageDialog } from "@/components/messages/dialog/delete-message-dialog";
import { toast } from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";

function MessageActions() {
  const router = useRouter();
  const currentUser = useSelector(selectCurrentUser);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const messageId = params.id as string;
  const threadId = searchParams.get("threadId") as string;

  // Fetch message data
  const {
    data: message,
    isLoading,
    isError,
  } = useGetMessageByIdQuery({ id: messageId }, { skip: !messageId });

  // Fetch thread data
  const {
    data: treadData,
    isLoading: isLoadingTreadData,
    refetch: refetchThread,
  } = useListChatTreadQuery({ id: threadId }, { skip: !threadId && !message?.data.thread });

  const [archivedMessage, { isLoading: isLoadingArchived }] = useArchivedChatMutation();
  const [sendReplyMessage, { isLoading: isLoadingSendReply }] = useCreateMessageMutation();

  useEffect(() => {
    // If we have a message but no explicit threadId, refetch with the message's thread
    if (message?.data.thread && !threadId) {
      refetchThread();
    }
  }, [message, threadId, refetchThread]);

  if (isLoading) return <Loading />;
  if (isError) return <div>Erreur lors du chargement du message</div>;
  if (!message) return <div>Message non trouvé</div>;

  const handleArchivedMessage = async () => {
    try {
      await archivedMessage({ id: messageId }).unwrap();
      toast("Message Archivé");
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

    try {
      await sendReplyMessage({
        id_user_receiver: [String(message?.data.Receiver.id)],
        is_replied_to: messageId,
        content: replyContent,
        thread: message?.data.thread,
      }).unwrap();

      toast.success("Réponse envoyée");
      setReplyContent("");
      setIsReplying(false);
      refetchThread(); // Refresh the thread after sending a reply
    } catch (error) {
      toast.error("Erreur lors de l'envoi de la réponse");
    }
  };

  // Get all messages in the thread, sorted by date (newest first)
  const threadMessages = treadData?.data?.list || [];
  const sortedMessages = [...threadMessages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Find the original message in the thread (the one without is_replied_to or the first one)
  const originalMessage =
    threadMessages.find((msg) => !msg.is_replied_to) ||
    (threadMessages.length > 0 ? threadMessages[threadMessages.length - 1] : null);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <Button variant={"outline"} onClick={() => router.back()}>
          <ChevronLeft /> Retour
        </Button>
        <div className="flex items-center gap-4">
          {currentUser?.id.toString() === message.data.Sender.id.toString() ? (
            <Button variant={"outline"} onClick={handleArchivedMessage}>
              {!isLoadingArchived ? (
                <>
                  <Archive /> Archiver
                </>
              ) : (
                <Loader2 className="animate-spin" />
              )}
            </Button>
          ) : null}
          <Button variant={"outline"} onClick={handleReply}>
            <Reply /> Répondre
          </Button>
          <Button variant={"outline"}>
            <Forward /> Transférer
          </Button>
          {currentUser?.id.toString() === message.data.Sender.id.toString() ? (
            <DeleteMessageDialog id={messageId} />
          ) : null}
        </div>
      </div>

      {/* Main message */}
      <div className="border border-border rounded-lg p-4 mt-4">
        <div className="mb-4">
          <p className="text-primary text-xl font-bold">{message.data.subject}</p>
          <p className="text-[#979DAC]">
            De : {message.data.Sender.firstName}
            {" - "}
            {message.data.Sender.roles.length > 0
              ? message.data.Sender.roles.map((r) => r.role).join(", ")
              : ""}
            .{" "}
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

      {/* Thread messages */}
      {sortedMessages.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="font-medium">Conversation</h3>
          {sortedMessages.map((msg) => (
            <div key={msg.id} className="border border-border rounded-lg p-4">
              <div className="mb-2">
                <p className="text-[#979DAC]">
                  De : {msg.Sender.firstName}
                  {" - "}
                  {msg.Sender.roles.length > 0
                    ? msg.Sender.roles.map((r) => r.role).join(", ")
                    : ""}
                  .{" "}
                  {new Date(msg.createdAt).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>
      )}

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

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <MessageActions />
    </Suspense>
  );
}
