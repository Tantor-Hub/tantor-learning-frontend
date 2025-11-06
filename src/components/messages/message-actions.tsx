"use client";
import { Button } from "@/components/ui/button";
import { Forward, Trash2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReplyMessageDialog } from "./dialog/reply-message-dialog";
import { TransferMessageDialog } from "./dialog/transfer-message-dialog";
import { useDeleteChatMutation, useRestoreChatMutation } from "@/lib/apis/common/chat-api";
import toast from "react-hot-toast";

interface MessageActionsProps {
  messageId: string;
  senderId: string;
  subject: string;
  isDeleted?: boolean;
  content?: string;
}

export function MessageActions({
  messageId,
  senderId,
  subject,
  isDeleted = false,
  content,
}: MessageActionsProps) {
  const router = useRouter();
  const [deleteChat] = useDeleteChatMutation();
  const [restoreChat] = useRestoreChatMutation();

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

  return (
    <div className="flex items-center justify-between gap-4">
      <Button variant={"outline"} onClick={() => router.back()}>
        Retour
      </Button>
      <div className="flex items-center gap-4">
        <ReplyMessageDialog
          messageId={messageId}
          originalSubject={subject}
          recipientId={senderId}
        />
        <TransferMessageDialog
          messageId={messageId}
          originalSubject={subject}
          originalContent={content || ""}
        />
        {isDeleted ? (
          <Button variant={"outline"} onClick={handleRestore} className="flex items-center gap-2">
            <RotateCcw />
            Restaurer
          </Button>
        ) : (
          <Button variant={"outline"} onClick={handleDelete} className="flex items-center gap-2">
            <Trash2 />
            Supprimer
          </Button>
        )}
        {/* Add more actions as needed */}
      </div>
    </div>
  );
}
