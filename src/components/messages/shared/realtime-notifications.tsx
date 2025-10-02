"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Users, Wifi, WifiOff } from "lucide-react";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { toast } from "react-hot-toast";

export const RealtimeNotifications: React.FC = () => {
  const { isConnected, onlineUsers, messages, replies, getOnlineUsers, connect, disconnect } =
    useWebSocketContext();

  const [unreadCount, setUnreadCount] = useState(0);

  // Update unread count when new messages arrive
  useEffect(() => {
    setUnreadCount(messages.length + replies.length);
  }, [messages.length, replies.length]);

  const handleToggleConnection = () => {
    if (isConnected) {
      disconnect();
      toast.success("Déconnecté du chat en temps réel");
    } else {
      connect();
    }
  };

  const handleRefreshOnlineUsers = () => {
    getOnlineUsers();
  };

  return (
    <div className="flex items-center gap-2">
      {/* Connection Status */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggleConnection}
        className={`flex items-center gap-2 ${
          isConnected
            ? "text-green-600 border-green-200 hover:bg-green-50"
            : "text-red-600 border-red-200 hover:bg-red-50"
        }`}
      >
        {isConnected ? (
          <>
            <Wifi className="w-4 h-4" />
            En ligne
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            Hors ligne
          </>
        )}
      </Button>

      {/* Online Users Count */}
      {isConnected && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshOnlineUsers}
          className="flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          <span>{onlineUsers.length}</span>
          <Badge variant="secondary" className="ml-1">
            en ligne
          </Badge>
        </Button>
      )}

      {/* Unread Messages Count */}
      {unreadCount > 0 && (
        <div className="flex items-center gap-1">
          <Bell className="w-4 h-4 text-blue-600" />
          <Badge variant="default" className="bg-blue-600">
            {unreadCount}
          </Badge>
        </div>
      )}
    </div>
  );
};
