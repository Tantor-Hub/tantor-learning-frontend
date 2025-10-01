"use client";

import { useListAllCoursesByIdInstructorQuery } from "@/lib/apis/instructor/instructor";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import Image from "next/image";

export function CourseList() {
  const currentUser = useSelector(selectCurrentUser);
  const {
    data: courses,
    isLoading,
    error,
  } = useListAllCoursesByIdInstructorQuery(
    { formateurId: currentUser?.id || "" },
    { skip: !currentUser?.id }
  );

  // Show loading state if user is not loaded yet
  if (!currentUser?.id) {
    return null; // Suspense will handle the loading state
  }

  if (isLoading) {
    return null; // Suspense will handle the loading state
  }

  if (error) {
    return (
      <div className="py-10">
        <EmptyState
          icon="ExclamationTriangleIcon"
          title="Erreur de chargement"
          description="Une erreur s'est produite lors du chargement des cours."
        />
      </div>
    );
  }

  if (!courses?.data.rows.length) {
    return (
      <div className="py-10">
        <EmptyState
          icon="BookIcon"
          title="Aucun cours disponible"
          description="Il n'y a actuellement aucun cours à afficher."
        />
      </div>
    );
  }

  return (
    <div className="py-5 grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-5">
      {courses.data.rows.map((course) => (
        <Link key={course.id} href={`/instructor/courses/${course.id}`}>
          <div className="border border-blue-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
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
                      : "bg-[#FDF6E8] text-[#DFA100]"
                  }`}
                >
                  {course.is_published ? "Publié" : "Brouillon"}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Image src="/icons/users.svg" alt="Participants" width={14} height={14} />
                  <span>0 inscrits</span>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 space-y-2">
              <p className="text-sm text-[#0466C8] font-medium leading-tight">{course.title}</p>
              <div className="text-xs text-gray-600 mb-2">
                <p className="truncate">{course.description}</p>
                <p className="text-gray-500">
                  Créé le {new Date(course.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gray-200 rounded-md" />
                <div className="text-sm text-gray-800 flex flex-col">
                  <span className="text-[#0466C8]">Formateur</span>
                  <span className="text-[10px] text-gray-500">Professeur</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
