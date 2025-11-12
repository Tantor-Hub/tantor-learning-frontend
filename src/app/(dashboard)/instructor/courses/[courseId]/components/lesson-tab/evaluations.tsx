"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddLessonModal } from "./add-lesson";
import { UpdateEvaluationModal } from "./update-evaluation";
import { MoreHorizontal, Trash2, Edit, FileText, Ellipsis, CheckCircle } from "lucide-react";
import {
  useGetStudentEvaluationsBySessionCourseInstructorSecretaryQuery,
  useDeleteStudentEvaluationMutation,
} from "@/lib/apis/student-evaluations";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";

export function Evaluations() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: evaluationsData, isLoading } =
    useGetStudentEvaluationsBySessionCourseInstructorSecretaryQuery(
      { sessionCoursId: courseId },
      { skip: !courseId }
    );
  const [deleteEvaluation] = useDeleteStudentEvaluationMutation();

  const evaluations = evaluationsData?.data?.evaluations || [];

  const confirmDelete = async () => {
    if (!deleteId) return;
    await toast.promise(deleteEvaluation({ id: deleteId }).unwrap(), {
      loading: "Suppression…",
      success: "Évaluation supprimée",
      error: "Échec de la suppression",
    });
    setDeleteId(null);
  };

  const handleEdit = (id: string) => {
    setSelectedEvaluationId(id);
    setUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedEvaluationId(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h3 className="text-lg font-semibold mb-2 sm:mb-0">Évaluations</h3>
        <AddLessonModal courseId={courseId} />
      </div>

      {isLoading ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Date de soumission</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-20" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : evaluations.length === 0 ? (
        <div className="min-h-[200px] flex items-center justify-center text-gray-600">
          Aucune évaluation. Créez-en une nouvelle.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Date de soumission</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {evaluations.map((evaluation: any) => (
              <TableRow key={evaluation.id}>
                <TableCell>{evaluation.title}</TableCell>
                <TableCell>{evaluation.type}</TableCell>
                <TableCell>{evaluation.points}</TableCell>
                <TableCell>{new Date(evaluation.submittiondate).toLocaleString("fr-FR")}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Ellipsis className="hover:cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEdit(evaluation.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `/instructor/courses/${courseId}/evaluations/${evaluation.id}/questions?isImmediateResult=${evaluation.isImmediateResult}`
                          )
                        }
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Gérer les questions
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `/instructor/courses/${courseId}/evaluations/${evaluation.id}/students`
                          )
                        }
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Corriger
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setDeleteId(evaluation.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {selectedEvaluationId && (
        <UpdateEvaluationModal
          evaluationId={selectedEvaluationId}
          courseId={courseId}
          isOpen={updateModalOpen}
          onClose={handleCloseUpdateModal}
        />
      )}

      {deleteId && (
        <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer cette évaluation ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Les questions associées peuvent aussi être affectées.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <Button variant="destructive" onClick={confirmDelete}>
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
