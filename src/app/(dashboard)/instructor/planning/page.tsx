"use client";

import { Calendar } from "@/components/ui/calendar";
import EventViewer, { EventProps } from "../../student/planning/components/event-viewer";
import { useState } from "react";
import NewEvent from "./components/new-event";

const today = new Date();
const events = [
  {
    title: "My event here!!!",
    type: "Evènement" as const,
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 30),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30),
  },
];

export default function InstructorCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center flex-wrap gap-2.5 px-5">
        <h1 className="text-[#0466C8] p-5 text-2xl">Calendrier</h1>
        <NewEvent />
      </div>

      <div className="flex flex-col md:flex-row  gap-5 p-5">
        <Calendar mode="single" selected={date} onSelect={setDate} />
        <EventViewer selected={date ?? new Date()} events={events} />
      </div>
    </div>
  );
}
