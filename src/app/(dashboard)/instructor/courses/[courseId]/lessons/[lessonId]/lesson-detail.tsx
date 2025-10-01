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
    return <Skeleton className="min-h-screen p-6" />;
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
      <div className="min-h-screen p-6">
        <Tabs defaultValue="contenu" className="w-full">
          <TabsList className="bg-white border font-semibold px-2.5 py-6 grid-cols-1 gap-4">
            <TabsTrigger value="contenu" className="p-5 px-2 md:px-5">
              Contenu
            </TabsTrigger>
            <TabsTrigger value="evaluations" className="p-5 px-2 md:px-5">
              Évaluations
            </TabsTrigger>
            <TabsTrigger value="devoirs" className="p-5 px-2 md:px-5">
              Devoirs
            </TabsTrigger>
          </TabsList>
          <TabsContent value="contenu">
            <div className="min-h-[200px] flex items-center justify-center text-gray-600">
              Le contenu n'est pas encore prêt. Commencez à le recréer.
            </div>
          </TabsContent>
          <TabsContent value="evaluations">
            <div className="min-h-[200px] flex items-center justify-center text-gray-600">
              Les évaluations ne sont pas encore prêtes. Commencez à les recréer.
            </div>
          </TabsContent>
          <TabsContent value="devoirs">
            <div className="min-h-[200px] flex items-center justify-center text-gray-600">
              Les devoirs ne sont pas encore prêts. Commencez à les recréer.
            </div>
          </TabsContent>
        </Tabs>
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
      <Tabs defaultValue="contenu" className="w-full">
        <TabsList className="bg-white border font-semibold px-2.5 py-6 grid-cols-1 gap-4">
          <TabsTrigger value="contenu" className="p-5 px-2 md:px-5">
            Contenu
          </TabsTrigger>
          <TabsTrigger value="evaluations" className="p-5 px-2 md:px-5">
            Évaluations
          </TabsTrigger>
          <TabsTrigger value="devoirs" className="p-5 px-2 md:px-5">
            Devoirs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="contenu">
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Contenu de la leçon</h3>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                + Contenu
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">Introduction à la Programmation</h4>
                <p className="text-gray-600">
                  Cette vidéo explique les bases de la programmation en Python. Durée: 15 minutes.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">Document PDF: Variables et Types</h4>
                <p className="text-gray-600">
                  Un document détaillé sur les variables et les types de données en programmation.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">Exercice Pratique</h4>
                <p className="text-gray-600">
                  Écrivez un programme simple pour calculer la somme de deux nombres.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="evaluations">
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Quiz (Évaluations)</h3>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                + Évaluation
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">Quiz 1: Bases de la Programmation</h4>
                <p className="text-gray-600">
                  10 questions à choix multiples. Durée: 20 minutes. Score moyen: 85%.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">Exercice: Algorithmes Simples</h4>
                <p className="text-gray-600">
                  Résoudre 5 problèmes algorithmiques de base. Note maximale: 20 points.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">Test Final: Programmation Avancée</h4>
                <p className="text-gray-600">
                  Évaluation complète avec code et questions théoriques. Durée: 1 heure.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="devoirs">
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Devoirs</h3>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                + Devoir
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">Projet 1: Application Console</h4>
                <p className="text-gray-600">
                  Développer une application console en Python pour gérer une liste de tâches. Date
                  limite: 15 mai.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">Devoir Maison: Algorithmes de Tri</h4>
                <p className="text-gray-600">
                  Implémenter et comparer différents algorithmes de tri. Rapport requis. Date
                  limite: 20 mai.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">Tâche: Révision des Concepts</h4>
                <p className="text-gray-600">
                  Réviser les concepts de base et préparer des questions pour la prochaine séance.
                  Soumission: 10 mai.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
