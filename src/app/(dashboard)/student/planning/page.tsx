// Main Page
"use client";
import { Calendar } from "@/components/ui/calendar";
import { EventViewer } from "./event-viewer";
import { useState } from "react";
import { useListEventsQuery } from "@/lib/apis/common/planning";
import { Loading } from "@/components/shared/loading";

const adaptApiResponseToEvents = (apiResponse: any) => {
  if (!apiResponse?.data?.list) return [];

  return apiResponse.data.list.map((item: any) => ({
    title: item.titre,
    type: item.type as "Evènement" | "Réunion" | "Examen",
    startTime: new Date(parseInt(item.timeline[0]) * 1000),
    endTime: new Date(parseInt(item.timeline[1]) * 1000),
    description: item.description,
    createdBy: item.Createdby ? `${item.Createdby.fs_name} ${item.Createdby.ls_name}` : "Inconnu",
  }));
};

export default function Page() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { data, isLoading } = useListEventsQuery();

  if (isLoading) {
    return <Loading />;
  }

  const events = adaptApiResponseToEvents(data);

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center flex-wrap gap-2.5 px-5">
        <h1 className="text-[#0466C8] p-5 text-2xl">Calendrier</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-5 p-5">
        <Calendar mode="single" selected={date} onSelect={setDate} />
        <EventViewer selected={date ?? new Date()} events={events} />
      </div>
    </div>
  );
}
