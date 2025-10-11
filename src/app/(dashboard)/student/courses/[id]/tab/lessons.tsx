"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLessonsQuery } from "@/lib/apis/student-api";

export function LessonsTab() {
  const { id: courseId } = useParams();

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
        <p>No lessons available for this course.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Course Lessons ({lessons.length})</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <Card key={lesson.id}>
            <CardHeader>
              <CardTitle>{lesson.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{lesson.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
