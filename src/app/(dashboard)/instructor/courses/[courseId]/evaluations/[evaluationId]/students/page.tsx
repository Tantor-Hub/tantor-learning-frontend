"use client";
import React from "react";
import { useParams } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetStudentsByEvaluationIdQuery,
  useUpdateMarkingStatusMutation,
  useGetMarkingStatusQuery,
} from "@/lib/apis/student-evaluations";
import { useRouter } from "next/navigation";
import { Eye, MoreHorizontal, Upload } from "lucide-react";
import { MarkingStatus } from "@/types/student-evaluations";
import { toast } from "react-hot-toast";

export default function StudentsByEvaluation() {
  const params = useParams();
  const evaluationId = params.evaluationId as string;
  const courseId = params.courseId as string;
  const router = useRouter();

  const { data: studentsData, isLoading } = useGetStudentsByEvaluationIdQuery(
    { evaluationId },
    { skip: !evaluationId }
  );

  const { data: markingStatusData } = useGetMarkingStatusQuery(
    { evaluationId },
    { skip: !evaluationId }
  );

  const [updateMarkingStatus] = useUpdateMarkingStatusMutation();

  const students = studentsData?.data?.students || [];
  const evaluation = studentsData?.data?.evaluation;
  const currentStatus = (markingStatusData?.data?.markingStatus ||
    evaluation?.markingStatus) as MarkingStatus;

  const handleStatusUpdate = async (newStatus: MarkingStatus) => {
    // Validate status progression
    const statusOrder = [
      MarkingStatus.PENDING,
      MarkingStatus.IN_PROGRESS,
      MarkingStatus.COMPLETED,
      MarkingStatus.PUBLISHED,
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const newIndex = statusOrder.indexOf(newStatus);

    if (newIndex <= currentIndex) {
      toast.error("Impossible de revenir à un statut précédent");
      return;
    }

    await toast.promise(updateMarkingStatus({ evaluationId, markingStatus: newStatus }).unwrap(), {
      loading: "Mise à jour du statut...",
      success: "Statut mis à jour avec succès",
      error: "Erreur lors de la mise à jour du statut",
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case MarkingStatus.PENDING:
        return "bg-gray-100 text-gray-800";
      case MarkingStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800";
      case MarkingStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case MarkingStatus.PUBLISHED:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case MarkingStatus.PENDING:
        return "En attente";
      case MarkingStatus.IN_PROGRESS:
        return "En cours";
      case MarkingStatus.COMPLETED:
        return "Terminé";
      case MarkingStatus.PUBLISHED:
        return "Publié";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom de l'étudiant</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Réponses totales</TableHead>
              <TableHead>Réponses corrigées</TableHead>
              <TableHead>Pourcentage corrigé</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-20" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Étudiants pour cette évaluation</h3>
          {currentStatus && (
            <Badge className={getStatusBadgeColor(currentStatus)}>
              {getStatusLabel(currentStatus)}
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          {currentStatus === MarkingStatus.COMPLETED && (
            <Button
              onClick={() => handleStatusUpdate(MarkingStatus.PUBLISHED)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Upload className="mr-2 h-4 w-4" />
              Publier les résultats
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {currentStatus !== MarkingStatus.IN_PROGRESS && (
                <DropdownMenuItem onClick={() => handleStatusUpdate(MarkingStatus.IN_PROGRESS)}>
                  Commencer la correction
                </DropdownMenuItem>
              )}
              {currentStatus !== MarkingStatus.COMPLETED && (
                <DropdownMenuItem onClick={() => handleStatusUpdate(MarkingStatus.COMPLETED)}>
                  Marquer comme terminé
                </DropdownMenuItem>
              )}
              {currentStatus !== MarkingStatus.PUBLISHED && (
                <DropdownMenuItem onClick={() => handleStatusUpdate(MarkingStatus.PUBLISHED)}>
                  Publier les résultats
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={() => router.back()} variant="outline">
            Retour
          </Button>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="min-h-[200px] flex items-center justify-center text-gray-600">
          Aucun étudiant n'a répondu à cette évaluation.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom de l'étudiant</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Réponses totales</TableHead>
              <TableHead>Réponses corrigées</TableHead>
              <TableHead>Pourcentage corrigé</TableHead>
              {!evaluation?.isImmediateResult && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student: any) => (
              <TableRow key={student.id}>
                <TableCell>
                  {student.firstName} {student.lastName}
                </TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.totalAnswers}</TableCell>
                <TableCell>{student.markedAnswers}</TableCell>
                <TableCell>{student.markedPercentage}%</TableCell>
                {!evaluation?.isImmediateResult && (
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/instructor/courses/${courseId}/evaluations/${evaluationId}/students/${student.id}/answers`
                        )
                      }
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Voir réponses
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
