"use client";
import {
  useAverageScoreQuery,
  useNextLiveSessionQuery,
  useStudentStatusQuery,
} from "@/lib/apis/student-api";
import { BarVisual } from "./components/bar-chart";
import OngoingCourse from "./components/ongoing-course";
import { PieVisual } from "./components/pie-chart";
// import StatCard from "./components/student-stat-card";
import CourseTab from "./courses/components/courses-tab";
import { ongoingCourse, studentStats } from "./data";
import { BookOpen, Camera, ClipboardList, ListCheck, Percent, UserPlus } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const StudentDashboard = () => {
  const studentsStatus = useStudentStatusQuery();
  const nextLiveSession = useNextLiveSessionQuery();
  const average = useAverageScoreQuery();

  if (studentsStatus.isLoading) {
    console.log("Loading...");
    return null;
  }
  if (studentsStatus.data) {
    console.log(studentsStatus.data);
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 md:gap-5">
        <Card className="gap-0 py-4">
          <CardHeader className="px-4">
            <CardTitle className="flex justify-between items-center">
              <h1 className="text-sm md:text-base">Cours Inscrits</h1>
              <span>
                <BookOpen size={20} />
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 flex gap-2.5 items-center">
            <span className="font-black text-xl md:text-2xl">
              {studentsStatus.data?.data[0].enrolledCourses}
            </span>
            <span className="text-[10px] text-[#00CBB8]">
              ↗ {studentsStatus.data?.data[0].ongoingCourses} en cours
            </span>
          </CardContent>
          <CardFooter className="px-4">
            <p className="text-[10px] text-[#5C677D]">aujourd’hui</p>
          </CardFooter>
        </Card>

        <Card className="gap-0 py-4">
          <CardHeader className="px-4">
            <CardTitle className="flex justify-between items-center">
              <h1 className="text-sm md:text-base">Devoirs à rendre</h1>
              <span>
                <ClipboardList size={20} />
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 flex gap-2.5 items-center">
            <span className="font-black text-xl md:text-2xl">
              {studentsStatus.data?.data[1].homework}
            </span>
            <span className="text-[10px] text-[#00CBB8]">
              ↗ {studentsStatus.data?.data[1].nextDelivery.length} pour demain
            </span>
          </CardContent>
          <CardFooter className="px-4">
            <p className="text-[10px] text-[#5C677D]">à compléter</p>
          </CardFooter>
        </Card>

        <Card className="gap-0 py-4">
          <CardHeader className="px-4">
            <CardTitle className="flex justify-between items-center">
              <h1 className="text-sm md:text-base">Moyenne générale</h1>
              <span>
                <ListCheck size={20} />
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 flex gap-2.5 items-center">
            <span className="font-black text-xl md:text-2xl">
              {average.data?.data.scoreLastSemester}/{average.data?.data.scoreLastSemester}
            </span>
            <span className="text-[10px] text-[#FF0000]">
              ↓ {average.data?.data.scoreLastSemester}
            </span>
          </CardContent>
          <CardFooter className="px-4">
            <p className="text-[10px] text-[#5C677D]">depuis le dernier semestre</p>
          </CardFooter>
        </Card>

        <Card className="gap-0 py-4">
          <CardHeader className="px-4">
            <CardTitle className="flex justify-between items-center">
              <h1 className="text-sm md:text-base">Pourcentage</h1>
              <span>
                <Percent size={20} />
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 flex gap-2.5 items-center">
            <span className="font-black text-xl md:text-2xl">
              {average.data?.data.totalLastSemeter}%
            </span>
            <span className="text-[10px] text-[#00CBB8]">
              ↗ +{average.data?.data.totalOngoingSemester}%
            </span>
          </CardContent>
          <CardFooter className="px-4">
            <p className="text-[10px] text-[#5C677D]">par rapport au dernier semestre</p>
          </CardFooter>
        </Card>

        <Card className="gap-0 py-4">
          <CardHeader className="px-4">
            <CardTitle className="flex justify-between items-center">
              <h1 className="text-sm md:text-base">Messages non lus</h1>
              <span>
                <UserPlus size={20} />
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 flex gap-2.5 items-center">
            <span className="font-black text-xl md:text-2xl">
              {studentsStatus.data?.data[2].unreadMessageNumber}
            </span>
            <span className="text-[10px] text-[#00CBB8]">
              ↗ +{studentsStatus.data?.data[2].unreadMessageNumber}%
            </span>
          </CardContent>
          <CardFooter className="px-4">
            <p className="text-[10px] text-[#5C677D]">à lire</p>
          </CardFooter>
        </Card>
      </div>
      {(nextLiveSession.data?.data?.length ?? 0) > 0 && <OngoingCourse ongoing={ongoingCourse} />}
      <div className="flex flex-col lg:flex-row gap-5 my-5">
        <div className="flex-[3] border border-border rounded-xl py-6  bg-white">
          <h3 className="text-[#001845] font-medium text-xl pb-2.5 px-5">Productivite</h3>

          <div className="h-[300px]">
            <BarVisual />
          </div>
        </div>
        <div className="flex-[2]">
          <PieVisual />
        </div>
      </div>
      <CourseTab spec="Progrression de vos cours actuels" />
    </>
  );
};
export default StudentDashboard;
