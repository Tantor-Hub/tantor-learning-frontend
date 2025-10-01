"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetCourseByIdQuery } from "@/lib/apis/instructor/instructor";
import { ChevronLeft } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export function CourseHeader() {
  const params = useParams();
  const courseId = params.courseId as string;
  const router = useRouter();

  const { data: course, isLoading: isLoadingCourse } = useGetCourseByIdQuery({
    id_cours: courseId,
  });

  if (isLoadingCourse) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              className="hover:cursor-pointer hover:text-primary"
              onClick={() => router.back()}
            >
              <ChevronLeft size={50} />
            </button>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-96"></div>
            </div>
          </div>
          <div className="text-right animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-28"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button className="hover:cursor-pointer hover:text-primary" onClick={() => router.back()}>
            <ChevronLeft size={50} />
          </button>
          {course?.data ? (
            <div>
              <p className="text-2xl font-bold">{course.data.Title.title}</p>
              <p className="text-muted-foreground">{course.data.Title.description}</p>
            </div>
          ) : (
            <div>
              <p className="text-2xl font-bold">Aucune donnée du cours</p>
              <p className="text-muted-foreground">Les détails du cours sont indisponibles.</p>
            </div>
          )}
        </div>
        {course?.data ? (
          <div className="text-right">
            <div className="text-sm text-muted-foreground">{course.data.Session.designation}</div>
            <div className="text-sm text-muted-foreground">Durée: {course.data.Session.duree}</div>
            <div className="text-sm text-muted-foreground">
              Type: {course.data.Session.type_formation}
            </div>
          </div>
        ) : (
          <div className="text-right text-sm text-muted-foreground">
            Aucune information de session
          </div>
        )}
      </div>
    </div>
  );
}
