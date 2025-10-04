import Image from "next/image";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Loader2, Trash2 } from "lucide-react";
import { useDeleteEventMutation } from "@/lib/apis/common/planning";
import { toast } from "react-hot-toast";

export interface EventProps {
  id: string;
  title: string;
  type: "Evènement" | "Réunion" | "Examen" | "Cours";
  startTime: Date;
  endTime: Date;
  description?: string;
  createdBy?: string;
}

export function EventViewer({ selected, events }: { selected: Date; events?: EventProps[] }) {
  const [deleteEvent, { isLoading }] = useDeleteEventMutation();
  let finalDate = "";
  if (selected) {
    const formatedDate = selected.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    finalDate = formatedDate.charAt(0).toUpperCase() + formatedDate.slice(1);
  }

  // Filter events to the selected date
  const todaysEvents = events?.filter(
    (event) =>
      event.startTime.getFullYear() === selected.getFullYear() &&
      event.startTime.getMonth() === selected.getMonth() &&
      event.startTime.getDate() === selected.getDate()
  );

  // Function to handle event deletion
  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent({ id: eventId }).unwrap();
      toast.success("Événement supprimé");
    } catch {
      toast.error("Erreur de suppression");
    }
  };

  // Function to get color based on event type
  const getEventColor = (type: string) => {
    switch (type) {
      case "Examen":
        return "bg-red-500";
      case "Réunion":
        return "bg-blue-500";
      case "Cours":
        return "bg-green-500";
      case "Evènement":
        return "bg-purple-500";
      default:
        return "bg-[#8FAEF9]";
    }
  };

  // Function to render event card
  const renderEventCard = (event: EventProps, index: number) => (
    <Card key={index} className={`text-foreground border flex flex-col gap-4 text-sm md:text-base`}>
      <CardContent>
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className={`${getEventColor(event.type)} text-white`}>
            {event.type}
          </Badge>
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-90">
              {event.startTime.toLocaleDateString("fr-FR")}
            </span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer l'événement</AlertDialogTitle>
                  <AlertDialogDescription>
                    Voulez-vous vraiment supprimer l'événement "{event.title}" ? Cette action est
                    irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isLoading}
                    onClick={() => handleDeleteEvent(event.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {isLoading ? <Loader2 className="animate-spin text-white" /> : "Supprimer"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <h4 className="font-semibold text-lg">{event.title}</h4>
        <p className="text-sm">
          {event.startTime.getHours().toString().padStart(2, "0")}:
          {event.startTime.getMinutes().toString().padStart(2, "0")} -{" "}
          {event.endTime.getHours().toString().padStart(2, "0")}:
          {event.endTime.getMinutes().toString().padStart(2, "0")}
        </p>
        {event.description && <p className="text-sm opacity-90">{event.description}</p>}
        {event.createdBy && <p className="text-xs opacity-75">Créé par: {event.createdBy}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex-[1] border shadow-md p-5 flex flex-col gap-5 rounded-[8px] max-h-[80vh] overflow-y-auto">
      <div>
        <h3 className="text-[#0466C8] font-medium text-lg flex items-center gap-2">
          <span>📅</span>
          Évènements du {finalDate}
        </h3>
      </div>

      {!events || events.length === 0 ? (
        <div className="flex flex-col gap-5 items-center">
          <Image src="/icons/calendar-03.svg" height={120} width={120} alt="calendar icon" />
          <p className="text-sm">Aucun évènement</p>
          <p className="text-sm text-[#ACACAC] text-center max-w-[240px]">
            Aucun évènement programmé
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Selected Date Events Section */}
          <div>
            {todaysEvents?.length === 0 ? (
              <div className="flex flex-col gap-3 items-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <p className="text-sm text-gray-500">Aucun évènement pour cette date</p>
                <p className="text-xs text-[#ACACAC] text-center max-w-[240px]">
                  Sélectionnez une autre date ou créez un nouvel évènement
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {/* Events for selected date */}
                {todaysEvents?.map((event, i) => renderEventCard(event, i))}
              </div>
            )}
          </div>

          {/* Separator Line */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
              Tous les évènements ({events?.length})
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* All Events Section */}
          <div>
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
              {events.map((event, i) => renderEventCard(event, i))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
