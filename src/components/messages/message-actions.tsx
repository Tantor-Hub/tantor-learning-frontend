"use client";
import { Button } from "@/components/ui/button";
import { Forward } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReplyMessageDialog } from "./dialog/reply-message-dialog";

interface MessageActionsProps {
  messageId: string;
  senderId: string;
  subject: string;
}

export function MessageActions({ messageId, senderId, subject }: MessageActionsProps) {
  const router = useRouter();

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
        <Button variant={"outline"}>
          <Forward /> Transférer
        </Button>
        {/* Add more actions as needed */}
      </div>
    </div>
  );
}
