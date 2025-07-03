"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetCourseByIdQuery } from "@/lib/apis/instructor/instructor";
import { Loading } from "@/components/shared/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText } from "lucide-react";
import { ContentTabs } from "../content-tab";
import { DocumentTabs } from "../document-tab";
import { ChevronLeft } from "lucide-react";

export default function Page() {
  const params = useParams();
  const courseId = params.courseId as string;
  const router = useRouter();

  const {
    data: course,
    isLoading: isLoadingCourse,
    refetch: refetchCourse,
  } = useGetCourseByIdQuery({
    id_cours: courseId,
  });

  if (isLoadingCourse) return <Loading />;
  console.log(JSON.stringify(course));
  if (!course?.data) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Cours non trouvé</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retourner
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              className="hover:cursor-pointer hover:text-primary"
              onClick={() => router.back()}
            >
              <ChevronLeft size={50} />
            </button>
            <div>
              <p className="text-2xl font-bold">{course.data.Title.title}</p>
              <p className="text-muted-foreground">{course.data.Title.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">{course.data.Session.designation}</div>
            <div className="text-sm text-muted-foreground">Durée: {course.data.Session.duree}</div>
            <div className="text-sm text-muted-foreground">
              Type: {course.data.Session.type_formation}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="content">
        <TabsList className="bg-white border font-semibold px-2.5 py-6 grid-cols-1 gap-4">
          <TabsTrigger value="content" className="p-5 px-2 md:px-5">
            <BookOpen className="w-4 h-4 mr-2" />
            Contenu du cours
          </TabsTrigger>
          <TabsTrigger value="document" className="p-5 px-2 md:px-5">
            <FileText className="w-4 h-4 mr-2" />
            Documents ({course.data.Documents?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <ContentTabs
            courseId={courseId}
            initialChapters={course.data.Chapitres}
            refetchCourse={refetchCourse}
          />
        </TabsContent>

        <TabsContent value="document">
          <DocumentTabs
            courseId={courseId}
            initialDocuments={course.data.Documents || []}
            refetchCourse={refetchCourse}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
