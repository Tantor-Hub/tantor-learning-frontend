"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useGetLessonsQuery } from "@/lib/apis/student-api";

export function LessonsTab() {
  const { id: courseId } = useParams();
  const router = useRouter();

  // This is where the query to fetch lessons for the student in the course is created
  const { data, isLoading, error } = useGetLessonsQuery(courseId as string);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Error: {error instanceof Error ? error.message : "An error occurred"}
      </div>
    );
  }

  const lessons = data?.data.rows || [];
  if (lessons.length === 0) {
    return (
      <div className="text-center py-8">
        <p>Aucune leçon n'est disponible pour cette matière.</p>
      </div>
    );
  }

  const handleLessonClick = (lessonId: string) => {
    router.push(`/student/courses/${courseId}/lesson/${lessonId}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Course Lessons ({lessons.length})</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{lesson.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{lesson.description}</p>
              <Button onClick={() => handleLessonClick(lesson.id)} className="w-full">
                Voir les matériaux
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
