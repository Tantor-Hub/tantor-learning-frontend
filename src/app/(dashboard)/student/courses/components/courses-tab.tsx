"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetTrainingByIdQuery } from "@/lib/apis/student/training-api";
import { Loading } from "@/components/shared/loading";
import Link from "next/link";

// Types pour les données de cours
interface Cours {
  id: number;
  id_preset_cours: number;
  duree: number | null;
  ponderation: number | null;
  is_published: boolean;
  createdBy: number;
  id_session: number;
  id_formateur: number | null;
  Title: {
    id: number;
    title: string;
    description: string;
  };
}

interface SessionData {
  id: number;
  Cours: Cours[];
  date_session_debut: string;
  date_session_fin: string;
  [key: string]: any;
}

interface SessionResponse {
  status: number;
  message: string;
  data: SessionData;
}

// Fonction pour déterminer le statut d'un cours
const getCourseStatus = (
  course: Cours,
  sessionStart: string,
  sessionEnd: string
): "actifs" | "avenir" | "termines" => {
  const now = new Date();
  const start = new Date(sessionStart);
  const end = new Date(sessionEnd);

  // Pour simplifier, on considère:
  // - Actif: cours publié et session en cours
  // - À venir: cours non publié ou session future
  // - Terminé: session passée

  if (now > end) return "termines";
  if (now < start) return "avenir";

  return course.is_published ? "actifs" : "avenir";
};

// Fonction pour formater la durée
const formatDuration = (minutes: number | null): string => {
  if (!minutes) return "Durée non définie";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;

  return `${hours}h ${mins}min`;
};

const CourseTab = ({ id_session }: { id_session: number }) => {
  const { data: sessionResponse, isLoading } = useGetTrainingByIdQuery({ id_session });

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-md border">
        <div className="flex items-center justify-center h-40">
          <Loading />
        </div>
      </div>
    );
  }

  if (!sessionResponse?.data) {
    return (
      <div className="bg-white p-8 rounded-md shadow-md shadow-gray-300 border-t">
        <div className="flex flex-col mb-5">
          <h2 className="text-[#0466C8] text-[18px] font-semibold mb-2.5">Mes Cours</h2>
          <p>Aucune donnée de session disponible</p>
        </div>
      </div>
    );
  }

  const session = sessionResponse.data;
  const { Cours, date_session_debut, date_session_fin } = session;

  // Organiser les cours par statut
  const coursesByStatus = {
    actifs: Cours.filter(
      (course) => getCourseStatus(course, date_session_debut, date_session_fin) === "actifs"
    ),
    avenir: Cours.filter(
      (course) => getCourseStatus(course, date_session_debut, date_session_fin) === "avenir"
    ),
    termines: Cours.filter(
      (course) => getCourseStatus(course, date_session_debut, date_session_fin) === "termines"
    ),
  };

  return (
    <Tabs defaultValue="actifs">
      <div className="bg-white p-8 rounded-md border">
        <div className="flex flex-col mb-5">
          <h2 className="text-[#0466C8] text-[18px] font-semibold mb-2.5">Mes Cours</h2>
          <p className="text-gray-600">
            Session du {new Date(date_session_debut).toLocaleDateString("fr-FR")} au{" "}
            {new Date(date_session_fin).toLocaleDateString("fr-FR")}
          </p>
        </div>

        <TabsList className="flex w-full mb-4 border">
          <TabsTrigger value="actifs" className="flex-1 py-3 rounded-xl">
            Actifs ({coursesByStatus.actifs.length})
          </TabsTrigger>
          <TabsTrigger value="avenir" className="flex-1 py-3 rounded-xl">
            À venir ({coursesByStatus.avenir.length})
          </TabsTrigger>
          <TabsTrigger value="termines" className="flex-1 py-3 rounded-xl">
            Terminés ({coursesByStatus.termines.length})
          </TabsTrigger>
        </TabsList>

        {(["actifs", "avenir", "termines"] as const).map((status) => (
          <TabsContent key={status} value={status}>
            <div className="space-y-4">
              {coursesByStatus[status].length === 0 ? (
                <p className="text-center text-gray-500 py-6">
                  Aucun cours {getStatusLabel(status)}
                </p>
              ) : (
                coursesByStatus[status].map((course) => (
                  <Link
                    key={course.id}
                    href={`/student/courses/${id_session}/${course.id}`}
                    className="mb-4 block"
                  >
                    <CourseCard
                      course={course}
                      status={status}
                      sessionStart={date_session_debut}
                      sessionEnd={date_session_fin}
                    />
                  </Link>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

// Composant de carte de cours
const CourseCard = ({
  course,
  status,
  sessionStart,
  sessionEnd,
}: {
  course: Cours;
  status: "actifs" | "avenir" | "termines";
  sessionStart: string;
  sessionEnd: string;
}) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      actifs: { text: "Actif", color: "bg-green-100 text-green-800" },
      avenir: { text: "À venir", color: "bg-blue-100 text-blue-800" },
      termines: { text: "Terminé", color: "bg-gray-100 text-gray-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.actifs;

    return <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>{config.text}</span>;
  };

  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900">{course.Title.title}</h3>
        {getStatusBadge(status)}
      </div>

      <p className="text-sm text-gray-600 mb-3">{course.Title.description}</p>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Durée: {formatDuration(course.duree)}</span>
        <span>Pondération: {course.ponderation || "N/A"}</span>
      </div>

      {status === "actifs" && course.is_published && (
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-800 mb-1">Progression</p>
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${Math.min(100, Math.floor(Math.random() * 100))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function pour les labels de statut
const getStatusLabel = (status: string): string => {
  const labels = {
    actifs: "actif",
    avenir: "à venir",
    termines: "terminé",
  };
  return labels[status as keyof typeof labels] || status;
};

export default CourseTab;
