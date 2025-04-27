import { BarVisual } from "./components/bar-chart";
import OngoingCourse from "./components/ongoing-course";
import { PieVisual } from "./components/pie-chart";
import StatCard from "./components/student-stat-card";
import CourseTab from "./courses/components/courses-tab";
import { ongoingCourse, studentStats } from "./data";
const StudentDashboard = () => {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 md:gap-5">
        {studentStats.map((stat, i) => (
          <StatCard key={i} stat={stat} />
        ))}
      </div>
      <OngoingCourse ongoing={ongoingCourse} />
      <div className="flex flex-col lg:flex-row gap-5 mb-5">
        <div className="flex-[3] border border-border rounded-xl py-6">
          <h3 className="text-[#001845] font-medium text-xl pb-2.5 px-5">Productivite</h3>

          <div className="h-[300px]">
            <BarVisual />
          </div>
        </div>
        <div className="flex-[2]">
          <PieVisual />
        </div>
      </div>
      <CourseTab />
    </>
  );
};
export default StudentDashboard;
