"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeanceDateForm } from "./seance-date-form";
import { useGetAllTrainingsQuery } from "@/lib/apis/student/training-api";
import { useListCoursesQuery } from "@/lib/apis/common/courses-api";
import { useListTrainingTypeQuery } from "@/lib/apis/secretary/training-secretary-api";
import { useAddSeanceMutation } from "@/lib/apis/secretary/seance-secretary-api";
import { toast } from "react-hot-toast";

export function AddSeance() {
  const { data: sessionsData, isSuccess } = useGetAllTrainingsQuery();
  const { data: coursesData, isSuccess: isSuccessCourses } = useListCoursesQuery();
  const { data: trainingTypeData, isSuccess: isSuccessTrainingType } = useListTrainingTypeQuery();
  const [addSeanceMutation, { isLoading }] = useAddSeanceMutation();

  const [seanceData, setSeanceData] = useState({
    id_session: 0,
    seance_date_on: Math.floor(Date.now() / 1000),
    type_seance: "onLine", // Valeur par défaut correspondant à une clé
    duree: 4,
    id_cours: 0,
  });

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [durationTime, setDurationTime] = useState("10:30:00");

  const handleSessionChange = (value: string) => {
    const sessionId = parseInt(value, 10);
    setSeanceData((prev) => ({
      ...prev,
      id_session: sessionId,
    }));
  };

  const handleCourseChange = (value: string) => {
    const courseId = parseInt(value, 10);
    setSeanceData((prev) => ({
      ...prev,
      id_cours: courseId,
    }));
  };

  const handleSelectChange = (value: string) => {
    setSeanceData((prev) => ({
      ...prev,
      type_seance: value, // Stocke la clé (key) du type de formation
    }));
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setSeanceData((prev) => ({
        ...prev,
        seance_date_on: Math.floor(newDate.getTime() / 1000),
      }));
    }
  };

  const handleDurationChange = (time: string) => {
    setDurationTime(time);
    const [hours, minutes] = time.split(":");
    const durationInHours = parseFloat(hours) + parseFloat(minutes) / 60;
    setSeanceData((prev) => ({
      ...prev,
      duree: durationInHours,
    }));
  };

  const handleSubmit = async () => {
    try {
      await addSeanceMutation({
        id_session: seanceData.id_session.toString(),
        seance_date_on: seanceData.seance_date_on.toString(),
        type_seance: seanceData.type_seance,
        duree: seanceData.duree.toString(),
        id_cours: seanceData.id_cours.toString(),
      }).unwrap();
      toast.success("Séance créée avec succès");
    } catch (error) {
      console.error("Erreur création séance:", error);

      toast.error("Échec de la création");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Plus />
          Ajouter Séance
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ajouter une nouvelle séance</AlertDialogTitle>
          <AlertDialogDescription>
            Remplissez les détails de la nouvelle séance.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid grid-rows-1 gap-4">
          <SeanceDateForm
            date={date}
            onDateChange={handleDateChange}
            duration={durationTime}
            onDurationChange={handleDurationChange}
          />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="session" className="text-right">
              Session
            </Label>
            <Select onValueChange={handleSessionChange}>
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Select a session" />
              </SelectTrigger>
              <SelectContent>
                {isSuccess &&
                  sessionsData?.data?.list?.map((session) => (
                    <SelectItem key={session.id} value={session.id.toString()}>
                      {session.designation}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="course" className="text-right">
              Course
            </Label>
            <Select onValueChange={handleCourseChange}>
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {isSuccessCourses &&
                  coursesData?.data?.rows?.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type_seance" className="text-right">
              Type
            </Label>
            <Select value={seanceData.type_seance} onValueChange={handleSelectChange}>
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Select seance type" />
              </SelectTrigger>
              <SelectContent>
                {isSuccessTrainingType &&
                  trainingTypeData?.data?.map((trainingType) => (
                    <SelectItem key={trainingType.key} value={trainingType.key}>
                      {trainingType.type}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>
            {!isLoading ? "Ajouter une séance" : <Loader2 className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
