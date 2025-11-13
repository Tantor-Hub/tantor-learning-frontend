"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useListAllCoursesByIdInstructorQuery } from "@/lib/apis/instructor/instructor";
import { Loading } from "@/components/shared/loading";
import Link from "next/link";

// Types pour les données de cours
interface Cours {
  id: string;
  title: string;
  description: string;
  is_published: boolean;
  ponderation?: number;
  CreatedBy?: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export function InstructorCourseTab() {
  const { data: coursesResponse, isLoading } = useListAllCoursesByIdInstructorQuery();

  if (isLoading) {
    return (
      <div className="p-4 rounded border">
        <div className="flex items-center justify-center h-40">
          <Loading />
        </div>
      </div>
    );
  }

  if (!coursesResponse?.data.rows) {
    return (
      <div className="p-8 rounded">
        <div className="flex flex-col mb-4">
          <h2 className="text-primary text-[18px] font-semibold mb-2.5">Mes Matières</h2>
          <p>Aucune donnée de cours disponible</p>
        </div>
      </div>
    );
  }

  const courses = coursesResponse.data.rows;

  // Organiser les cours par filtre
  const coursesByFilter = {
    toutes: courses,
    publiques: courses.filter((course) => course.is_published),
    "non-publiques": courses.filter((course) => !course.is_published),
  };

  return (
    <Tabs defaultValue="toutes">
      <div className="p-4 rounded border">
        <div className="flex flex-col mb-5">
          <h2 className="text-primary text-[18px] font-semibold mb-2.5">Mes Matières</h2>
        </div>

        <TabsList className="flex w-full mb-4 border">
          <TabsTrigger value="toutes" className="flex-1 py-3 rounded">
            Toutes ({coursesByFilter.toutes.length})
          </TabsTrigger>
          <TabsTrigger value="publiques" className="flex-1 py-3 rounded">
            Publiques ({coursesByFilter.publiques.length})
          </TabsTrigger>
          <TabsTrigger value="non-publiques" className="flex-1 py-3 rounded">
            Non publiques ({coursesByFilter["non-publiques"].length})
          </TabsTrigger>
        </TabsList>

        {(["toutes", "publiques", "non-publiques"] as const).map((filter) => (
          <TabsContent key={filter} value={filter}>
            <div className="space-y-4">
              {coursesByFilter[filter].length === 0 ? (
                <p className="text-center text-gray-500 py-6">Aucun cours trouvé</p>
              ) : (
                coursesByFilter[filter].map((course) => (
                  <Link
                    key={course.id}
                    href={`/student/courses/${course.id}`}
                    className="mb-4 block"
                  >
                    <CourseCard course={course} />
                  </Link>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}

// Composant de carte de cours
const CourseCard = ({ course }: { course: Cours }) => {
  const getStatusBadge = (course: Cours) => {
    const text = course.is_published ? "Publié" : "Non publié";
    const color = course.is_published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";

    return <span className={`px-2 py-1 text-xs rounded-full ${color}`}>{text}</span>;
  };

  return (
    <div className="p-4 border rounded hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900">{course.title}</h3>
        {getStatusBadge(course)}
      </div>

      <p className="text-sm text-gray-600 mb-3">{course.description}</p>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Pondération: {course.ponderation || "N/A"}</span>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gray-200 rounded-md" />
          <div className="text-sm text-gray-800 flex flex-col">
            <span className="text-[#0466C8]">
              {course.CreatedBy?.firstName} {course.CreatedBy?.lastName}
            </span>
            <span className="text-[10px] text-gray-500">Professeur</span>
          </div>
        </div>
      </div>

      {course.is_published && (
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
