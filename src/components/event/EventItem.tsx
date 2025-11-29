"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Event } from "@/types/events";
import { Edit, Trash2, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useGetEventByIdSecretaryQuery } from "@/lib/apis/events";
import { ParticipationInfoModal } from "./ParticipationInfoModal";

interface EventItemProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  isDeleting?: boolean;
}

export function EventItem({ event, onEdit, onDelete, isDeleting = false }: EventItemProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const { data: eventDetails, isLoading: isLoadingDetails } = useGetEventByIdSecretaryQuery(
    { id: event.id },
    { skip: !modalOpen }
  );

  const handleCardClick = () => {
    setModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy", { locale: fr });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "HH:mm", { locale: fr });
    } catch {
      return "";
    }
  };

  const getEventDuration = () => {
    if (!event.ending_date) return null;

    try {
      const start = new Date(event.begining_date);
      const end = new Date(event.ending_date);
      const diffMs = end.getTime() - start.getTime();
      const diffHours = Math.round(diffMs / (1000 * 60 * 60));

      if (diffHours < 1) {
        const diffMinutes = Math.round(diffMs / (1000 * 60));
        return `${diffMinutes} min`;
      } else if (diffHours < 24) {
        return `${diffHours}h`;
      } else {
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        return `${diffDays} jour${diffDays > 1 ? "s" : ""}`;
      }
    } catch {
      return null;
    }
  };

  const isPastEvent = () => {
    try {
      const endDate = event.ending_date
        ? new Date(event.ending_date)
        : new Date(event.begining_date);
      return endDate < new Date();
    } catch {
      return false;
    }
  };

  const duration = getEventDuration();
  const isPast = isPastEvent();

  return (
    <>
      <Card
        className={`hover:shadow-md transition-shadow cursor-pointer ${isPast ? "opacity-75" : ""}`}
        onClick={handleCardClick}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-base flex items-center gap-2">{event.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(event)}
              title="Modifier l'événement"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  title="Supprimer l'événement"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer l'événement</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer l'événement "{event.title}" ? Cette action ne
                    peut pas être annulée.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(event.id)}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? "Suppression..." : "Supprimer"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">{event.description}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Début :</span>
              <span>{formatDate(event.begining_date)}</span>
              <Clock className="w-4 h-4 text-gray-500 ml-2" />
              <span>{event.beginning_hour}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Fin :</span>
              <span>{event.ending_hour}</span>
              {duration && (
                <>
                  <span className="text-gray-400">•</span>
                  <Badge variant="outline" className="text-xs">
                    {duration}
                  </Badge>
                </>
              )}
            </div>
          </div>

          {event.trainingSessions && event.trainingSessions.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-gray-700 mb-2">Sessions liées :</p>
              <div className="flex flex-wrap gap-2">
                {event.trainingSessions.map((session) => (
                  <Badge key={session.id} variant="secondary" className="text-xs">
                    {session.title}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ParticipationInfoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        participationInfo={eventDetails?.data?.participationInfo}
        isLoading={isLoadingDetails}
        eventTitle={event.title}
      />
    </>
  );
}
