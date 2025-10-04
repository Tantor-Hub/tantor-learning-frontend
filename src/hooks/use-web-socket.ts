"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseWebSocketReturn {
  connect: () => void;
  disconnect: () => void;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  sendMessage: (data: {
    id_user_receiver: string[];
    subject?: string;
    content?: string;
    piece_joint?: string[];
  }) => void;
  sendReply: (data: { id_chat: string; content: string; is_public?: boolean }) => void;
  markAsRead: (chatId: string) => void;
  getOnlineUsers: () => void;
  clearMessages: () => void;
}

export const useWebSocket = (): UseWebSocketReturn => {
  // No-op implementations to remove websocket.io usage
  const noop = () => {};

  return {
    connect: noop,
    disconnect: noop,
    joinChat: noop,
    leaveChat: noop,
    sendMessage: noop,
    sendReply: noop,
    markAsRead: noop,
    getOnlineUsers: noop,
    clearMessages: noop,
  };
};
