"use client";
import React from "react";
import { MessageActions } from "@/components/messages/message-actions";
import { useGetChatByIdQuery } from "@/lib/apis/common/chat-api";
import { Loader2 } from "lucide-react";

interface MessageDetailProps {
  messageId: string;
}

export function MessageDetail({ messageId }: MessageDetailProps) {
  const { data, error, isLoading } = useGetChatByIdQuery({ id: messageId });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (error || !data) {
    return <div>Error loading message</div>;
  }

  const message = data.data;

  return (
    <div>
      <MessageActions
        messageId={messageId}
        senderId={message.sender.id.toString()}
        subject={message.subject}
      />

      {/* Main message */}
      <div className="border border-border rounded-lg p-4 mt-4">
        <div className="mb-4">
          <p className="text-primary text-xl font-bold">{message.subject}</p>
          <p className="text-[#979DAC]">
            De : {message.sender.firstName} {message.sender.lastName}.{" "}
            {new Date(message.createdAt).toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <p>{message.content}</p>
      </div>
    </div>
  );
}
