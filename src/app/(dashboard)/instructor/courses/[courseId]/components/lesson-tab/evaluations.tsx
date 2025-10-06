"use client";
import React, { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddLessonModal } from "./add-lesson";
import { MoreHorizontal, Trash2 } from "lucide-react";

export function Evaluations() {
  const params = useParams();
  const courseId = params.courseId as string;

  // For demo, assume we have a list, but since no query, use state or something
  // Since no GET endpoint, perhaps just add and remove locally for now
  const [evaluations, setEvaluations] = useState<any[]>([]);

  return (
    <div className="bg-white border rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h3 className="text-lg font-semibold mb-2 sm:mb-0">Évaluations</h3>
        <AddLessonModal courseId={courseId} />
      </div>

      {evaluations.length === 0 ? (
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
            {evaluations.map((evaluation) => (
              <TableRow key={evaluation.id}>
                <TableCell>{evaluation.title}</TableCell>
                <TableCell>{evaluation.type}</TableCell>
                <TableCell>{evaluation.points}</TableCell>
                <TableCell>{new Date(evaluation.submittiondate).toLocaleString("fr-FR")}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem className="text-red-600">
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
    </div>
  );
}
