"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Zap, Users, MessageCircle, Bell, Wifi, ChevronDown, ChevronUp } from "lucide-react";
import { useWebSocketContext } from "@/contexts/WebSocketContext";

export const WebSocketGuide: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isConnected, onlineUsers } = useWebSocketContext();

  const features = [
    {
      icon: <Zap className="w-5 h-5 text-yellow-600" />,
      title: "Messages en temps réel",
      description: "Envoyez et recevez des messages instantanément sans actualiser la page",
    },
    {
      icon: <Users className="w-5 h-5 text-blue-600" />,
      title: "Utilisateurs en ligne",
      description: "Voyez qui est connecté en temps réel",
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-green-600" />,
      title: "Réponses instantanées",
      description: "Répondez aux messages avec une latence minimale",
    },
    {
      icon: <Bell className="w-5 h-5 text-purple-600" />,
      title: "Notifications push",
      description: "Recevez des notifications pour les nouveaux messages",
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wifi className={`w-5 h-5 ${isConnected ? "text-green-600" : "text-red-600"}`} />
            Chat en temps réel
            <Badge variant={isConnected ? "default" : "destructive"} className="ml-2">
              {isConnected ? "Connecté" : "Déconnecté"}
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
              />
              <span className="text-sm font-medium">
                {isConnected ? "Connecté au serveur WebSocket" : "Déconnecté du serveur"}
              </span>
            </div>
            {isConnected && (
              <Badge variant="secondary">{onlineUsers.length} utilisateurs en ligne</Badge>
            )}
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Info className="w-4 h-4" />
              Fonctionnalités disponibles
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {feature.icon}
                  <div>
                    <h5 className="font-medium text-sm">{feature.title}</h5>
                    <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="space-y-2">
            <h4 className="font-medium">Comment utiliser :</h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• La connexion se fait automatiquement quand vous êtes connecté</li>
              <li>• Activez le mode temps réel lors de l'envoi de réponses</li>
              <li>• Les notifications apparaissent automatiquement pour les nouveaux messages</li>
              <li>• Le statut de connexion est visible en haut à droite</li>
            </ul>
          </div>

          {!isConnected && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Vous n'êtes pas connecté au chat en temps réel. Vérifiez votre connexion internet
                ou contactez l'administrateur.
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
