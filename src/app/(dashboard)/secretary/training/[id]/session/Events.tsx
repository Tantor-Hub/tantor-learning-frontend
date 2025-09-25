"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Events() {
  // Placeholder content - in a real app, this would fetch events data
  const events = [
    { id: 1, title: "Atelier pratique", date: "15/01/2024", time: "14:00", type: "Atelier" },
    {
      id: 2,
      title: "Session de questions-réponses",
      date: "20/01/2024",
      time: "16:00",
      type: "Q&A",
    },
    {
      id: 3,
      title: "Présentation finale",
      date: "30/01/2024",
      time: "10:00",
      type: "Présentation",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Événements de la session</h3>
      {events.map((event) => (
        <Card key={event.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">{event.title}</CardTitle>
            <Badge variant="outline">{event.type}</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <span>Date: {event.date}</span>
              <span>Heure: {event.time}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
