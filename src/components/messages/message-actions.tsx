"use client";
import { Button } from "@/components/ui/button";
import { Archive, Forward, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import { useArchivedChatMutation } from "@/lib/apis/common/chat-api";
import { toast } from "react-hot-toast";
import { ReplyMessageDialog } from "./dialog/reply-message-dialog";

interface MessageActionsProps {
  messageId: string;
  senderId: string;
  subject: string;
}

export function MessageActions({ messageId, senderId, subject }: MessageActionsProps) {
  const router = useRouter();
  const currentUser = useSelector(selectCurrentUser);
  const [archivedMessage, { isLoading: isLoadingArchived }] = useArchivedChatMutation();

  const handleArchivedMessage = async () => {
    try {
      await archivedMessage({ id: messageId }).unwrap();
      toast("Message Archivé");
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <Button variant={"outline"} onClick={() => router.back()}>
        Retour
      </Button>
      <div className="flex items-center gap-4">
        {currentUser?.id.toString() === senderId ? (
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
        <ReplyMessageDialog
          messageId={messageId}
          originalSubject={subject}
          recipientId={senderId}
        />
        <Button variant={"outline"}>
          <Forward /> Transférer
        </Button>
        {/* Add more actions as needed */}
      </div>
    </div>
  );
}
