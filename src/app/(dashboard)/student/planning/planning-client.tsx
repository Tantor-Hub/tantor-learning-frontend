"use client";

import { useState } from "react";
import { EventViewer } from "./event-viewer";
import { useListStudentEventsBySessionQuery } from "@/lib/apis/common/planning";
import { CalendarEvent } from "@/components/ui/calendar-event";
import { Card } from "@/components/ui/card";
import { PlanningSkeleton } from "./planning-skeleton";
import { useSelectedSession } from "@/hooks/use-selected-session";
import { useSessionAlert } from "@/hooks/use-session-alert";
import { SessionAlert } from "@/components/shared/session-alert";

export function PlanningClient() {
  const sessionId = useSelectedSession();
  const { shouldShowAlert, isLoading: alertLoading } = useSessionAlert();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data, isLoading } = useListStudentEventsBySessionQuery(sessionId || "", {
    skip: !sessionId,
  });

  if (alertLoading || isLoading) {
    return <PlanningSkeleton />;
  }

  const events = data?.data || [];
  const datesWithEvents = new Set(
    events.map((event: any) => new Date(event.begining_date).toDateString())
  );
  const modifiers = {
    hasEvent: (date: Date) => datesWithEvents.has(date.toDateString()),
  };

  return (
    <div className="bg-white">
      {shouldShowAlert && <SessionAlert />}
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

        <EventViewer selected={date ?? new Date()} events={events} onDateSelect={setDate} />
      </div>
    </div>
  );
}
