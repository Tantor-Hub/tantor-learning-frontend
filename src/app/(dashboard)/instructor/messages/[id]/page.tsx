"use client";
import React, { use } from "react";
import { MessageActions } from "@/components/messages/message-actions";
import { MessageDetailSkeleton } from "@/components/skeletons/message-detail-skeleton";
import { useGetChatByIdQuery } from "@/lib/apis/common/chat-api";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  // We need to fetch the message to get senderId and subject to pass to MessageActions
  const { data, error, isLoading } = useGetChatByIdQuery({ id });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Error loading message</div>;
  }

  const message = data.data;

  return (
    <React.Suspense fallback={<MessageDetailSkeleton />}>
      <MessageActions
        messageId={id}
        senderId={message.Sender.id.toString()}
        subject={message.subject}
      />
    </React.Suspense>
  );
}
