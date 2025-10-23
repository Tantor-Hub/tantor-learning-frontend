"use client";

import { useState, Suspense } from "react";
import { EventViewer } from "./event-viewer";
import { NewEvent } from "./new-event";
import { useListAllEventsQuery } from "@/lib/apis/common/planning";
import { Loading } from "@/components/shared/loading";
import { CalendarEvent } from "@/components/ui/calendar-event";
import { Card } from "@/components/ui/card";
import { PlanningSkeleton } from "./planning-skeleton";

export function PlanningClient() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { data, isLoading } = useListAllEventsQuery();

  if (isLoading) {
    return <PlanningSkeleton />;
  }

  const events = (data as any)?.data || [];
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
        <EventViewer selected={date ?? new Date()} events={events} onDateSelect={setDate} />
      </div>
    </div>
  );
}
