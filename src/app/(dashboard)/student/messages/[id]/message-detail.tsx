"use client";
import React from "react";
import { MessageActions } from "@/components/messages/message-actions";
import { useGetChatByIdQuery, useGetRepliesByChatIdQuery } from "@/lib/apis/common/chat-api";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RepliesSkeleton } from "./replies-skeleton";
import { MessageDetailSkeleton } from "@/components/skeletons/message-detail-skeleton";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";

interface MessageDetailProps {
  messageId: string;
}

export function MessageDetail({ messageId }: MessageDetailProps) {
  const router = useRouter();
  const currentUser = useSelector(selectCurrentUser);
  const { data, error, isLoading } = useGetChatByIdQuery({ id: messageId });
  const {
    data: repliesData,
    isLoading: repliesLoading,
    isError: repliesError,
  } = useGetRepliesByChatIdQuery({ chatId: messageId });

  if (repliesError) {
    console.error("Error getting replies by chat id:", repliesError);
  }

  if (isLoading) {
    return <MessageDetailSkeleton />;
  }

  if (error || !data) {
    return (
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <Button variant={"outline"} onClick={() => router.back()}>
            <ChevronLeft /> Retour
          </Button>
        </div>
        <div className="border border-border rounded-lg p-4">
          <p>{error ? "Erreur lors du chargement du message" : "Message non trouvé"}</p>
        </div>
      </div>
    );
  }

  const message = data.data;
  const replies = repliesData?.data.rows || [];

  return (
    <div>
      <MessageActions
        messageId={messageId}
        senderId={message.sender.id.toString()}
        subject={message.subject}
        isDeleted={message.is_deletedto?.includes(Number(currentUser?.id)) || false}
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

      {/* Replies */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Réponses</h3>
        {repliesLoading ? (
          <RepliesSkeleton />
        ) : replies.length > 0 ? (
          replies.map((reply) => (
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
    </div>
  );
}
