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

  // Determine connection status if possible
  const isConnected = false; // Default false, update if webSocket provides status

  // Auto-connect when user is authenticated
  useEffect(() => {
    if (currentUser && !isConnected) {
      webSocket.connect();
    }
  }, [currentUser, webSocket, isConnected]);

  // Auto-disconnect when user logs out
  useEffect(() => {
    if (!currentUser && isConnected) {
      webSocket.disconnect();
    }
  }, [currentUser, webSocket, isConnected]);

  // Compose context value to match WebSocketContextType interface
  const contextValue = {
    isConnected,
    socket: null,
    onlineUsers: [],
    currentChatId: null,
    messages: [],
    replies: [],
    connect: webSocket.connect,
    disconnect: webSocket.disconnect,
    joinChat: webSocket.joinChat || (() => {}),
    leaveChat: webSocket.leaveChat || (() => {}),
    sendMessage: webSocket.sendMessage || (() => {}),
    sendReply: webSocket.sendReply || (() => {}),
    markAsRead: webSocket.markAsRead || (() => {}),
    getOnlineUsers: webSocket.getOnlineUsers || (() => {}),
    clearMessages: webSocket.clearMessages || (() => {}),
  };

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>;
};
