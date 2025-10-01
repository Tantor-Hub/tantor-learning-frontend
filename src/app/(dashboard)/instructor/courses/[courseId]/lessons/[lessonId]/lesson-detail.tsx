"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetLessonByIdQuery } from "@/lib/apis/instructor/instructor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, ClipboardList, FileText } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export function LessonDetail() {
  const params = useParams();
  const lessonId = params.lessonId as string;
  const courseId = params.courseId as string;
  const router = useRouter();

  const {
    data: lesson,
    isLoading: isLoadingLesson,
    error,
  } = useGetLessonByIdQuery({ lessonId }, { skip: !lessonId });

  if (isLoadingLesson) {
    return null; // Suspense will handle the loading state
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <EmptyState
          icon="ExclamationTriangleIcon"
          title="Erreur de chargement"
          description="Une erreur s'est produite lors du chargement de la leçon."
        />
      </div>
    );
  }

  if (!lesson?.data) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Leçon non trouvée</p>
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
              <p className="text-2xl font-bold">{lesson.data.title}</p>
              <p className="text-muted-foreground">{lesson.data.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              Créé le {new Date(lesson.data.createdAt).toLocaleDateString("fr-FR")}
            </div>
            <div className="text-sm text-muted-foreground">
              Modifié le {new Date(lesson.data.updatedAt).toLocaleDateString("fr-FR")}
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Contenu de la leçon</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                Le contenu de cette leçon sera disponible ici. Vous pourrez ajouter des vidéos, des
                documents, des exercices et d'autres ressources pédagogiques.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Ajouter du contenu
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                Importer des fichiers
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Quiz (Évaluations)</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                Gérez les évaluations pour cette leçon. Créez des quiz, des exercices et des tests
                pour évaluer la compréhension des étudiants.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Créer un quiz
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                Ajouter un exercice
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Devoirs</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                Gérez les devoirs pour cette leçon. Créez des assignments, des projets et des tâches
                pour renforcer l'apprentissage des étudiants.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                Créer un devoir
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                Ajouter une tâche
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
