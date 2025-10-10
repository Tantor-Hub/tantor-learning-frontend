"use client";

import { useState } from "react";
import { EventViewer } from "./event-viewer";
import { useListStudentEventsBySessionQuery } from "@/lib/apis/common/planning";
import { CalendarEvent } from "@/components/ui/calendar-event";
import { Card } from "@/components/ui/card";
import { PlanningSkeleton } from "./planning-skeleton";
import { useSelectedSession } from "@/hooks/use-selected-session";

export function PlanningClient() {
  const sessionId = useSelectedSession();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data, isLoading } = useListStudentEventsBySessionQuery(sessionId || "", {
    skip: !sessionId,
  });

  if (isLoading) {
    return <PlanningSkeleton />;
  }

  const rawEvents = data?.data.list || [];
  const events = rawEvents.map((event: any) => ({
    ...event,
    title: event.titre,
    begining_date: event.timeline[0],
    beginning_hour: event.timeline[0]
      ? new Date(event.timeline[0]).toTimeString().split(" ")[0]
      : "",
    ending_hour: event.timeline[1] ? new Date(event.timeline[1]).toTimeString().split(" ")[0] : "",
  }));
  const datesWithEvents = new Set(
    events.map((event: any) => new Date(event.begining_date).toDateString())
  );
  const modifiers = {
    hasEvent: (date: Date) => datesWithEvents.has(date.toDateString()),
  };

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Emploi du Temps</h1>
        {/* <NewEvent /> */}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <Card className="border flex-1 rounded p-4 shadow-none">
          <CalendarEvent
            className="w-full"
            mode="single"
            selected={date}
            onSelect={setDate}
            modifiers={modifiers}
          />
        </Card>
        {!sessionId ? (
          <div className="flex-1 p-4 bg-gray-50 rounded border flex flex-col items-center justify-center">
            <img src="/empty.svg" alt="No schedule" className="w-16 h-16 mb-4" />
            <p className="text-center text-gray-600">
              vous devez etre dans une session ou etre enregistrer dans une session pour voir les
              evenment de la session
            </p>
          </div>
        ) : (
          <EventViewer selected={date ?? new Date()} events={events} onDateSelect={setDate} />
        )}
      </div>
    </div>
  );
}
