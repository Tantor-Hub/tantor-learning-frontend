"use client";

import React from "react";
import { useParams } from "next/navigation";
import { LessonList } from "@/app/(dashboard)/instructor/courses/[courseId]/components/lesson-list";
import { CourseHeader } from "@/app/(dashboard)/instructor/courses/[courseId]/components/course-header";

export function CourseDetail() {
  const params = useParams();
  const courseId = params.courseId as string;

  return (
    <div className="min-h-screen p-6">
      {/* Header - Static content with its own loading state */}
      <CourseHeader />

      {/* Lessons */}
      <div className="p-6">
        <LessonList />
      </div>
    </div>
  );
}
