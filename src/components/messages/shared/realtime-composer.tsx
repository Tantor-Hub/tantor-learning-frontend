"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Users, Loader2 } from "lucide-react";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { toast } from "react-hot-toast";

interface RealtimeComposerProps {
  onMessageSent?: () => void;
  defaultReceiver?: string;
  defaultSubject?: string;
}

export const RealtimeComposer: React.FC<RealtimeComposerProps> = ({
  onMessageSent,
  defaultReceiver = "",
  defaultSubject = "",
}) => {
  const { isConnected, sendMessage } = useWebSocketContext();

  const [formData, setFormData] = useState({
    receivers: defaultReceiver,
    subject: defaultSubject,
    content: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendMessage = async () => {
    if (!isConnected) {
      toast.error("Non connecté au chat en temps réel");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Le contenu du message est requis");
      return;
    }

    if (!formData.receivers.trim()) {
      toast.error("Au moins un destinataire est requis");
      return;
    }

    setIsLoading(true);

    try {
      // Parse receivers (comma-separated UUIDs or IDs)
      const receiverList = formData.receivers
        .split(",")
        .map((r) => r.trim())
        .filter((r) => r.length > 0);

      await sendMessage({
        id_user_receiver: receiverList,
        subject: formData.subject.trim() || undefined,
        content: formData.content.trim(),
        piece_joint: [], // File attachments can be added later
      });

      // Reset form
      setFormData({
        receivers: defaultReceiver,
        subject: defaultSubject,
        content: "",
      });

      toast.success("Message envoyé en temps réel");
      onMessageSent?.();
    } catch (error) {
      console.error("Error sending real-time message:", error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Nouveau message en temps réel
          {!isConnected && <span className="text-sm text-red-600 font-normal">(Hors ligne)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Receivers */}
        <div className="space-y-2">
          <Label htmlFor="receivers" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Destinataires
          </Label>
          <Input
            id="receivers"
            placeholder="ID utilisateur ou UUID (séparés par des virgules)"
            value={formData.receivers}
            onChange={(e) => handleInputChange("receivers", e.target.value)}
            disabled={isLoading || !isConnected}
          />
          <p className="text-xs text-gray-500">
            Entrez les IDs des destinataires séparés par des virgules
          </p>
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject">Sujet (optionnel)</Label>
          <Input
            id="subject"
            placeholder="Sujet du message"
            value={formData.subject}
            onChange={(e) => handleInputChange("subject", e.target.value)}
            disabled={isLoading || !isConnected}
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content">Contenu *</Label>
          <Textarea
            id="content"
            placeholder="Écrivez votre message ici..."
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading || !isConnected}
            rows={4}
          />
          <p className="text-xs text-gray-500">Appuyez sur Ctrl+Entrée pour envoyer rapidement</p>
        </div>

        {/* Send Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !isConnected || !formData.content.trim()}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isLoading ? "Envoi..." : "Envoyer"}
          </Button>
        </div>

        {/* Connection Warning */}
        {!isConnected && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              ⚠️ Vous n'êtes pas connecté au chat en temps réel. Les messages seront envoyés via
              l'API REST classique.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
