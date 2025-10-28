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

  const { data, isLoading, error } = useListStudentEventsBySessionQuery(sessionId || "", {
    skip: !sessionId,
  });

  if (alertLoading || isLoading) {
    return <PlanningSkeleton />;
  }

  const is402Error = error && "status" in error && error.status === 402;
  const errorMessage =
    is402Error && "data" in error ? (error.data as { status: number; message: string }) : null;

  const events = data?.data || [];
  const datesWithEvents = new Set(
    events.map((event: any) => new Date(event.begining_date).toDateString())
  );
  const modifiers = {
    hasEvent: (date: Date) => datesWithEvents.has(date.toDateString()),
  };

  return sessionId ? (
    <div className="bg-white mb-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Emploi du Temps</h1>
      </div>
      {shouldShowAlert && <SessionAlert />}
      {is402Error && errorMessage && (
        <SessionAlert
          variant="warning"
          status={errorMessage.status}
          message={errorMessage.message}
        />
      )}
      {!shouldShowAlert && !is402Error && (
        <>
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
        </>
      )}
    </div>
  ) : null;
}
