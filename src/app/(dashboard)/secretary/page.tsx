import StatCard from "../student/components/student-stat-card";
import SecDocsTabs from "./components/sec-docs-tab";
import { SecPieChart } from "./components/sec-pie-chart";
import { SecSingleSchedule } from "./components/sec-schedule-card";
import secDocsData, { SecretaryStats, secSchedule } from "./data";

export default function Page() {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 md:gap-5">
        {/* {SecretaryStats.map((stat, i) => (
          <StatCard key={i} stat={stat} />
        ))} */}
      </div>
      <div className="flex flex-col lg:flex-row gap-5 my-5">
        <div className="flex-[1]">
          <SecPieChart />
        </div>
        <div className="flex-[1] flex flex-col p-5 gap-10 shadow-sm rounded-md border-t bg-white">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl text-[#0466C8] font-semibold">Calendrier du jour</h3>
            <p className="text-xs font-light">Rendez-vous et evenement programmes</p>
          </div>
          <div className="flex-[1] flex flex-col gap-2.5 justify-between mb-2.5">
            {secSchedule.map((event) => (
              <SecSingleSchedule key={event.title} event={event} />
            ))}
          </div>
        </div>
      </div>
      <div className="w-full">
        <SecDocsTabs data={secDocsData} />
      </div>
    </>
  );
}
