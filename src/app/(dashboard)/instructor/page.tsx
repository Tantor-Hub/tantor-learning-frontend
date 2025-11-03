"use client";
import CourseTab from "../student/courses/components/courses-tab";
import AreaChartComponent from "./components/area-chart";
import { instructors, sessions } from "./data";
// import SessionCard from "./components/session-card";
import InstructorCard from "./components/instructror-card";
import { useGetCatalogueFormationForInstructorQuery } from "@/lib/apis/catalogue-formation";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Page() {
  const {
    data: catalogueData,
    isLoading: isCatalogueLoading,
    error: catalogueError,
  } = useGetCatalogueFormationForInstructorQuery();

  const handleDownloadGuide = (): void => {
    if (isCatalogueLoading) {
      toast("Chargement en cours...");
      return;
    }

    if (catalogueError) {
      toast.error("Erreur lors du chargement du guide");
      return;
    }

    if (catalogueData?.data?.piece_jointe) {
      window.open(catalogueData.data.piece_jointe, "_blank");
      toast.success("Guide ouvert dans un nouvel onglet");
    } else {
      toast.error("Guide non disponible");
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 md:gap-5">
        {/* {instructorStats.map((stat, i) => (
          <StatCard key={i} stat={stat} />
        ))} */}
      </div>
      <div className="flex flex-col lg:flex-row gap-5 my-5">
        <div className="flex-[3]  bg-white rounded-xl py-6">
          <div className="pb-2.5 px-5 flex flex-col gap-2.5">
            <h3 className="text-[#0466C8] font-semibold text-xl">
              Taux des présences hébdomadaires
            </h3>
            <p className="font-light text-sm">Pourcentage d’etudiants present par semaine</p>
          </div>
          <div className="h-40 md:h-72">{<AreaChartComponent />}</div>
        </div>
      </div>
      <CourseTab idSession={"1"} />
      <div className="p-5 my-5 rounded-md bg-white flex flex-col md:flex-row gap-5 md:gap-10">
        <div className="rounded-sm shadow-sm p-2.5 flex-[1]">
          <div className="flex flex-col mb-5">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div>
                <h2 className="text-[#0466C8] text-[18px] font-semibold mb-2.5">
                  Prochaines Sessions
                </h2>
                <p>Vos cours programmes por les prochains jours</p>
              </div>
              {catalogueData?.data?.piece_jointe && (
                <Button onClick={handleDownloadGuide} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Télécharger le guide d'aide
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {/* {sessions.map((session, i) => (
              <SessionCard key={i} session={session} />
            ))} */}
          </div>
        </div>
        <div className="flex-[1]">
          <div className="flex flex-col mb-5 pt-2.5">
            <h2 className="text-[#0466C8] text-[18px] font-semibold mb-2.5">Prochaines Sessions</h2>
            <p>Vos cours programmes por les prochains jours</p>
          </div>
          <div className="flex flex-col gap-2.5">
            {instructors.map((instructor, i) => (
              <InstructorCard key={i} instructor={instructor} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
