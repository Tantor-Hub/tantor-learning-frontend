"use client";

import { Calendar } from "@/components/ui/calendar";
import EventViewer from "./components/event-viewer";
import { useState } from "react";

export default function StudentCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="bg-white">
      <h1 className="text-[#0466C8] p-5 text-2xl">Calendrier</h1>
      <div className="flex flex-col md:flex-row  gap-5 p-5">
        <Calendar mode="single" selected={date} onSelect={setDate} />
        <EventViewer selected={date ?? new Date()} />
      </div>
    </div>
  );
}
