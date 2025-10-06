"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useCreateStudentEvaluationMutation,
  useDeleteStudentEvaluationMutation,
} from "@/lib/apis/instructor/student-evaluation";

export function EvaluationTab() {
  const params = useParams();
  const lessonId = params.lessonId as string;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"exercise" | "homework" | "test" | "examen">("exercise");
  const [points, setPoints] = useState(100);
  const [submittiondate, setSubmittiondate] = useState("");
  const [ispublish, setIspublish] = useState(false);
  const [isImmediateResult, setIsImmediateResult] = useState(false);

  const [createEvaluation, { isLoading: isCreating }] = useCreateStudentEvaluationMutation();
  const [deleteEvaluation, { isLoading: isDeleting }] = useDeleteStudentEvaluationMutation();

  // For demo, assume we have a list, but since no query, use state or something
  // Since no GET endpoint, perhaps just add and remove locally for now
  const [evaluations, setEvaluations] = useState<any[]>([]);

  const handleCreate = async () => {
    if (!title.trim() || !description.trim() || !submittiondate) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    try {
      await createEvaluation({
        title,
        description,
        type,
        points,
        submittiondate,
        ispublish,
        isImmediateResult,
      }).unwrap();

      toast.success("Évaluation créée avec succès");
      setIsDialogOpen(false);
      resetForm();
      // In real app, refetch list
    } catch (error: any) {
      toast.error(error?.data?.message || "Erreur lors de la création");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette évaluation ?")) return;

    try {
      await deleteEvaluation({ id }).unwrap();
      toast.success("Évaluation supprimée");
      // Remove from local state
      setEvaluations(evaluations.filter((e) => e.id !== id));
    } catch (error: any) {
      toast.error(error?.data?.message || "Erreur lors de la suppression");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("exercise");
    setPoints(100);
    setSubmittiondate("");
    setIspublish(false);
    setIsImmediateResult(false);
  };

  return (
    <div className="bg-white border rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h3 className="text-lg font-semibold mb-2 sm:mb-0">Évaluations</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle évaluation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer une évaluation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre de l'évaluation"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description de l'évaluation"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={(value: any) => setType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exercise">Exercice</SelectItem>
                    <SelectItem value="homework">Devoir</SelectItem>
                    <SelectItem value="test">Test</SelectItem>
                    <SelectItem value="examen">Examen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="submittiondate">Date de soumission</Label>
                <Input
                  id="submittiondate"
                  type="datetime-local"
                  value={submittiondate}
                  onChange={(e) => setSubmittiondate(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ispublish"
                  checked={ispublish}
                  onCheckedChange={(checked) => setIspublish(checked === true)}
                />
                <Label htmlFor="ispublish">Publier</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isImmediateResult"
                  checked={isImmediateResult}
                  onCheckedChange={(checked) => setIsImmediateResult(checked === true)}
                />
                <Label htmlFor="isImmediateResult">Résultat immédiat</Label>
              </div>
              <Button onClick={handleCreate} disabled={isCreating} className="w-full">
                {isCreating ? "Création..." : "Créer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
                      <DropdownMenuItem
                        onClick={() => handleDelete(evaluation.id)}
                        className="text-red-600"
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
    </div>
  );
}
