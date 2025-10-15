"use client";

import StatCard from "../student/components/student-stat-card";
import SecDocsTabs from "./components/sec-docs-tab";
import { SecPieChart } from "./components/sec-pie-chart";
import { SecSingleSchedule } from "./components/sec-schedule-card";
import { SecretaryStats } from "./data";
import { useListEventsQuery } from "@/lib/apis/common/planning";

export default function Page() {
  const { data: eventsData, isLoading: eventsLoading } = useListEventsQuery();

  const todayEvents =
    eventsData?.data?.list?.filter((event) => {
      const eventDate = new Date(event.timeline[0]).toDateString();
      const today = new Date().toDateString();
      return eventDate === today;
    }) || [];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 md:gap-5"></div>
      <div className="flex flex-col lg:flex-row gap-5 my-5">
        <div className="flex-[1]">
          <SecPieChart />
        </div>
        <div className="flex-[1] flex flex-col p-4 gap-10 rounded border">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Calendrier du jour</h3>
            <p className="text-xs font-light">Rendez-vous et evenement programmes</p>
          </div>
          <div className="flex-[1] flex flex-col gap-2.5 justify-between mb-2.5">
            {eventsLoading ? (
              <div className="text-center">Chargement de l'emploi du temps...</div>
            ) : todayEvents.length > 0 ? (
              todayEvents.map((event) => (
                <SecSingleSchedule
                  key={event.id}
                  event={{
                    time: `${new Date(event.timeline[0]).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}-${new Date(event.timeline[1]).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`,
                    title: event.titre,
                    location: event.type === "online" ? "En ligne" : "Salle B204",
                  }}
                />
              ))
            ) : (
              <div className="text-center text-muted-foreground">Aucun événement aujourd'hui</div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full">
        <SecDocsTabs />
      </div>
    </>
  );
}
