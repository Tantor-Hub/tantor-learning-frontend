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
import { BookOpen, ClipboardList, ListCheck, Percent } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/shared/loading";
import { useGetMySessionsQuery, useGetSessionDetailsQuery } from "@/lib/apis/student/training-api";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useSelectedSession } from "@/hooks/use-selected-session";
import { setSelectedSessionId } from "@/features/dashboard/dashboard-slice";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const studentsStatus = useStudentStatusQuery();
  const nextLiveSession = useNextLiveSessionQuery();
  const average = useAverageScoreQuery();
  const selectedSessionId = useSelectedSession();

  const listSessions = useGetMySessionsQuery();

  const sessionDetails = useGetSessionDetailsQuery(
    { id: selectedSessionId },
    { skip: !selectedSessionId }
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSessionLocal, setSelectedSessionLocal] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Check if any of the queries are loading
  const isLoading =
    studentsStatus.isLoading ||
    nextLiveSession.isLoading ||
    average.isLoading ||
    listSessions.isLoading;

  // Open dialog if no session selected and sessions loaded
  useMemo(() => {
    if (!selectedSessionId && listSessions.data?.data?.list?.length) {
      setDialogOpen(true);
    }
  }, [selectedSessionId, listSessions.data]);

  // Filter sessions by search term
  const filteredSessions = useMemo(() => {
    if (!listSessions.data?.data?.list) return [];
    return listSessions.data.data.list.filter((session: any) =>
      session.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, listSessions.data]);

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

  // Handle continue button click
  const handleContinue = () => {
    if (selectedSessionLocal) {
      dispatch(setSelectedSessionId(selectedSessionLocal));
      setDialogOpen(false);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    setDialogOpen(false);
    router.push("/");
  };

  return (
    <>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Veuillez sélectionner une session</AlertDialogTitle>
            <AlertDialogDescription>
              Vous devez vous inscrire à une session avant d'accéder au tableau de bord.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Input
              placeholder="Rechercher une session..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />
            <ScrollArea className="h-48 border rounded-md p-2">
              {listSessions.isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loading />
                </div>
              ) : filteredSessions.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">Aucune session trouvée.</p>
              ) : (
                filteredSessions.map((session: any) => (
                  <div
                    key={session.id}
                    className={`p-2 rounded cursor-pointer ${
                      selectedSessionLocal === session.id
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedSessionLocal(session.id)}
                  >
                    {session.name}
                  </div>
                ))
              )}
            </ScrollArea>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleContinue} disabled={!selectedSessionLocal}>
              Continuer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-5">
        <Card
          className="gap-0 py-4 border hover:cursor-pointer hover:shadow-lg"
          onClick={() => router.push("/student/courses")}
        >
          <CardHeader className="px-4">
            <CardTitle className="flex justify-between items-center">
              <h1 className="text-sm md:text-base">Sessions inscrites</h1>
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
            <p className="text-[10px] text-[#5C677D]">aujourd'hui</p>
          </CardFooter>
        </Card>

        <Card className="gap-0 py-4 border">
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

        <Card className="gap-0 py-4 border">
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

        <Card className="gap-0 py-4 border">
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
      {sessionDetails.data && (
        <Card className="mb-5">
          <CardHeader>
            <CardTitle>Détails de la Session</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold">{sessionDetails.data.data.title}</h3>
            <p className="text-sm text-gray-600">{sessionDetails.data.data.trainings.title}</p>
            <p className="text-sm">{sessionDetails.data.data.trainings.description}</p>
            <p className="text-sm">Prix: {sessionDetails.data.data.trainings.prix} €</p>
            <p className="text-sm">Type: {sessionDetails.data.data.trainings.trainingtype}</p>
            {sessionDetails.data.data.regulation_text && (
              <p className="text-sm">Règlement: {sessionDetails.data.data.regulation_text}</p>
            )}
          </CardContent>
        </Card>
      )}
      {(nextLiveSession.data?.data?.length ?? 0) > 0 && <OngoingCourse ongoing={ongoingCourse} />}
      <div className="flex flex-col lg:flex-row gap-5 my-5">
        <div className="flex-[3] border border-border rounded-xl py-4  bg-white">
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
