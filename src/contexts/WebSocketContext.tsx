"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useWebSocket } from "@/hooks/use-web-socket";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";

interface WebSocketContextType {
  isConnected: boolean;
  socket: any | null;
  onlineUsers: string[];
  currentChatId: string | null;
  messages: any[];
  replies: any[];
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

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider");
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const currentUser = useSelector(selectCurrentUser);
  const webSocket = useWebSocket();

  // Auto-connect when user is authenticated
  useEffect(() => {
    if (currentUser && !webSocket.isConnected) {
      webSocket.connect();
    }
  }, [currentUser, webSocket.isConnected, webSocket.connect]);

  // Auto-disconnect when user logs out
  useEffect(() => {
    if (!currentUser && webSocket.isConnected) {
      webSocket.disconnect();
    }
  }, [currentUser, webSocket.isConnected, webSocket.disconnect]);

  return <WebSocketContext.Provider value={webSocket}>{children}</WebSocketContext.Provider>;
};
