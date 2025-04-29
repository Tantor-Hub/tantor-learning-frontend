import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
export interface EventProps {
  title: string;
  type: "Cours" | "Examen" | "Evènement";
  startTime: Date;
  endTime: Date;
}

const EventViewer = ({ selected, events }: { selected: Date; events?: EventProps[] }) => {
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

  //Filter events to the selected date
  const todaysEvents = events?.filter(
    (event) =>
      event.startTime.getFullYear() === selected.getFullYear() &&
      event.startTime.getMonth() === selected.getMonth() &&
      event.startTime.getDate() === selected.getDate()
  );

  const [tab, setActiveTab] = useState("all");

  return (
    <div className="flex-[1] border shadow-md p-5 flex flex-col gap-5 rounded-[8px]">
      <div>
        <h2 className="text-[#0466C8] font-medium text-base md:text-[18px]">
          Planning global - {finalDate}
        </h2>
        <p className="text-sm">{events?.length || 0} évènement(s) programmé(s) </p>
      </div>
      {!events || events.length === 0 || todaysEvents?.length == 0 ? (
        <div className="flex flex-col gap-5 items-center">
          <Image src="/icons/calendar-03.svg" height={120} width={120} alt="calendar icon" />
          <p className="text-sm">Aucun evenement </p>
          <p className="text-sm text-[#ACACAC] text-center max-w-[240px]">
            Aucun evenement programmes pour cette date
          </p>
        </div>
      ) : (
        <div>
          <Tabs
            defaultValue="day"
            className="w-full flex"
            onValueChange={(val) => setActiveTab(val)}
          >
            <div className="bg-[#ECECEC] rounded-md mb-5 p-1.5">
              <TabsList className="w-full flex">
                <TabsTrigger value="day" className="flex-[1] p-4">
                  Jour
                </TabsTrigger>
                <TabsTrigger value="week" className="flex-[1] p-4">
                  Semaine
                </TabsTrigger>
                <TabsTrigger value="month" className="flex-[1] p-4">
                  Moi
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="day" className="flex flex-col gap-2.5 p-5">
              <span className="w-full border-b pb-3.5">9:00</span>
              <span className="w-full border-b pb-3.5">10:00</span>
              <span className="w-full border-b pb-3.5">11:00</span>
              {todaysEvents?.map((event, i) => (
                <div
                  key={i}
                  className="w-full bg-[#8FAEF9] rounded-xl p-5 flex flex-col gap-4 text-white text-sm md:text-base"
                >
                  <p>{event.type}</p>
                  <h4>{event.title}</h4>
                  <p>
                    {event.startTime.getHours()}:{event.startTime.getMinutes()} -{" "}
                    {event.endTime.getHours()}:{event.endTime.getMinutes()}
                  </p>
                </div>
              ))}
              <span className="w-full border-b pb-3.5">15:00</span>
              <span className="w-full border-b pb-3.5">16:00</span>
              <span className="w-full border-b pb-3.5">17:00</span>
            </TabsContent>
            <TabsContent value="week">
              <div className="p-5 pt-10"> Pas d'évènement</div>
            </TabsContent>
            <TabsContent value="month">
              <div className="p-5 pt-10"> Pas d'évènement</div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};
export default EventViewer;
