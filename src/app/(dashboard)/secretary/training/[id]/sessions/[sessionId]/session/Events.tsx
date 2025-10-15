"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useGetEventsBySessionQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} from "@/lib/apis/events";
import { Event, CreateEventRequest, UpdateEventRequest } from "@/types/events";
import { EventEditor } from "@/components/event/EventEditor";
import { EventItem } from "@/components/event/EventItem";

export default function Events() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [eventEditorOpen, setEventEditorOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const {
    data: eventsData,
    isLoading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  } = useGetEventsBySessionQuery({ sessionId });

  const [createEvent, { isLoading: creating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: updating }] = useUpdateEventMutation();
  const [deleteEvent, { isLoading: deleting }] = useDeleteEventMutation();
  const events = eventsData?.data || [];

  const handleCreateEvent = () => {
    console.log("handleCreateEvent called");
    setEditingEvent(null);
    setEventEditorOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventEditorOpen(true);
  };

  const handleSaveEvent = async (
    data: CreateEventRequest | UpdateEventRequest | (CreateEventRequest & { courseId: string })
  ) => {
    try {
      if (editingEvent) {
        // Update existing event - ensure only allowed fields are sent
        const updateData: UpdateEventRequest = {
          id: (data as UpdateEventRequest).id,
          title: (data as UpdateEventRequest).title,
          description: (data as UpdateEventRequest).description,
          begining_date: (data as UpdateEventRequest).begining_date,
          beginning_hour: (data as UpdateEventRequest).beginning_hour,
          ending_hour: (data as UpdateEventRequest).ending_hour,
          ending_date: (data as UpdateEventRequest).ending_date,
        };
        await updateEvent(updateData).unwrap();
        toast.success("Emploi du temps mis à jour avec succès !");
      } else {
        // Create new event with courseId
        const { courseId, ...eventData } = data as CreateEventRequest & { courseId: string };
        await createEvent({ courseId, ...eventData }).unwrap();
        toast.success("Emploi du temps créé avec succès !");
      }
      setEventEditorOpen(false);
      setEditingEvent(null);
    } catch (error: any) {
      console.error("Error saving event:", error);

      // Show detailed error information
      if (error?.data?.message) {
        toast.error(`Erreur : ${error.data.message}`);
      } else if (error?.data?.error) {
        toast.error(`Erreur : ${error.data.error}`);
      } else if (error?.status === 404) {
        toast.error(
          "Point de terminaison API introuvable. Veuillez vérifier la configuration du serveur."
        );
      } else if (error?.status === 400) {
        toast.error("Données invalides fournies. Veuillez vérifier tous les champs requis.");
      } else if (error?.status === 401) {
        toast.error("Authentification requise. Veuillez vous reconnecter.");
      } else if (error?.status === 403) {
        toast.error("Accès refusé. Vous n'avez pas la permission de gérer les emplois du temps.");
      } else {
        toast.error(
          `Échec de la sauvegarde de l'emploi du temps : ${error?.message || "Erreur inconnue"}`
        );
      }
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent({ id: eventId }).unwrap();
      toast.success("Emploi du temps supprimé avec succès !");
    } catch (error: any) {
      console.error("Error deleting event:", error);

      if (error?.data?.message) {
        toast.error(`Erreur : ${error.data.message}`);
      } else if (error?.data?.error) {
        toast.error(`Erreur : ${error.data.error}`);
      } else if (error?.status === 404) {
        toast.error("Emploi du temps introuvable ou déjà supprimé.");
      } else if (error?.status === 401) {
        toast.error("Authentification requise. Veuillez vous reconnecter.");
      } else if (error?.status === 403) {
        toast.error(
          "Accès refusé. Vous n'avez pas la permission de supprimer les emplois du temps."
        );
      } else {
        toast.error(
          `Échec de la suppression de l'emploi du temps : ${error?.message || "Erreur inconnue"}`
        );
      }
    }
  };

  const handleCancel = () => {
    setEditingEvent(null);
    setEventEditorOpen(false);
  };

  const handleRefresh = () => {
    refetchEvents();
    toast.success("Emplois du temps actualisés !");
  };

  if (eventsLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (eventsError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Emplois du temps de la Session</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
            <Button onClick={handleCreateEvent} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un Emploi du temps
            </Button>
          </div>
        </div>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Échec du chargement des emplois du temps</p>
                <p className="text-sm text-red-500">
                  Échec du chargement des emplois du temps. Veuillez réessayer.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Emploi du temps de la Session</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={eventsLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${eventsLoading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <Button onClick={handleCreateEvent} size="sm">
            <Plus className="w-4 h-4" />
            Emploi du temps
          </Button>
        </div>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <Plus className="w-12 h-12 mx-auto" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Aucun emploi du temps programmé
              </h4>
              <p className="text-gray-500 mb-4">
                Créez votre premier emploi du temps pour commencer
              </p>
              <Button onClick={handleCreateEvent}>
                <Plus className="w-4 h-4" />
                Emploi du temps
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {events.map((event: Event) => (
            <EventItem
              key={event.id}
              event={event}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              isDeleting={deleting}
            />
          ))}
        </div>
      )}

      {/* Event Editor Modal */}
      <EventEditor
        open={eventEditorOpen}
        onOpenChange={setEventEditorOpen}
        initialEvent={editingEvent || undefined}
        sessionId={sessionId}
        onSave={handleSaveEvent}
        onCancel={handleCancel}
        isLoading={creating || updating}
      />
    </div>
  );
}
