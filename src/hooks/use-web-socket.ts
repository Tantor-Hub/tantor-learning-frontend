"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { selectToken, selectCurrentUser } from "@/features/auth/auth-slice";
import {
  WebSocketChatMessage,
  WebSocketChatReply,
  WebSocketUser,
  WebSocketState,
} from "@/types/websocket/chat";
// import { toast } from "react-hot-toast";

interface UseWebSocketReturn extends WebSocketState {
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
  const token = useSelector(selectToken);
  const currentUser = useSelector(selectCurrentUser);

  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    socket: null,
    onlineUsers: [],
    currentChatId: null,
    messages: [],
    replies: [],
  });

  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (!token) {
      console.warn("No token available for WebSocket connection");
      return;
    }

    if (socketRef.current?.connected) {
      console.log("WebSocket already connected");
      return;
    }

    // Disconnect existing connection if any
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const wsUrl =
      process.env.NODE_ENV === "production"
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/chat`
        : "http://localhost:3000/chat";

    const newSocket = io(wsUrl, {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
      timeout: 20000,
    });

    // Connection events
    newSocket.on("connect", () => {
      setState((prev) => ({ ...prev, isConnected: true, socket: newSocket }));
      console.log("Connected to chat server");
    });

    newSocket.on("disconnect", (reason) => {
      setState((prev) => ({ ...prev, isConnected: false }));
      console.log("Disconnected from chat server:", reason);

      // Auto-reconnect on unexpected disconnection
      if (reason === "io server disconnect") {
        // Server disconnected, don't reconnect automatically
        // toast.error("Connexion au chat fermée par le serveur");
      } else {
        // Client disconnected, try to reconnect
        setTimeout(() => {
          if (token) {
            connect();
          }
        }, 5000);
      }
    });

    newSocket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      setState((prev) => ({ ...prev, isConnected: false }));
      // toast.error("Erreur de connexion au chat");
    });

    // Authentication events
    newSocket.on("connected", (data: { user: WebSocketUser }) => {
      console.log("Authenticated as:", data.user.email);
      // toast.success("Connecté au chat en temps réel");
    });

    newSocket.on("error", (data: { message: string }) => {
      console.error("WebSocket error:", data.message);
      // toast.error(`Erreur chat: ${data.message}`);
    });

    // Message events
    newSocket.on("new_message", (data: { data: WebSocketChatMessage; sender: WebSocketUser }) => {
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, data.data],
      }));

      // Show notification if message is not from current user
      if (data.sender.id !== currentUser?.id?.toString()) {
        // toast.success(`Nouveau message de ${data.sender.fs_name}`);
      }
    });

    newSocket.on("message_sent", (data: { data: WebSocketChatMessage }) => {
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, data.data],
      }));
    });

    // Reply events
    newSocket.on("reply_received", (data: { data: WebSocketChatReply; sender: WebSocketUser }) => {
      setState((prev) => ({
        ...prev,
        replies: [...prev.replies, data.data],
      }));

      // Show notification if reply is not from current user
      if (data.sender.id !== currentUser?.id?.toString()) {
        // toast.success(`Nouvelle réponse de ${data.sender.fs_name}`);
      }
    });

    newSocket.on("reply_sent", (data: { data: WebSocketChatReply }) => {
      setState((prev) => ({
        ...prev,
        replies: [...prev.replies, data.data],
      }));
    });

    // Chat room events
    newSocket.on("joined_chat", (data: { chatId: string }) => {
      setState((prev) => ({ ...prev, currentChatId: data.chatId }));
      console.log("Joined chat:", data.chatId);
    });

    newSocket.on("left_chat", (data: { chatId: string }) => {
      setState((prev) => ({
        ...prev,
        currentChatId: prev.currentChatId === data.chatId ? null : prev.currentChatId,
      }));
      console.log("Left chat:", data.chatId);
    });

    // Read receipt events
    newSocket.on("message_read", (data: { chatId: string; readBy: WebSocketUser }) => {
      console.log("Message read by:", data.readBy.fs_name);
    });

    newSocket.on("marked_as_read", (data: { chatId: string }) => {
      console.log("Marked as read:", data.chatId);
    });

    // Online users events
    newSocket.on("online_users", (data: { users: string[] }) => {
      setState((prev) => ({ ...prev, onlineUsers: data.users }));
    });

    socketRef.current = newSocket;
  }, [token, currentUser?.id]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setState((prev) => ({
        ...prev,
        isConnected: false,
        socket: null,
        currentChatId: null,
      }));
    }
  }, []);

  const joinChat = useCallback((chatId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("join_chat", { chatId });
    }
  }, []);

  const leaveChat = useCallback((chatId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("leave_chat", { chatId });
    }
  }, []);

  const sendMessage = useCallback(
    (data: {
      id_user_receiver: string[];
      subject?: string;
      content?: string;
      piece_joint?: string[];
    }) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("send_message", data);
      } else {
        // toast.error("Non connecté au chat");
      }
    },
    []
  );

  const sendReply = useCallback(
    (data: { id_chat: string; content: string; is_public?: boolean }) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("send_reply", data);
      } else {
        // toast.error("Non connecté au chat");
      }
    },
    []
  );

  const markAsRead = useCallback((chatId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("mark_as_read", { chatId });
    }
  }, []);

  const getOnlineUsers = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("get_online_users");
    }
  }, []);

  const clearMessages = useCallback(() => {
    setState((prev) => ({ ...prev, messages: [], replies: [] }));
  }, []);

  // Auto-connect when token is available
  useEffect(() => {
    if (token && !state.isConnected) {
      connect();
    }
  }, [token, state.isConnected, connect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    joinChat,
    leaveChat,
    sendMessage,
    sendReply,
    markAsRead,
    getOnlineUsers,
    clearMessages,
  };
};
