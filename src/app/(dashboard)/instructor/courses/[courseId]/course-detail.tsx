"use client";

import React from "react";
import { useParams } from "next/navigation";
import { LessonList } from "@/app/(dashboard)/instructor/courses/[courseId]/components/lesson-tab/lesson-list";
import { CourseHeader } from "@/app/(dashboard)/instructor/courses/[courseId]/components/course-header";
import { LesssonContainer } from "./components/lesson-tab/lesson-container";

export function CourseDetail() {
  const params = useParams();
  const courseId = params.courseId as string;

  return (
    <div>
      {/* Header - Static content with its own loading state */}
      <CourseHeader />

      {/* Lessons */}

      <LesssonContainer />
    </div>
  );
}
