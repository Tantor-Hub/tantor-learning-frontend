"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Lesson } from "@/types/lessons";
import { ILesson } from "@/types/instructor";
import { BookOpen, Eye, EyeOff, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import {
  useDeleteLessonMutation,
  useUpdateLessonMutation,
  useGetLessonByIdQuery,
} from "@/lib/apis/lessons";

interface LessonCardProps {
  lesson: Lesson | ILesson;
  courseId: string;
  lessonId: string;
  onRefetch?: () => void;
}

export function LessonCard({ lesson, courseId, lessonId, onRefetch }: LessonCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    ispublish: false,
  });
  const [originalData, setOriginalData] = useState({
    title: "",
    description: "",
    ispublish: false,
  });

  const { data: lessonData, isLoading: isFetchingLesson } = useGetLessonByIdQuery(lesson.id, {
    skip: !isEditDialogOpen,
  });

  const [deleteLesson, { isLoading: isDeleting }] = useDeleteLessonMutation();
  const [updateLesson, { isLoading: isUpdating }] = useUpdateLessonMutation();

  // Effect to populate form data when edit dialog opens and lesson data is fetched
  useEffect(() => {
    if (isEditDialogOpen && lessonData?.data) {
      const data = lessonData.data;
      const formData = {
        title: data.title,
        description: data.description,
        ispublish: data.ispublish ?? false,
      };
      setEditFormData(formData);
      setOriginalData(formData);
    }
  }, [isEditDialogOpen, lessonData]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDeleteLesson = useCallback(
    async (lessonId: string) => {
      let toastId: string | null = null;
      try {
        toastId = toast.loading("Suppression de la leçon en cours...");

        await deleteLesson({ id: lessonId }).unwrap();

        if (toastId) {
          toast.dismiss(toastId);
          toastId = null;
        }

        toast.success("Leçon supprimée avec succès");
      } catch (error: any) {
        if (toastId) {
          toast.dismiss(toastId);
          toastId = null;
        }
        const status = error?.status;
        if (status === 401 || status === 403) {
          toast.error("Non autorisé. Veuillez vous reconnecter.");
        } else if (status === 404) {
          toast.error("Leçon introuvable");
        } else if (status >= 500) {
          toast.error("Erreur serveur. Réessayez plus tard.");
        } else {
          toast.error("Échec de la suppression de la leçon");
        }
        console.error("Error deleting lesson:", error);
      } finally {
        onRefetch?.();
      }
    },
    [deleteLesson, onRefetch]
  );

  const handleUpdateLesson = useCallback(
    async (
      lessonId: string,
      updateData: { title?: string; description?: string; ispublish?: boolean }
    ) => {
      let toastId: string | null = null;
      try {
        toastId = toast.loading("Mise à jour de la leçon en cours...");

        await updateLesson({
          id: lessonId,
          ...updateData,
        }).unwrap();

        if (toastId) {
          toast.dismiss(toastId);
          toastId = null;
        }

        toast.success("Leçon mise à jour avec succès");
      } catch (error: any) {
        if (toastId) {
          toast.dismiss(toastId);
          toastId = null;
        }
        const status = error?.status;
        if (status === 400) {
          toast.error("Données invalides pour la mise à jour");
        } else if (status === 401 || status === 403) {
          toast.error("Non autorisé. Veuillez vous reconnecter.");
        } else if (status === 404) {
          toast.error("Leçon introuvable");
        } else if (status >= 500) {
          toast.error("Erreur serveur. Réessayez plus tard.");
        } else {
          toast.error("Échec de la mise à jour de la leçon");
        }
        console.error("Error updating lesson:", error);
      } finally {
        onRefetch?.();
      }
    },
    [updateLesson, onRefetch]
  );

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Determine which fields have changed
    const updateData: { title?: string; description?: string; ispublish?: boolean } = {};
    if (editFormData.title !== originalData.title) {
      updateData.title = editFormData.title;
    }
    if (editFormData.description !== originalData.description) {
      updateData.description = editFormData.description;
    }
    if (editFormData.ispublish !== originalData.ispublish) {
      updateData.ispublish = editFormData.ispublish;
    }

    // If no changes, close dialog
    if (Object.keys(updateData).length === 0) {
      setIsEditDialogOpen(false);
      return;
    }

    await handleUpdateLesson(lesson.id, updateData);
    setIsEditDialogOpen(false);
  };

  const handleDeleteClick = async () => {
    await handleDeleteLesson(lesson.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow p-6">
        <div className="flex items-start justify-between mb-4">
          <Link
            href={`/instructor/courses/${courseId}/lessons/${lesson.id}`}
            className="flex-1 hover:no-underline"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                {("ispublish" in lesson ? lesson.ispublish : (lesson as any).is_published) ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
                <span
                  className={`text-xs font-medium ${
                    ("ispublish" in lesson ? lesson.ispublish : (lesson as any).is_published)
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {("ispublish" in lesson ? lesson.ispublish : (lesson as any).is_published)
                    ? "Publié"
                    : "Brouillon"}
                </span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600">
              {lesson.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{lesson.description}</p>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-2">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>Leçon</span>
            </div>
          </div>
          <span className="text-xs">Créé le {formatDate(lesson.createdAt)}</span>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier la leçon</DialogTitle>
          </DialogHeader>
          {isFetchingLesson ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Titre de la leçon</Label>
                <Input
                  id="edit-title"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2 flex items-center gap-2">
                <input
                  id="edit-ispublish"
                  type="checkbox"
                  checked={editFormData.ispublish}
                  onChange={(e) =>
                    setEditFormData((prev) => ({ ...prev, ispublish: e.target.checked }))
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="edit-ispublish" className="mb-0">
                  Publier la leçon
                </Label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Mise à jour..." : "Mettre à jour"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette leçon ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
