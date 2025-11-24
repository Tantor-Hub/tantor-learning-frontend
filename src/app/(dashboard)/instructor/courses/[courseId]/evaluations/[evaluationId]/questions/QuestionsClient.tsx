"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Pencil, ListPlus, Trash2, ArrowLeft, EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  QuestionType,
  useDeleteEvaluationQuestionMutation,
  useGetEvaluationQuestionsByEvaluationIdQuery,
} from "@/lib/apis/instructor/evaluation-question";
import {
  useCreateOptionMutation,
  useDeleteOptionMutation,
  useGetOptionsByQuestionIdQuery,
  useUpdateOptionMutation,
} from "@/lib/apis/instructor/evaluation-question-option";
import { toast } from "react-hot-toast";
import AddEvaluationQuestion from "./add-evaluation-question";
import UpdateEvaluationQuestion from "./update-evaluation-question";
import QuestionsSkeleton from "./questions-skeleton";

export default function QuestionsClient() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = params.courseId as string;
  const evaluationId = params.evaluationId as string;

  const { data: questionsData, isLoading } = useGetEvaluationQuestionsByEvaluationIdQuery(
    { evaluationId },
    { skip: !evaluationId }
  );
  const questions = questionsData?.data || [];

  const paramIsImmediate = searchParams?.get("isImmediateResult");
  const evalIsImmediate = paramIsImmediate === "true";

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<{
    id: string;
    text: string;
    points: number;
  } | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteQuestion] = useDeleteEvaluationQuestionMutation();

  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [activeQuestionText, setActiveQuestionText] = useState<string>("");
  const { data: optionsData, refetch: refetchOptions } = useGetOptionsByQuestionIdQuery(
    { questionId: activeQuestionId || "" },
    { skip: !activeQuestionId }
  );
  const [createOption, { isLoading: isCreatingOption }] = useCreateOptionMutation();
  const [updateOption, { isLoading: isUpdatingOption }] = useUpdateOptionMutation();
  const [deleteOption] = useDeleteOptionMutation();
  const [newOption, setNewOption] = useState({ text: "", isCorrect: false });
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [editingOption, setEditingOption] = useState<{ text: string; isCorrect: boolean }>({
    text: "",
    isCorrect: false,
  });

  const QuestionOptionsList = ({ questionId }: { questionId: string }) => {
    const { data } = useGetOptionsByQuestionIdQuery({ questionId }, { skip: !questionId });
    const opts = data?.data || [];
    if (opts.length === 0) return null;
    return (
      <div className="space-y-1">
        {opts.map((option: any) => (
          <div
            key={option.id}
            className="flex items-center space-x-2 text-sm text-muted-foreground"
          >
            <span
              className={`w-2 h-2 rounded-full ${option.isCorrect ? "bg-green-500" : "bg-gray-300"}`}
            ></span>
            <span>{option.text}</span>
          </div>
        ))}
      </div>
    );
  };

  const onConfirmDelete = async () => {
    if (!deletingId) return;
    await toast.promise(deleteQuestion({ id: deletingId }).unwrap(), {
      loading: "Suppression…",
      success: "Question supprimée",
      error: "Échec de la suppression",
    });
    setDeletingId(null);
  };

  if (isLoading) {
    return <QuestionsSkeleton />;
  }

  return (
    <div>
      <div className="space-y-4">
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux évaluations
        </Button>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">Questions de l'évaluation</h1>
          <AddEvaluationQuestion evaluationId={evaluationId} isImmediateResult={evalIsImmediate} />
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Il n'y a pas de questions pour le moment.</p>
          <p className="text-gray-500">Créez de nouvelles questions avec le bouton ci-dessus.</p>
        </div>
      ) : (
        <div className="mb-8">
          <div className="space-y-4">
            {questions.map((question: any) => (
              <Card key={question.id} className="border rounded">
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
                        <EllipsisVertical className="hover:cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingQuestion({
                              id: question.id,
                              text: question.text,
                              points: question.points,
                            });
                            setIsEditOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                        {question.isImmediateResult && (
                          <DropdownMenuItem
                            onClick={() => {
                              setActiveQuestionId(question.id);
                              setActiveQuestionText(question.text);
                            }}
                          >
                            <ListPlus className="h-4 w-4" /> Ajouter des options
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeletingId(question.id)}
                        >
                          <Trash2 className="h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {question.type === QuestionType.MULTIPLE_CHOICE && (
                    <QuestionOptionsList questionId={question.id} />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <UpdateEvaluationQuestion
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        question={editingQuestion}
        isImmediateResult={evalIsImmediate}
      />

      {deletingId && (
        <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer la question ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. La question et ses options seront supprimées.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <Button variant="destructive" onClick={onConfirmDelete}>
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {activeQuestionId && (
        <AlertDialog
          open={!!activeQuestionId}
          onOpenChange={(open) => {
            if (!open) {
              setActiveQuestionId(null);
              setNewOption({ text: "", isCorrect: false });
              setEditingOptionId(null);
              setEditingOption({ text: "", isCorrect: false });
            }
          }}
        >
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Ajouter des options</AlertDialogTitle>
              <AlertDialogDescription>{activeQuestionText}</AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Options existantes</Label>
                <div className="space-y-1">
                  {(optionsData?.data || []).map((opt: any) => (
                    <div
                      key={(opt?.id ?? `${opt?.text}`) as string}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${opt.isCorrect ? "bg-green-500" : "bg-gray-300"}`}
                      ></span>
                      {editingOptionId === opt.id ? (
                        <>
                          <Input
                            value={editingOption.text}
                            onChange={(e) =>
                              setEditingOption({ ...editingOption, text: e.target.value })
                            }
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={editingOption.isCorrect}
                              onChange={(e) =>
                                setEditingOption({ ...editingOption, isCorrect: e.target.checked })
                              }
                            />
                            <Label>Correct</Label>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!editingOption.text.trim() || isUpdatingOption}
                            onClick={async () => {
                              await toast.promise(
                                updateOption({
                                  id: opt.id as string,
                                  body: {
                                    text: editingOption.text,
                                    isCorrect: editingOption.isCorrect,
                                  },
                                }).unwrap(),
                                {
                                  loading: "Mise à jour…",
                                  success: "Option mise à jour",
                                  error: "Échec de la mise à jour",
                                }
                              );
                              setEditingOptionId(null);
                              setEditingOption({ text: "", isCorrect: false });
                              await refetchOptions();
                            }}
                          >
                            Enregistrer
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingOptionId(null);
                              setEditingOption({ text: "", isCorrect: false });
                            }}
                          >
                            Annuler
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1">{opt.text}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingOptionId((opt.id as string) ?? null);
                              setEditingOption({ text: opt.text, isCorrect: opt.isCorrect });
                            }}
                          >
                            Modifier
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={async () => {
                              await toast.promise(deleteOption({ id: opt.id as string }).unwrap(), {
                                loading: "Suppression…",
                                success: "Option supprimée",
                                error: "Échec de la suppression",
                              });
                              await refetchOptions();
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                  {(!optionsData?.data || optionsData.data.length === 0) && (
                    <div className="text-sm text-muted-foreground">
                      Aucune option pour le moment.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nouvelle option</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={newOption.text}
                    onChange={(e) => setNewOption({ ...newOption, text: e.target.value })}
                    placeholder="Texte de l'option"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newOption.isCorrect}
                      onChange={(e) => setNewOption({ ...newOption, isCorrect: e.target.checked })}
                    />
                    <Label>Correct</Label>
                  </div>
                  <Button
                    disabled={!newOption.text.trim() || isCreatingOption}
                    onClick={async () => {
                      if (!activeQuestionId) return;
                      await toast.promise(
                        createOption({
                          questionId: activeQuestionId,
                          text: newOption.text,
                          isCorrect: newOption.isCorrect,
                        }).unwrap(),
                        { loading: "Ajout…", success: "Option ajoutée", error: "Échec de l'ajout" }
                      );
                      setNewOption({ text: "", isCorrect: false });
                      await refetchOptions();
                    }}
                  >
                    Ajouter
                  </Button>
                </div>
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>Fermer</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
