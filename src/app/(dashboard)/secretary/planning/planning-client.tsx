"use client";

import { useState, Suspense } from "react";
import { EventViewer } from "./event-viewer";
import { NewEvent } from "./new-event";
import { useListEventsQuery } from "@/lib/apis/common/planning";
import { Loading } from "@/components/shared/loading";
import { CalendarEvent } from "@/components/ui/calendar-event";
import { Card } from "@/components/ui/card";
import { PlanningSkeleton } from "./planning-skeleton";

export function PlanningClient() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { data, isLoading } = useListEventsQuery();

  if (isLoading) {
    return <PlanningSkeleton />;
  }

  const events = ((data as any)?.data || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    type: "Evènement" as "Evènement" | "Réunion" | "Examen",
    startTime: new Date(item.begining_date.split("T")[0] + "T" + item.beginning_hour + ":00"),
    endTime: new Date(item.begining_date.split("T")[0] + "T" + item.ending_hour + ":00"),
    description: item.description,
    createdBy: item.creator ? `${item.creator.firstName} ${item.creator.lastName}` : "Inconnu",
  }));
  const datesWithEvents = new Set(events.map((event: any) => event.startTime.toDateString()));
  const modifiers = {
    hasEvent: (date: Date) => datesWithEvents.has(date.toDateString()),
  };

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center flex-wrap gap-2.5">
        <h1 className="text-primary p-5 text-xl">Emploi du Temps</h1>
        <NewEvent />
      </div>

      <div className="flex flex-col md:flex-row gap-5 p-5">
        <Card className="border flex-1">
          <CalendarEvent
            className="w-full"
            mode="single"
            selected={date}
            onSelect={setDate}
            modifiers={modifiers}
          />
        </Card>
        <EventViewer selected={date ?? new Date()} events={events} />
      </div>
    </div>
  );
}
