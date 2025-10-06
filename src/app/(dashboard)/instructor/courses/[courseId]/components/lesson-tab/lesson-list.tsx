"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useGetLessonsByCourseIdQuery,
  useCreateLessonMutation,
} from "@/lib/apis/instructor/instructor";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LessonCard } from "../lesson-card";
import { EmptyState } from "@/components/shared/empty-state";
import { CreateLessonDialog } from "../create-lesson-dialog";
import { LessonListSkeleton } from "@/components/skeletons/lesson-list-skeleton";
import { toast } from "react-hot-toast";

export function LessonList() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: lessons, isLoading } = useGetLessonsByCourseIdQuery(
    { courseId },
    { skip: !courseId }
  );

  const [createLesson, { isLoading: isCreating }] = useCreateLessonMutation();

  if (isLoading) {
    return <LessonListSkeleton />;
  }

  const handleCreateLesson = async (lessonData: {
    title: string;
    description: string;
    ispublish?: boolean;
  }) => {
    let toastId: string | null = null;
    try {
      if (toastId) {
        toast.dismiss(toastId);
        toastId = null;
      }

      toastId = toast.loading("Création de la leçon en cours...");

      const response = await createLesson({
        title: lessonData.title,
        description: lessonData.description,
        id_cours: courseId,
        ...(lessonData.ispublish !== undefined ? { ispublish: lessonData.ispublish } : {}),
      }).unwrap();
      console.log(response);

      if (toastId) {
        toast.dismiss(toastId);
        toastId = null;
      }

      toast.success("Leçon créée avec succès");
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      if (toastId) {
        toast.dismiss(toastId);
        toastId = null;
      }
      const status = error?.status;
      if (status === 400) {
        toast.error("Données invalides pour la création de la leçon");
      } else if (status === 401 || status === 403) {
        toast.error("Non autorisé. Veuillez vous reconnecter.");
      } else if (status === 404) {
        toast.error("Cours introuvable pour cette leçon");
      } else if (status >= 500) {
        toast.error("Erreur serveur. Réessayez plus tard.");
      } else {
        toast.error("Échec de la création de la leçon");
      }
      console.error("Error creating lesson:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with create button - Static content */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leçons</h2>
          <p className="text-gray-600">Gérez les leçons de votre cours</p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          disabled={isCreating}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Créer une leçon
        </Button>
      </div>

      {/* Lessons grid - Dynamic content */}
      {!lessons?.data?.rows?.length ? (
        <div className="py-10">
          <EmptyState
            icon="BookOpenIcon"
            title="Aucune leçon"
            description="Commencez par créer votre première leçon pour ce cours."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons?.data?.rows?.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} courseId={courseId} />
          ))}
        </div>
      )}

      {/* Create lesson dialog */}
      <CreateLessonDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateLesson}
        isLoading={isCreating}
      />
    </div>
  );
}
