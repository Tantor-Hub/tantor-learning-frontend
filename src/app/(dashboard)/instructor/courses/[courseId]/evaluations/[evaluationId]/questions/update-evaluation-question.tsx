"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  QuestionType,
  useUpdateEvaluationQuestionMutation,
} from "@/lib/apis/instructor/evaluation-question";

interface UpdateEvaluationQuestionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: { id: string; text: string; points: number } | null;
  isImmediateResult: boolean;
}

export default function UpdateEvaluationQuestion({
  open,
  onOpenChange,
  question,
  isImmediateResult,
}: UpdateEvaluationQuestionProps) {
  const [form, setForm] = useState(() => ({
    text: question?.text ?? "",
    points: question?.points ?? 1,
  }));
  const [updateQuestion, { isLoading }] = useUpdateEvaluationQuestionMutation();

  React.useEffect(() => {
    setForm({ text: question?.text ?? "", points: question?.points ?? 1 });
  }, [question]);

  const submit = async () => {
    if (!question) return;
    await toast.promise(
      updateQuestion({ id: question.id, body: { text: form.text, points: form.points } }).unwrap(),
      { loading: "Mise à jour…", success: "Question mise à jour", error: "Échec de la mise à jour" }
    );
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Modifier la question</AlertDialogTitle>
          <AlertDialogDescription>
            Type: {isImmediateResult ? QuestionType.MULTIPLE_CHOICE : QuestionType.TEXT}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-question-text">Texte</Label>
            <Textarea
              id="edit-question-text"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-question-points">Points</Label>
            <Input
              id="edit-question-points"
              type="number"
              value={form.points}
              onChange={(e) => setForm({ ...form, points: parseInt(e.target.value) || 1 })}
              min="1"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Annuler</AlertDialogCancel>
          <Button disabled={!form.text.trim() || isLoading} onClick={submit}>
            Enregistrer
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
