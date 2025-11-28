import {
  CalendarSearch,
  Clock,
  User,
  BookOpen,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface EventProps {
  id: string;
  title: string;
  description?: string;
  begining_date: string;
  beginning_hour: string;
  ending_hour: string;
  createdBy: string;
  sessionCours?: {
    id: string;
    title: string;
  };
  creator?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  participationInfo?: {
    students: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      avatar: string;
      userInSessionId: string;
      status: string;
      participated: boolean;
    }>;
    totalInSession: number;
    participantsCount: number;
    absentCount: number;
  };
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
  const [isParticipantsDialogOpen, setIsParticipantsDialogOpen] = useState(false);

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

  // Function to handle showing participants
  const handleShowParticipants = (event: EventProps) => {
    setSelectedEvent(event);
    setIsParticipantsDialogOpen(true);
  };

  // Function to render participant status badge
  const renderParticipantStatus = (participated: boolean, status: string) => {
    if (participated) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Présent
        </Badge>
      );
    } else if (status === "in") {
      return (
        <Badge variant="outline" className="text-orange-600 border-orange-300">
          <Clock className="w-3 h-3 mr-1" />
          Absent
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="w-3 h-3 mr-1" />
          Absent
        </Badge>
      );
    }
  };

  // Check if event has participants
  const hasParticipants = (event: EventProps) => {
    return event.participationInfo && event.participationInfo.students.length > 0;
  };

  // Function to render event card
  const renderEventCard = (event: EventProps, index: number) => {
    const eventDate = new Date(event.begining_date);
    const hasCourse = !!event.sessionCours;

    return (
      <div
        key={index}
        className="group bg-white border rounded p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300"
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

        {/* Participants Info & Button */}
        {hasParticipants(event) && event.participationInfo && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Users className="w-3.5 h-3.5" />
              <span>
                {event.participationInfo.participantsCount} présent(s) /{" "}
                {event.participationInfo.totalInSession} total
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShowParticipants(event)}
              className="text-xs"
            >
              Voir les participants
            </Button>
          </div>
        )}

        {/* Created By */}
        {event.creator && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-3 border-t border-gray-100">
            <User className="w-3.5 h-3-5" />
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

      {/* Participants Dialog */}
      <Dialog open={isParticipantsDialogOpen} onOpenChange={setIsParticipantsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Participants de l'événement</DialogTitle>
            <DialogDescription>Liste des participants et leur statut de présence</DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              {/* Event Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-lg">{selectedEvent.title}</h4>
                <p className="text-sm text-gray-600">
                  {new Date(selectedEvent.begining_date).toLocaleDateString("fr-FR")} •
                  {selectedEvent.beginning_hour} - {selectedEvent.ending_hour}
                </p>
                {selectedEvent.sessionCours && (
                  <p className="text-sm text-green-600">{selectedEvent.sessionCours.title}</p>
                )}
              </div>

              {/* Participation Stats */}
              {selectedEvent.participationInfo && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">
                      {selectedEvent.participationInfo.totalInSession}
                    </div>
                    <div className="text-xs text-blue-600">Total</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">
                      {selectedEvent.participationInfo.participantsCount}
                    </div>
                    <div className="text-xs text-green-600">Présents</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-700">
                      {selectedEvent.participationInfo.absentCount}
                    </div>
                    <div className="text-xs text-red-600">Absents</div>
                  </div>
                </div>
              )}

              {/* Participants List */}
              <div className="space-y-3">
                <h5 className="font-medium text-sm text-gray-700">Liste des participants:</h5>
                {selectedEvent.participationInfo?.students.map((student) => (
                  <div
                    key={student.userInSessionId}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={student.avatar}
                          alt={`${student.firstName} ${student.lastName}`}
                        />
                        <AvatarFallback>
                          {student.firstName[0]}
                          {student.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-xs text-gray-500">{student.email}</div>
                      </div>
                    </div>
                    {renderParticipantStatus(student.participated, student.status)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
