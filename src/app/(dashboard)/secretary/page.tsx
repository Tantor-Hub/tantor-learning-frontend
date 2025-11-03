"use client";
import { SecPieChart } from "./components/sec-pie-chart";
import { SecScheduleCard } from "./components/sec-schedule-card";
import { useListEventsQuery } from "@/lib/apis/common/planning";
import { useGetAllUserInSessionsQuery } from "@/lib/apis/user-in-session";
import { UserInSession } from "@/types/user-in-session";

export default function Page() {
  const { data: eventsData, isLoading: eventsLoading } = useListEventsQuery();
  const { data: planningData, isLoading: planningLoading } = useGetAllUserInSessionsQuery();

  const todayEvents = (eventsData?.data || []).filter((event: any) => {
    const eventDate = new Date(event.begining_date).toDateString();
    const today = new Date().toDateString();
    return eventDate === today;
  });

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
          <div className="flex-[1] flex flex-col gap-2.5 mb-2.5">
            {eventsLoading ? (
              <div className="text-center">Chargement de l'emploi du temps...</div>
            ) : todayEvents.length > 0 ? (
              todayEvents.map((event: any) => (
                <div key={event.id} className="flex flex-col gap-2">
                  <SecScheduleCard
                    key={event.id}
                    time={`${event.beginning_hour}-${event.ending_hour}`}
                    title={event.title}
                    course={event.sessionCours.title}
                  />
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground">Aucun événement aujourd'hui</div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full my-5">
        <div className="flex flex-col gap-4 p-4 rounded border">
          <h3 className="text-xl font-semibold">Inscriptions</h3>
          <p className="text-xs font-light">Inscriptions aux sessions de formation</p>
          {planningLoading ? (
            <div className="text-center">Chargement du planning...</div>
          ) : planningData?.data && planningData.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Session</th>
                    <th className="text-left p-2">Utilisateur</th>
                    <th className="text-left p-2">Statut</th>
                    <th className="text-left p-2">Date d'inscription</th>
                    <th className="text-left p-2">Places disponibles</th>
                  </tr>
                </thead>
                <tbody>
                  {planningData.data.map((item: UserInSession) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{item.trainingSession.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.trainingSession.begining_date
                              ? new Date(item.trainingSession.begining_date).toLocaleDateString(
                                  "fr-FR"
                                )
                              : "-"}{" "}
                            -{" "}
                            {item.trainingSession.ending_date
                              ? new Date(item.trainingSession.ending_date).toLocaleDateString(
                                  "fr-FR"
                                )
                              : "-"}
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium">
                            {item.user.firstName} {item.user.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">{item.user.email}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            item.status === "in"
                              ? "bg-green-100 text-green-800"
                              : item.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.status === "in"
                            ? "Inscrit"
                            : item.status === "pending"
                              ? "En attente"
                              : item.status}
                        </span>
                      </td>
                      <td className="p-2 text-sm">
                        {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="p-2 text-sm">
                        {item.trainingSession.available_places}/{item.trainingSession.nb_places}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">Aucune inscription trouvée</div>
          )}
        </div>
      </div>
    </>
  );
}
