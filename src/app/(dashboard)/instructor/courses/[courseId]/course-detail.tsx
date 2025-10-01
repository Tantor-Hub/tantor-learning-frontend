"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetCourseByIdQuery } from "@/lib/apis/instructor/instructor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText } from "lucide-react";
import { ContentTabs } from "../content-tab";
import { DocumentTabs } from "../document-tab";
import { LessonList } from "@/app/(dashboard)/instructor/courses/[courseId]/components/lesson-list";
import { CourseHeader } from "@/app/(dashboard)/instructor/courses/[courseId]/components/course-header";

export function CourseDetail() {
  const params = useParams();
  const courseId = params.courseId as string;

  const { data: course, refetch: refetchCourse } = useGetCourseByIdQuery({
    id_cours: courseId,
  });

  return (
    <div className="min-h-screen p-6">
      {/* Header - Static content with its own loading state */}
      <CourseHeader />

      {/* Tabs */}
      <Tabs defaultValue="lessons">
        <TabsList className="bg-white border font-semibold px-2.5 py-6 grid-cols-3 gap-4">
          <TabsTrigger value="lessons" className="p-5 px-2 md:px-5">
            <BookOpen className="w-4 h-4 mr-2" />
            Leçons
          </TabsTrigger>
          <TabsTrigger value="content" className="p-5 px-2 md:px-5">
            <BookOpen className="w-4 h-4 mr-2" />
            Contenu du cours
          </TabsTrigger>
          <TabsTrigger value="document" className="p-5 px-2 md:px-5">
            <FileText className="w-4 h-4 mr-2" />
            Documents ({course?.data?.Documents?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lessons">
          <div className="p-6">
            <LessonList />
          </div>
        </TabsContent>

        <TabsContent value="content">
          <ContentTabs
            courseId={courseId}
            initialChapters={course?.data?.Chapitres || []}
            refetchCourse={refetchCourse}
          />
        </TabsContent>

        <TabsContent value="document">
          <DocumentTabs
            courseId={courseId}
            initialDocuments={course?.data?.Documents || []}
            refetchCourse={refetchCourse}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
