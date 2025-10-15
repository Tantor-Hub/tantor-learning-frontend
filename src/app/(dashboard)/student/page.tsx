"use client";
import { useState, useMemo } from "react";
import {
  useAverageScoreQuery,
  useNextLiveSessionQuery,
  useStudentStatusQuery,
} from "@/lib/apis/student-api";
import { BarVisual } from "./components/bar-chart";
import OngoingCourse from "./components/ongoing-course";
import { SessionProgress } from "./components/pie-chart";
import CourseTab from "./courses/components/courses-tab";
import { ongoingCourse } from "./data";
import { ClipboardList, ListCheck, Percent } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/shared/loading";
import { useGetMySessionsQuery } from "@/lib/apis/student/training-api";
import { useGetTrainingSessionByIdQuery } from "@/lib/apis/training-sessions";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useSelectedSession } from "@/hooks/use-selected-session";

export default function Page() {
  const studentsStatus = useStudentStatusQuery();
  const nextLiveSession = useNextLiveSessionQuery();
  const average = useAverageScoreQuery();
  const selectedSessionId = useSelectedSession();

  const listSessions = useGetMySessionsQuery();

  const sessionDetails = useGetTrainingSessionByIdQuery(
    { id: selectedSessionId as string },
    { skip: !selectedSessionId }
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  // Check if any of the queries are loading
  const isLoading =
    studentsStatus.isLoading ||
    nextLiveSession.isLoading ||
    average.isLoading ||
    listSessions.isLoading;

  console.log("data", JSON.stringify(sessionDetails));
  // Open dialog if no session selected and sessions loaded
  useMemo(() => {
    if (!selectedSessionId && listSessions.data?.data?.list?.length) {
      setDialogOpen(true);
    }
  }, [selectedSessionId, listSessions.data]);

  // Show loader when data is loading
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        {" "}
        <Loading />
      </div>
    );
  }
  // console.log(JSON.stringify(listSessions.data?.data.list));

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-5">
        <Card className="gap-0 py-4 border rounded shadow-none">
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

        <Card className="gap-0 py-4 border rounded shadow-none">
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

        <Card className="gap-0 py-4 border rounded shadow-none">
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
      </div>
      {(nextLiveSession.data?.data?.length ?? 0) > 0 && <OngoingCourse ongoing={ongoingCourse} />}
      <div className="flex flex-col lg:flex-row gap-5 my-5">
        <div className="flex-[3] border border-border rounded py-4  bg-white">
          <div className="h-auto">
            <BarVisual id_session={selectedSessionId} />
          </div>
        </div>
        <SessionProgress id_session={selectedSessionId} />
      </div>
      <CourseTab idSession={selectedSessionId} />
    </>
  );
}
