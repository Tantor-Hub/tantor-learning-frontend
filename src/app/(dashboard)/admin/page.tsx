import StatCard from "../student/components/student-stat-card";
import CourseTab from "../student/courses/components/courses-tab";
import { AdminChart } from "./components/admin-chart";
import UserCard from "./components/user-card";
import { adminStats, newUser } from "./data";

export default function Page() {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 md:gap-5">
        {adminStats.map((stat, i) => (
          <StatCard key={i} stat={stat} />
        ))}
      </div>
      <div className="flex flex-col lg:flex-row gap-5 my-5">
        <div className="flex-[2]">
          <AdminChart />
        </div>
        <div className="flex-[1] flex flex-col p-5 gap-10 shadow-sm rounded-md border-t bg-white">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl pb-1.5 text-[#0466C8] font-semibold">
              Activité des utilisateurs
            </h3>
            <p className="text-xs font-light">
              nombre des connections par jours durant les 7 derniers jours{" "}
            </p>
          </div>
          <div className="flex-[1] flex flex-col gap-5 justify-between mb-2.5">
            {newUser.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      </div>
      <CourseTab spec="Liste des cours recemment ajoutes ou mis a jour" />
    </>
  );
}
