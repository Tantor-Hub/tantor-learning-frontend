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

  // Determine if we should use transfer query (when URL has istransfered=true and valid transferId)
  // Check explicitly for "true" string and filter out "null" strings
  const shouldUseTransferQuery = Boolean(
    isTransferredParam === "true" &&
      transferIdParam &&
      transferIdParam !== "null" &&
      transferIdParam !== ""
  );

  // For main message: use useGetTransferQuery when istransfered=true, else use useGetChatByIdQuery
  const {
    data: chatData,
    error: chatError,
    isLoading: chatLoading,
  } = useGetChatByIdQuery({ id: messageId }, { skip: shouldUseTransferQuery });

  const {
    data: transferData,
    error: transferError,
    isLoading: transferLoading,
  } = useGetTransferQuery(
    { id: transferIdParam || "" },
    { skip: !shouldUseTransferQuery || !transferIdParam || transferIdParam === "null" }
  );

  // Determine which data to use
  const data = shouldUseTransferQuery ? transferData : chatData;
  const error = shouldUseTransferQuery ? transferError : chatError;
  const isLoading = shouldUseTransferQuery ? transferLoading : chatLoading;

  // Check if the message is transferred (prioritize URL params as source of truth)
  // Only consider it transferred if explicitly "true", not "false" or other values
  const isTransferred =
    isTransferredParam === "true" || shouldUseTransferQuery || chatData?.data?.isTransferred;

  // Prioritize URL param transferId, then data, then empty string
  // Filter out "null" strings - treat them as invalid
  const finalTransferId =
    transferIdParam && transferIdParam !== "null"
      ? transferIdParam
      : transferData?.data.id && transferData.data.id !== "null"
        ? transferData.data.id
        : chatData?.data?.transferId && chatData.data.transferId !== "null"
          ? chatData.data.transferId
          : "";

  // For replies: use useGetTransferRepliesByIdQuery when transferred, else use useGetRepliesByChatIdQuery
  // Determine if we should skip regular replies (skip if transferred)
  // Only skip if explicitly transferred (istransfered=true), not when false
  const shouldSkipRegularReplies =
    isTransferredParam === "true" || Boolean(isTransferred && Boolean(finalTransferId));

  // Determine if we should skip transfer replies (skip if not transferred or no transferId)
  // Skip if istransfered is explicitly "false" or not "true", or if no valid transferId
  const shouldSkipTransferReplies =
    isTransferredParam === "false" ||
    (isTransferredParam !== "true" && !isTransferred) ||
    !Boolean(finalTransferId) ||
    finalTransferId === "null";

  // Always call both hooks to avoid conditional hook calls
  const {
    data: repliesData,
    isLoading: repliesLoading,
    isError: repliesError,
  } = useGetRepliesByChatIdQuery({ chatId: messageId }, { skip: shouldSkipRegularReplies });

  const {
    data: transferRepliesData,
    isLoading: transferRepliesLoading,
    isError: transferRepliesError,
  } = useGetTransferRepliesByIdQuery({ id: finalTransferId }, { skip: shouldSkipTransferReplies });

  // Use data from API if available, otherwise fall back to URL params (prioritize URL params)
  // Only use transfer replies if explicitly transferred (istransfered=true) with valid transferId
  const shouldUseTransferReplies =
    (isTransferredParam === "true" && transferIdParam && transferIdParam !== "null") ||
    (isTransferred && finalTransferId && finalTransferId !== "null");

  const finalRepliesData = shouldUseTransferReplies ? transferRepliesData : repliesData;
  const finalRepliesLoading = shouldUseTransferReplies ? transferRepliesLoading : repliesLoading;
  const finalRepliesError = shouldUseTransferReplies ? transferRepliesError : repliesError;

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

  // Normalize message data structure (transfer query has data.chat, regular query has data.data)
  const message = shouldUseTransferQuery
    ? transferData?.data.chat
      ? {
          ...transferData.data.chat,
          isTransferred: true,
          transferSender: transferData.data.senderUser,
          sender: transferData.data.chat.sender,
        }
      : undefined
    : chatData?.data;
  const replies = finalRepliesData?.data.rows || [];

  if (!message) {
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
          <p>Message non trouvé</p>
        </div>
      </div>
    );
  }

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

  // Get the correct message ID (for transferred messages, use the chat ID from transfer data)
  const actualMessageId =
    shouldUseTransferQuery && transferData?.data.id_chat ? transferData.data.id_chat : messageId;

  // Get transfer ID for replies (prioritize URL param as source of truth)
  // Filter out "null" strings and ensure we only pass valid transferIds
  const replyTransferId =
    transferIdParam && transferIdParam !== "null"
      ? transferIdParam
      : transferData?.data.id && transferData.data.id !== "null"
        ? transferData.data.id
        : undefined;

  return (
    <div>
      <MessageActions
        messageId={actualMessageId}
        senderId={message.sender?.id || ""}
        subject={message.subject || ""}
        content={message.content || ""}
        hideTransfer={true}
        isTransferred={shouldUseTransferQuery || Boolean(isTransferred)}
        transferId={replyTransferId}
      />

      {/* Main message */}
      <div className="border border-border rounded-lg p-4 mt-4">
        <div className="mb-4">
          <p className="text-primary text-xl font-bold">{message.subject}</p>
          <p className="text-[#979DAC]">
            De :{" "}
            {shouldUseTransferQuery &&
            transferData?.data.senderUser &&
            transferData.data.chat.sender
              ? `${transferData.data.chat.sender.firstName} ${transferData.data.chat.sender.lastName} (Transféré par ${transferData.data.senderUser.firstName} ${transferData.data.senderUser.lastName})`
              : message.isTransferred && message.transferSender && message.sender
                ? `${message.transferSender.firstName} ${message.transferSender.lastName} (Transféré par ${message.sender.firstName} ${message.sender.lastName})`
                : message.sender
                  ? `${message.sender.firstName} ${message.sender.lastName}`
                  : "Inconnu"}
            .{" "}
            {message.createdAt &&
              new Date(message.createdAt).toLocaleDateString("fr-FR", {
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
