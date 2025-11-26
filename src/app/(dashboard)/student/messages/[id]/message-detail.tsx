"use client";
import React from "react";
import { MessageActions } from "@/components/messages/message-actions";
import {
  useGetChatByIdQuery,
  useGetRepliesByChatIdQuery,
  useGetTransferRepliesByIdQuery,
  useGetTransferQuery,
} from "@/lib/apis/common/chat-api";
import { useRouter } from "next/navigation";
import { RepliesSkeleton } from "./replies-skeleton";
import { MessageDetailSkeleton } from "@/components/skeletons/message-detail-skeleton";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface MessageDetailProps {
  messageId: string;
}

export function MessageDetail({ messageId }: MessageDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isTransferredParam = searchParams.get("istransfered");
  const transferIdParam = searchParams.get("transferId");

  const { data, error, isLoading } = useGetChatByIdQuery({ id: messageId });

  // Use the appropriate query based on isTransferredParam
  const {
    data: repliesData,
    isLoading: repliesLoading,
    isError: repliesError,
  } = useGetRepliesByChatIdQuery({ chatId: messageId }, { skip: Boolean(isTransferredParam) });

  const {
    data: transferRepliesData,
    isLoading: transferRepliesLoading,
    isError: transferRepliesError,
  } = useGetTransferRepliesByIdQuery({ id: transferIdParam || "" }, { skip: !isTransferredParam });

  // Determine which data to use based on the parameter
  const finalRepliesData = isTransferredParam ? transferRepliesData : repliesData;
  const finalRepliesLoading = isTransferredParam ? transferRepliesLoading : repliesLoading;
  const finalRepliesError = isTransferredParam ? transferRepliesError : repliesError;

  if (finalRepliesError) {
    console.error("Error getting replies:", finalRepliesError);
  }

  if (isLoading) {
    return <MessageDetailSkeleton />;
  }

  if (error || !data) {
    return (
      <div>
        <MessageActions
          messageId={messageId}
          senderId=""
          subject=""
          content=""
          hideTransfer={true}
        />
        <div className="border border-border rounded-lg p-4">
          <p>{error ? "Erreur lors du chargement du message" : "Message non trouvé"}</p>
        </div>
      </div>
    );
  }

  const message = data.data;
  const replies = finalRepliesData?.data.rows || [];

  const renderAttachments = () => {
    if (!message.piece_joint || message.piece_joint.length === 0) return null;

    return (
      <div className="mt-4">
        <p className="font-semibold mb-2">Pièces jointes:</p>
        <div className="flex flex-wrap gap-2">
          {message.piece_joint.map((url: string, index: number) => {
            const extension = url.split(".").pop()?.toLowerCase();
            const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "");
            const isPdf = extension === "pdf";

            return (
              <div key={index} className="flex items-center gap-2 p-2 border rounded">
                {isImage ? (
                  <Image
                    src={url}
                    alt={`Attachment ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover cursor-pointer"
                    onClick={() => window.open(url, "_blank")}
                  />
                ) : isPdf ? (
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => window.open(url, "_blank")}
                  >
                    <span className="text-red-500">📄</span>
                    <span>PDF Document</span>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => window.open(url, "_blank")}
                  >
                    <span>📎</span>
                    <span>{extension?.toUpperCase()} File</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderReplies = () => {
    if (finalRepliesLoading) {
      return <RepliesSkeleton />;
    }

    if (replies.length === 0) {
      return <p className="text-muted-foreground">Aucune réponse pour le moment.</p>;
    }

    return replies.map((reply) => (
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
    ));
  };

  return (
    <div>
      <MessageActions
        messageId={messageId}
        senderId={message.sender.id}
        subject={message.subject}
        content={message.content}
        hideTransfer={true}
      />

      {/* Main message */}
      <div className="border border-border rounded-lg p-4 mt-4">
        <div className="mb-4">
          <p className="text-primary text-xl font-bold">{message.subject}</p>
          <p className="text-[#979DAC]">
            De :{" "}
            {message.isTransferred && message.transferSender
              ? `${message.transferSender.firstName} ${message.transferSender.lastName} (Transféré par ${message.sender.firstName} ${message.sender.lastName})`
              : `${message.sender.firstName} ${message.sender.lastName}`}
            .{" "}
            {new Date(message.createdAt).toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <p>{message.content}</p>
        {renderAttachments()}
      </div>

      {/* Replies */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Réponses</h3>
        {renderReplies()}
      </div>
    </div>
  );
}
