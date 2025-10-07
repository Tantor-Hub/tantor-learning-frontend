"use client";

import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ArrowLeft, Trash2 } from "lucide-react";
import { MoreVertical, Pencil, ListPlus } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  useGetEvaluationQuestionsByEvaluationIdQuery,
  useCreateEvaluationQuestionMutation,
  useDeleteEvaluationQuestionMutation,
  QuestionType,
} from "@/lib/apis/instructor/evaluation-question";
// evaluation type is driven via URL param isImmediateResult; no evaluation fetch here

interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export default function EvaluationQuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = params.courseId as string;
  const evaluationId = params.evaluationId as string;
  // const paramIsImmediate = searchParams?.get("isImmediateResult");

  const [newQuestion, setNewQuestion] = useState({
    text: "",
    points: 1,
    isImmediateResult: false,
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: questionsData, isLoading } = useGetEvaluationQuestionsByEvaluationIdQuery(
    { evaluationId },
    { skip: !evaluationId }
  );

  const [createQuestion] = useCreateEvaluationQuestionMutation();
  const [deleteQuestion] = useDeleteEvaluationQuestionMutation();

  const questions = questionsData?.data || [];

  const handleAddOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, { text: "", isCorrect: false }],
    });
  };

  const handleOptionChange = (
    index: number,
    field: keyof QuestionOption,
    value: string | boolean
  ) => {
    const updatedOptions = newQuestion.options.map((option, i) =>
      i === index ? { ...option, [field]: value } : option
    );
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleRemoveOption = (index: number) => {
    if (newQuestion.options.length > 2) {
      setNewQuestion({
        ...newQuestion,
        options: newQuestion.options.filter((_, i) => i !== index),
      });
    }
  };

  const handleCreateQuestion = async () => {
    if (!newQuestion.text.trim()) return;
    const paramIsImmediate = searchParams?.get("isImmediateResult");
    const evalIsImmediate = paramIsImmediate === "true";
    const type = evalIsImmediate ? QuestionType.MULTIPLE_CHOICE : QuestionType.TEXT;
    const body: any = {
      evaluationId,
      type,
      text: newQuestion.text,
      isImmediateResult: evalIsImmediate,
      points: newQuestion.points,
    };

    await createQuestion(body);

    setNewQuestion({
      text: "",
      points: 1,
      isImmediateResult: false,
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    });
    setIsCreateOpen(false);
  };

  const handleDeleteQuestion = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) {
      await deleteQuestion({ id });
    }
  };

  if (isLoading) {
    return <div className="p-6">Chargement...</div>;
  }
  const paramIsImmediate = searchParams?.get("isImmediateResult");
  const evalIsImmediate = paramIsImmediate === "true";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/instructor/courses/${courseId}`)}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux évaluations
        </Button>
        <div className="flex items-center gap-3 ml-auto">
          <h1 className="text-2xl font-bold mr-2">Questions de l'évaluation</h1>
          <AlertDialog
            open={isCreateOpen}
            onOpenChange={(open) => {
              setIsCreateOpen(open);
              if (open) {
                setNewQuestion((prev) => ({
                  ...prev,
                  isImmediateResult: evalIsImmediate,
                }));
              }
            }}
          >
            <AlertDialogTrigger asChild>
              <Button size="sm" onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Ajouter une question
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Ajouter une nouvelle question</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette évaluation est {evalIsImmediate ? "à résultat immédiat" : "à réponse libre"}
                  . Le type de question sera{" "}
                  {evalIsImmediate ? QuestionType.MULTIPLE_CHOICE : QuestionType.TEXT}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="question-text">Texte de la question</Label>
                  <Textarea
                    id="question-text"
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                    placeholder="Entrez le texte de la question"
                  />
                </div>
                <div>
                  <Label htmlFor="question-points">Points</Label>
                  <Input
                    id="question-points"
                    type="number"
                    value={newQuestion.points}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) || 1 })
                    }
                    min="1"
                  />
                </div>
                {evalIsImmediate && (
                  <div className="text-sm text-muted-foreground">
                    Type: choix multiple. Les options seront ajoutées ultérieurement en éditant la
                    question.
                  </div>
                )}
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel
                  type="button"
                  onClick={() => {
                    setNewQuestion({
                      text: "",
                      points: 1,
                      isImmediateResult: evalIsImmediate,
                      options: [
                        { text: "", isCorrect: false },
                        { text: "", isCorrect: false },
                      ],
                    });
                  }}
                >
                  Annuler
                </AlertDialogCancel>
                <Button onClick={handleCreateQuestion} disabled={!newQuestion.text.trim()}>
                  Créer la question
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Il n'y a pas de questions pour le moment.</p>
          <p className="text-gray-500">Créez de nouvelles questions avec le bouton ci-dessous.</p>
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Questions existantes</h2>
          <div className="space-y-4">
            {questions.map((question: any) => (
              <Card key={question.id} className="border hover:shadow-sm transition">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            question.type === QuestionType.MULTIPLE_CHOICE ? "secondary" : "outline"
                          }
                        >
                          {question.type}
                        </Badge>
                        <Badge variant="outline">{question.points} points</Badge>
                        {question.isImmediateResult && <Badge>résultat immédiat</Badge>}
                      </div>
                      <span className="text-base font-medium leading-6">{question.text}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Ouvrir le menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/instructor/courses/${courseId}/evaluations/${evaluationId}/questions/${question.id}/edit`
                            )
                          }
                        >
                          <Pencil className="h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                        {question.isImmediateResult && (
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/instructor/courses/${courseId}/evaluations/${evaluationId}/questions/${question.id}/options`
                              )
                            }
                          >
                            <ListPlus className="h-4 w-4" /> Ajouter des options
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {question.type === QuestionType.MULTIPLE_CHOICE &&
                    question.options &&
                    question.options.length > 0 && (
                      <div className="space-y-1">
                        {question.options.map((option: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 text-sm text-muted-foreground"
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${option.isCorrect ? "bg-green-500" : "bg-gray-300"}`}
                            ></span>
                            <span>{option.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 hidden">
        <AlertDialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <AlertDialogTrigger asChild>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Ajouter une question
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Ajouter une nouvelle question</AlertDialogTitle>
              <AlertDialogDescription>
                Renseignez les informations de la question. Type:{" "}
                {evalIsImmediate ? QuestionType.MULTIPLE_CHOICE : QuestionType.TEXT}.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="question-text">Texte de la question</Label>
                <Textarea
                  id="question-text"
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  placeholder="Entrez le texte de la question"
                />
              </div>

              <div>
                <Label htmlFor="question-points">Points</Label>
                <Input
                  id="question-points"
                  type="number"
                  value={newQuestion.points}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) || 1 })
                  }
                  min="1"
                />
              </div>
              {evalIsImmediate && (
                <div className="text-sm text-muted-foreground">
                  Type: choix multiple. Les options seront ajoutées ultérieurement en éditant la
                  question.
                </div>
              )}
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel
                type="button"
                onClick={() => {
                  setNewQuestion({
                    text: "",
                    points: 1,
                    isImmediateResult: evalIsImmediate,
                    options: [
                      { text: "", isCorrect: false },
                      { text: "", isCorrect: false },
                    ],
                  });
                }}
              >
                Annuler
              </AlertDialogCancel>
              <Button onClick={handleCreateQuestion} disabled={!newQuestion.text.trim()}>
                Créer la question
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
