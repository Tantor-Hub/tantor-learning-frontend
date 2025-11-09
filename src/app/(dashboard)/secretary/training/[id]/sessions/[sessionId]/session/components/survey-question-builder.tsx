"use client";

import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Trash2, GripVertical, AlertCircle, CheckCircle } from "lucide-react";
import { SurveyQuestionData, QuestionOption } from "@/types/secretary/session-secretary";
import { toast } from "react-hot-toast";

interface SurveyQuestionBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  category: "before" | "during" | "after";
  onSuccess: (title: string, questions: SurveyQuestionData[]) => void;
  initialTitle?: string;
  initialQuestions?: SurveyQuestionData[];
}

export function SurveyQuestionBuilder({
  open,
  onOpenChange,
  sessionId,
  category,
  onSuccess,
  initialTitle = "",
  initialQuestions = [],
}: SurveyQuestionBuilderProps) {
  const [title, setTitle] = useState(initialTitle);
  const [questions, setQuestions] = useState<SurveyQuestionData[]>(initialQuestions);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const questionTypes = [
    { value: "text", label: "Texte libre", description: "Réponse libre en texte" },
    {
      value: "multiple_choice",
      label: "Choix multiple",
      description: "Plusieurs options possibles",
    },
  ];

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "before":
        return "Avant la formation";
      case "during":
        return "Pendant la formation";
      case "after":
        return "Après la formation";
      default:
        return cat;
    }
  };

  const generateId = () => `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addQuestion = useCallback(() => {
    const newQuestion: SurveyQuestionData = {
      id: generateId(),
      type: "text",
      question: "",
      required: true,
      order: questions.length + 1,
      options: [],
    };
    setQuestions((prev) => [...prev, newQuestion]);
    setErrors((prev) => ({ ...prev, [`question_${newQuestion.id}`]: "" }));
  }, [questions.length]);

  const updateQuestion = useCallback(
    (questionId: string, field: keyof SurveyQuestionData, value: any) => {
      setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, [field]: value } : q)));

      // Clear error when user starts typing
      if (field === "question" && value.trim()) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[`question_${questionId}`];
          return newErrors;
        });
      }
    },
    []
  );

  const removeQuestion = useCallback((questionId: string) => {
    setQuestions((prev) => {
      const filtered = prev.filter((q) => q.id !== questionId);
      // Reorder questions
      return filtered.map((q, index) => ({ ...q, order: index + 1 }));
    });
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`question_${questionId}`];
      return newErrors;
    });
  }, []);

  const addOption = useCallback((questionId: string) => {
    const newOption: QuestionOption = {
      id: `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: "",
    };

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, options: [...(q.options || []), newOption] } : q
      )
    );
  }, []);

  const updateOption = useCallback(
    (questionId: string, optionId: string, field: string, value: any) => {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: q.options?.map((opt) =>
                  opt.id === optionId ? { ...opt, [field]: value } : opt
                ),
              }
            : q
        )
      );

      // Clear error when user starts typing in option
      if (field === "text" && value.trim()) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[`question_${questionId}`];
          return newErrors;
        });
      }
    },
    []
  );

  const removeOption = useCallback((questionId: string, optionId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, options: q.options?.filter((opt) => opt.id !== optionId) } : q
      )
    );
  }, []);

  const resetForm = useCallback(() => {
    setTitle("");
    setQuestions([]);
    setErrors({});
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    // Validate title
    if (!title.trim()) {
      newErrors.title = "Le titre du questionnaire est requis";
    }

    // Validate questions
    if (questions.length === 0) {
      newErrors.questions = "Au moins une question est requise";
    }

    questions.forEach((question, index) => {
      const questionKey = `question_${question.id}`;

      if (!question.question.trim()) {
        newErrors[questionKey] = `La question ${index + 1} ne peut pas être vide`;
      }

      if (question.type === "multiple_choice") {
        if (!question.options || question.options.length === 0) {
          newErrors[questionKey] = `La question ${index + 1} doit avoir au moins une option`;
        } else {
          // Validate options
          question.options.forEach((option, optIndex) => {
            if (!option.text.trim()) {
              newErrors[questionKey] =
                `L'option ${optIndex + 1} de la question ${index + 1} ne peut pas être vide`;
            }
          });
        }
      }
    });

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    return isValid;
  }, [title, questions]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs avant de continuer");
      return;
    }

    setIsSubmitting(true);
    try {
      onSuccess(title, questions);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error("Erreur lors de la création du questionnaire");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, questions, validateForm, onSuccess, onOpenChange, resetForm]);

  const hasErrors = Object.keys(errors).length > 0;

  // Debug: Log current state
  React.useEffect(() => {}, [title, questions.length, errors, hasErrors, isSubmitting]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Créateur de questionnaire
          </DialogTitle>
          <DialogDescription>
            Créez un questionnaire complet pour la catégorie:{" "}
            <Badge variant="outline" className="ml-1">
              {getCategoryLabel(category)}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title Section */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Titre du questionnaire *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title && e.target.value.trim()) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.title;
                    return newErrors;
                  });
                }
              }}
              placeholder="Ex: Questionnaire d'évaluation pré-formation"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Questions Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <Label className="text-sm font-medium">Questions</Label>
                <p className="text-xs text-gray-500">{questions.length} question(s) créée(s)</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addQuestion}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter une question
              </Button>
            </div>

            {errors.questions && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.questions}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {questions.map((question, questionIndex) => (
                <Card key={question.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <CardTitle className="text-sm">Question {question.order}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {questionTypes.find((t) => t.value === question.type)?.label}
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Question Type */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Type de question *</Label>
                      <Select
                        value={question.type}
                        onValueChange={(value: "text" | "multiple_choice") =>
                          updateQuestion(question.id, "type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {questionTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-gray-500">{type.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Question Text */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Question *</Label>
                      <Textarea
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                        placeholder="Tapez votre question ici..."
                        className={`min-h-[80px] ${errors[`question_${question.id}`] ? "border-red-500" : ""}`}
                      />
                      {errors[`question_${question.id}`] && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors[`question_${question.id}`]}
                        </p>
                      )}
                    </div>

                    {/* Multiple Choice Options */}
                    {question.type === "multiple_choice" && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium">Options de réponse *</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addOption(question.id)}
                            className="flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Ajouter une option
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {question.options?.map((option, optionIndex) => (
                            <div
                              key={option.id}
                              className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50"
                            >
                              <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <Input
                                value={option.text}
                                onChange={(e) =>
                                  updateOption(question.id, option.id, "text", e.target.value)
                                }
                                placeholder={`Option ${optionIndex + 1}`}
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOption(question.id, option.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 flex-shrink-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>

                        {(!question.options || question.options.length === 0) && (
                          <div className="text-center py-4 text-gray-500 text-sm">
                            Aucune option ajoutée. Cliquez sur "Ajouter une option" pour commencer.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Required Checkbox */}
                    <div className="flex items-center space-x-2 pt-2 border-t">
                      <Checkbox
                        id={`required-${question.id}`}
                        checked={question.required}
                        onCheckedChange={(checked) =>
                          updateQuestion(question.id, "required", !!checked)
                        }
                      />
                      <Label htmlFor={`required-${question.id}`} className="text-sm">
                        Question obligatoire
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {questions.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-gray-500 mb-2">
                  <Plus className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Aucune question créée</p>
                </div>
                <Button type="button" variant="outline" onClick={addQuestion} className="mt-2">
                  Créer votre première question
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            {questions.length} question(s) • {questions.filter((q) => q.required).length}{" "}
            obligatoire(s)
            {hasErrors && (
              <span className="text-red-500 ml-2">
                • {Object.keys(errors).length} erreur(s) à corriger
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || hasErrors}
              className="flex items-center gap-2"
              title={
                hasErrors
                  ? "Veuillez corriger les erreurs avant de continuer"
                  : "Créer le questionnaire"
              }
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Créer le questionnaire
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
