"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";
import {
  QuestionType,
  useCreateEvaluationQuestionMutation,
} from "@/lib/apis/instructor/evaluation-question";

interface AddEvaluationQuestionProps {
  evaluationId: string;
  isImmediateResult: boolean;
}

export function AddEvaluationQuestion({
  evaluationId,
  isImmediateResult,
}: AddEvaluationQuestionProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ text: "", points: 1 });
  const [createQuestion] = useCreateEvaluationQuestionMutation();

  const questionType = useMemo(
    () => (isImmediateResult ? QuestionType.MULTIPLE_CHOICE : QuestionType.TEXT),
    [isImmediateResult]
  );

  const reset = () => setForm({ text: "", points: 1 });

  const handleCreate = async () => {
    if (!form.text.trim()) return;
    const payload: any = {
      evaluationId,
      type: questionType,
      text: form.text,
      isImmediateResult,
      points: form.points,
    };
    await toast.promise(createQuestion(payload).unwrap(), {
      loading: "Création de la question…",
      success: "Question créée",
      error: (err: any) => err?.data?.message || "Échec de la création",
    });
    reset();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter une question
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Ajouter une nouvelle question</AlertDialogTitle>
          <AlertDialogDescription>
            Cette évaluation est {isImmediateResult ? "à résultat immédiat" : "à réponse libre"}. Le
            type de question sera {questionType}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="question-text">Texte de la question</Label>
            <Textarea
              id="question-text"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              placeholder="Entrez le texte de la question"
            />
          </div>
          <div>
            <Label htmlFor="question-points">Points</Label>
            <Input
              id="question-points"
              type="number"
              value={form.points}
              onChange={(e) => setForm({ ...form, points: parseInt(e.target.value) || 1 })}
              min="1"
            />
          </div>
          {isImmediateResult && (
            <div className="text-sm text-muted-foreground">
              Type: choix multiple. Les options seront ajoutées ultérieurement en éditant la
              question.
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel type="button" onClick={reset}>
            Annuler
          </AlertDialogCancel>
          <Button onClick={handleCreate} disabled={!form.text.trim()}>
            Créer la question
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AddEvaluationQuestion;
