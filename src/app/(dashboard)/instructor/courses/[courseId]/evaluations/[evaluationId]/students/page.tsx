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
import { useGetStudentsByEvaluationIdQuery } from "@/lib/apis/student-evaluations";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";

export default function StudentsByEvaluation() {
  const params = useParams();
  const evaluationId = params.evaluationId as string;
  const courseId = params.courseId as string;
  const router = useRouter();

  const { data: studentsData, isLoading } = useGetStudentsByEvaluationIdQuery(
    { evaluationId },
    { skip: !evaluationId }
  );

  const students = studentsData?.data?.students || [];

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
        <h3 className="text-lg font-semibold">Étudiants pour cette évaluation</h3>

        <Button onClick={() => router.back()} variant="outline">
          Retour
        </Button>
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
              <TableHead>Actions</TableHead>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
