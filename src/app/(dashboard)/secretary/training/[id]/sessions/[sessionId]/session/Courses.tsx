"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddCourseModal } from "../components/add-course-modal";

export default function Courses({ sessionId }: { sessionId: string }) {
  // Placeholder content - in a real app, this would fetch courses data
  const courses = [
    { id: 1, title: "Introduction aux concepts", duration: "2h", status: "Complété" },
    { id: 2, title: "Pratique avancée", duration: "3h", status: "En cours" },
    { id: 3, title: "Projet final", duration: "4h", status: "À venir" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Cours de la session</h3>
        <AddCourseModal sessionId={sessionId} />
      </div>
      {courses.map((course) => (
        <Card key={course.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">{course.title}</CardTitle>
            <Badge
              variant={
                course.status === "Complété"
                  ? "default"
                  : course.status === "En cours"
                    ? "secondary"
                    : "outline"
              }
            >
              {course.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <p>Durée: {course.duration}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
