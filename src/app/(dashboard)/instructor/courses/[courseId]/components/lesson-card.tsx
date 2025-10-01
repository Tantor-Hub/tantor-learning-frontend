"use client";

import Link from "next/link";
import { ILesson } from "@/types/instructor";
import { Clock, BookOpen, Eye, EyeOff } from "lucide-react";

interface LessonCardProps {
  lesson: ILesson;
  courseId: string;
}

export function LessonCard({ lesson, courseId }: LessonCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Link href={`/instructor/courses/${courseId}/lessons/${lesson.id}`}>
      <div className="border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-500">#{lesson.order}</span>
              <div className="flex items-center gap-1">
                {lesson.is_published ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
                <span
                  className={`text-xs font-medium ${
                    lesson.is_published ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {lesson.is_published ? "Publié" : "Brouillon"}
                </span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {lesson.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{lesson.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(lesson.duration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>Leçon</span>
            </div>
          </div>
          <span className="text-xs">Créé le {formatDate(lesson.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
