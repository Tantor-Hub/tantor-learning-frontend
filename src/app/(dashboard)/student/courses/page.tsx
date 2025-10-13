"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useListCoursesBySessionIdQuery } from "@/lib/apis/student/training-api";
import { CourseListSkeleton } from "@/components/skeletons/course-list-skeleton";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";
import { useSelectedSession } from "@/hooks/use-selected-session";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const sessionId = useSelectedSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPublished, setFilterPublished] = useState<boolean | null>(null);
  const [filterPonderation, setFilterPonderation] = useState<string>("all");
  const { data: courses, isLoading } = useListCoursesBySessionIdQuery(
    { id_session: sessionId },
    { skip: !sessionId }
  );

  const filteredCourses =
    courses?.data.rows.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPublished = filterPublished === null || course.is_published === filterPublished;
      const matchesPonderation =
        filterPonderation === "all" ||
        (filterPonderation === "low" && course.ponderation < 50) ||
        (filterPonderation === "high" && course.ponderation >= 50);
      return matchesSearch && matchesPublished && matchesPonderation;
    }) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Button onClick={() => router.back()}>
          <ChevronLeft /> Retour
        </Button>
        <CourseListSkeleton />
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Image
          src="/empty.svg"
          alt="No session"
          className="w-16 h-16 mb-4"
          width={64}
          height={64}
        />
        <p className="text-center text-gray-600">
          vous devez etre dans une session ou etre enregistrer dans une session pour voir les
          evenment de la session
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => router.back()}>
        <ChevronLeft /> Retour
      </Button>
      {/* Section de recherche et filtres */}
      {courses && courses.data.rows.length > 0 && (
        <>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-10 mb-4">
            <div className="flex items-center border px-4 w-full rounded">
              <Image src="/icons/search.svg" height={20} width={20} alt="search icon" />
              <Input
                type="search"
                className="text-muted-foreground border-none focus-visible:outline-none focus-visible:ring-0 rounded-none shadow-none"
                placeholder="Rechercher Un cours ..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-center border px-2.5 py-1.5 min-w-28 rounded-md bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
              <Image src="/icons/filter.svg" height={20} width={20} alt="filter ico" />
              <span className="text-[#ACACAC]">Filtres</span>
            </div>
          </div>

          {/* Section des filtres */}
          <div className="border p-4 flex flex-col items-end gap-4 rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-10 w-full">
              {/* Statut Filter */}
              <div className="flex flex-col gap-[7px]">
                <span className="font-medium text-gray-700">Statut</span>
                <Select
                  value={
                    filterPublished !== null
                      ? filterPublished
                        ? "published"
                        : "unpublished"
                      : "all"
                  }
                  onValueChange={(value) => {
                    if (value === "all") {
                      setFilterPublished(null);
                    } else {
                      setFilterPublished(value === "published");
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="unpublished">Non publié</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Pondération Filter */}
              <div className="flex flex-col gap-[7px]">
                <span className="font-medium text-muted-foreground">Pondération</span>
                <Select value={filterPonderation} onValueChange={setFilterPonderation}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="low">Faible {"<"} 50</SelectItem>
                    <SelectItem value="high">Élevée (≥50)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              className="bg-transparent border border-[#cbd9e7] text-[#ACACAC] hover:bg-gray-50 transition-colors"
              onClick={() => {
                setSearchTerm("");
                setFilterPublished(null);
                setFilterPonderation("all");
              }}
            >
              <Image src="/icons/close.svg" height={20} width={20} alt="close icon" />
              Réinitialiser les filtres
            </Button>
          </div>
        </>
      )}

      {/* Section des cours */}
      {filteredCourses.length > 0 ? (
        <div className="py-5 grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-5">
          {filteredCourses.map((course) => (
            <Link key={course.id} href={`/student/courses/${course.id}`}>
              <div className="border border-blue-200 rounded shadow-sm bg-white hover:shadow-md transition-shadow">
                <div className="p-2.5">
                  <Image
                    src="/icons/video-placeholder.svg"
                    width={200}
                    height={110}
                    alt="Aperçu du cours"
                    className="object-cover w-full h-auto rounded-md"
                  />
                  <div className="flex justify-between mt-2.5">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-xl ${
                        course.is_published
                          ? "bg-[#E8F8ED] text-[#1BB66C]"
                          : "bg-[#F1F5F9] text-[#334155]"
                      }`}
                    >
                      {course.is_published ? "Publié" : "Non publié"}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Image src="/icons/users.svg" alt="Participants" width={14} height={14} />
                      <span>{"49"} inscrits</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 space-y-2">
                  <p className="text-sm text-[#0466C8] font-medium leading-tight">{course.title}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gray-200 rounded-md" />
                    <div className="text-sm text-gray-800 flex flex-col">
                      <span className="text-[#0466C8]">
                        {course.formateurs[0]?.firstName} {course.formateurs[0]?.lastName}
                      </span>
                      <span className="text-[10px] text-gray-500">Professeur</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-10">
          <EmptyState
            icon="BookOpen"
            title={
              courses && courses.data.rows.length > 0
                ? "Aucun résultat trouvé"
                : "Aucun cours disponible"
            }
            description={
              courses && courses.data.rows.length > 0
                ? "Aucun cours ne correspond à vos critères de recherche ou de filtre."
                : "Il n'y a actuellement aucun cours à afficher."
            }
          />
        </div>
      )}
    </div>
  );
}
