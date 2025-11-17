import { Card, CardContent } from "@/components/ui/card";
import { CalendarSearch, Clock, User, BookOpen, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";

export interface EventProps {
  id: string;
  title: string;
  description?: string;
  id_cible_training?: string | null;
  id_cible_session?: string | null;
  id_cible_cours?: string | null;
  id_cible_lesson?: string[];
  id_cible_user?: string | null;
  createdBy?: string | null;
  begining_date: string;
  beginning_hour: string;
  ending_hour: string;
  qrcode: string;
  participant: string[];
  createdAt: string;
  updatedAt: string;
  trainings: any[];
  trainingSession?: {
    id: string;
    title: string;
  } | null;
  sessionCours?: {
    id: string;
    title: string;
    id_session: string;
    id_formateur: string[];
  } | null;
  users: any[];
  creator?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  lessons: {
    id: string;
    title: string;
  }[];
}

export function EventViewer({
  selected,
  events,
  onDateSelect,
}: {
  selected: Date;
  events?: EventProps[];
  onDateSelect?: (date: Date) => void;
}) {
  const [selectedEvent, setSelectedEvent] = useState<EventProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const todaysEvents = events?.filter((event) => {
    const eventDate = new Date(event.begining_date);
    return (
      eventDate.getFullYear() === selected.getFullYear() &&
      eventDate.getMonth() === selected.getMonth() &&
      eventDate.getDate() === selected.getDate()
    );
  });

  // Type color mapping
  const getTypeColor = (hasCourse: boolean) => {
    return hasCourse
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-blue-100 text-blue-700 border-blue-200";
  };

  const getTypeEmoji = (hasCourse: boolean) => {
    return hasCourse ? "📚" : "📅";
  };

  const getTypeLabel = (hasCourse: boolean) => {
    return hasCourse ? "Matières" : "Événements";
  };

  // Function to check if event time has passed
  const isEventTimePassed = (event: EventProps) => {
    const now = new Date();
    const eventDate = new Date(event.begining_date);
    const [hours, minutes] = event.ending_hour.split(":").map(Number);
    eventDate.setHours(hours, minutes, 0, 0);
    return now > eventDate;
  };

  // Function to render event card
  const renderEventCard = (event: EventProps, index: number) => {
    const eventDate = new Date(event.begining_date);
    const hasCourse = !!event.sessionCours;

    return (
      <div
        key={index}
        className="group bg-white border rounded p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300 cursor-pointer"
        onClick={() => {
          setSelectedEvent(event);
          setIsModalOpen(true);
        }}
      >
        {/* Header: Type Badge & Time */}
        <div className="flex justify-between items-start mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(hasCourse)}`}
          >
            <span>{getTypeEmoji(hasCourse)}</span>
            {getTypeLabel(hasCourse)}
          </span>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              {event.beginning_hour} - {event.ending_hour}
            </span>
          </div>
        </div>

        {/* Title */}
        <h4 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h4>

        {/* Course Title if applicable */}
        {hasCourse && event.sessionCours && (
          <div className="flex items-center gap-1.5 text-green-600 text-sm mb-3">
            <BookOpen className="w-4 h-4" />
            <span>{event.sessionCours.title}</span>
          </div>
        )}

        {/* Date */}
        <div
          className="flex items-center gap-1.5 text-gray-500 text-sm mb-3 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => onDateSelect && onDateSelect(eventDate)}
          title="Voir les événements de cette date"
        >
          <Calendar className="w-4 h-4" />
          <span>
            {eventDate.toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
        )}

        {/* Created By */}
        {event.creator && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-3 border-t border-gray-100">
            <User className="w-3.5 h-3.5" />
            <span>
              Créé par: {event.creator.firstName} {event.creator.lastName}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex-[1] border flex flex-col gap-4 rounded p-4 overflow-y-auto">
        {/* Header */}
        <div className="pb-4 border-b">
          <h3 className="font-semibold text-xl flex items-center gap-2 text-primary">
            <span className="text-2xl">📅</span>
            Emploi du temps
          </h3>
          <p className="text-muted-foreground text-sm mt-1">{finalDate}</p>
        </div>

        {!events || events.length === 0 ? (
          <div className="flex flex-col gap-5 items-center">
            <CalendarSearch height={120} width={120} className="text-muted-foreground" />
            <p className="text-sm">Aucun évènement</p>
            <p className="text-sm text-muted-foreground text-center max-w-[240px]">
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
          </div>
        )}
      </div>

      {/* Modal for QR Code */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              {selectedEvent && isEventTimePassed(selectedEvent)
                ? "La participation à cet événement n'est plus possible car l'heure limite est dépassée."
                : "Scannez le QR code pour participer à l'événement."}
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && !isEventTimePassed(selectedEvent) && (
            <div className="flex justify-center">
              <Image
                src={selectedEvent.qrcode}
                alt="QR Code pour l'événement"
                width={192}
                height={192}
                className="w-48 h-48"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
