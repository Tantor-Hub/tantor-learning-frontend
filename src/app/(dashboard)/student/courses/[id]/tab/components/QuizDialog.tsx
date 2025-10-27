"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { IStudentEvaluation } from "@/types/student-evaluations";
import { IEvaluationQuestion } from "@/types/evaluation-questions";
import { useGetEvaluationQuestionsByEvaluationIdQuery } from "@/lib/apis/evaluation-questions";
import {
  useSubmitStudentAnswerMutation,
  useGetStudentAnswersByEvaluationIdQuery,
  useLazyGetStudentAnswersByQuestionIdQuery,
} from "@/lib/apis/student-answers";
import { useCreateStudentAnswerOptionMutation } from "@/lib/apis/student-answer-options";
import { isButtonDisabled } from "../utils";

interface QuizDialogProps {
  showQuizDialog: boolean;
  onClose: () => void;
  evaluation: IStudentEvaluation;
}

export function QuizDialog({ showQuizDialog, onClose, evaluation }: QuizDialogProps) {
  // Local state for quiz management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [questionAlreadyAnswered, setQuestionAlreadyAnswered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isFetchingAnswer, setIsFetchingAnswer] = useState(false);

  // API queries
  const {
    data: questionsData,
    isLoading: questionsLoading,
    error: questionsError,
    refetch: refetchQuestions,
  } = useGetEvaluationQuestionsByEvaluationIdQuery(evaluation.id || "", {
    skip: !evaluation.id || !showQuizDialog,
  });

  const questions: IEvaluationQuestion[] = questionsData?.data || [];

  const { data: existingAnswers } = useGetStudentAnswersByEvaluationIdQuery(evaluation.id || "", {
    skip: !evaluation.id || !showQuizDialog,
  });

  // Lazy query for student answers by question ID
  const [
    getStudentAnswersByQuestionId,
    { data: currentQuestionAnswers, isFetching: isLoadingAnswers },
  ] = useLazyGetStudentAnswersByQuestionIdQuery();

  // API mutations
  const [submitAnswer] = useSubmitStudentAnswerMutation();
  const [createAnswerOption] = useCreateStudentAnswerOptionMutation();

  // Reset state when dialog opens
  useEffect(() => {
    if (showQuizDialog) {
      setCurrentQuestionIndex(0);
      setSelectedOption("");
      setTextAnswer("");
      setQuestionAlreadyAnswered(false);
      setIsSubmitting(false);
      setQuizCompleted(false);
      setIsFetchingAnswer(false);
    }
  }, [showQuizDialog]);

  // Fetch answer when current question changes
  useEffect(() => {
    const currentQuestionId = questions[currentQuestionIndex]?.id;
    if (currentQuestionId && showQuizDialog) {
      setIsFetchingAnswer(true);
      getStudentAnswersByQuestionId(currentQuestionId).finally(() => setIsFetchingAnswer(false));
    }
  }, [currentQuestionIndex, questions, showQuizDialog, getStudentAnswersByQuestionId]);

  // Update UI when answers data changes
  useEffect(() => {
    const answersData = currentQuestionAnswers?.data as any;
    if (answersData?.answers && answersData.answers.length > 0) {
      const existingAnswer = [...answersData.answers].sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

      setQuestionAlreadyAnswered(true);

      if (questions[currentQuestionIndex]?.isImmediateResult) {
        if (existingAnswer.selectedOptions?.length > 0) {
          setSelectedOption(existingAnswer.selectedOptions[0].id);
        }
      } else {
        setTextAnswer(existingAnswer.answerText || "");
      }
    } else {
      setQuestionAlreadyAnswered(false);
      setSelectedOption("");
      setTextAnswer("");
    }
  }, [currentQuestionAnswers, currentQuestionIndex, questions]);

  const resetQuizState = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption("");
    setTextAnswer("");
    setQuestionAlreadyAnswered(false);
    setIsSubmitting(false);
    setQuizCompleted(false);
    setIsFetchingAnswer(false);
    onClose();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
      setTimeout(() => {
        resetQuizState();
      }, 3000);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!questions[currentQuestionIndex] || isSubmitting) return;

    if (questionAlreadyAnswered) {
      handleNextQuestion();
      return;
    }

    setIsSubmitting(true);
    const currentQuestion = questions[currentQuestionIndex];

    try {
      const answerResponse = await submitAnswer({
        questionId: currentQuestion.id,
        evaluationId: evaluation.id!,
        answerText: currentQuestion.isImmediateResult ? "" : textAnswer,
      }).unwrap();

      if (currentQuestion.isImmediateResult && selectedOption) {
        await createAnswerOption({
          studentAnswerId: answerResponse.data.id,
          optionId: selectedOption,
        }).unwrap();
      }

      handleNextQuestion();
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTerminate = () => {
    setQuizCompleted(true);
    setTimeout(() => {
      resetQuizState();
    }, 3000);
  };

  // Get current question safely
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Dialog open={showQuizDialog} onOpenChange={(open) => !open && resetQuizState()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {evaluation.title} - Question {currentQuestionIndex + 1} sur {questions.length}
          </DialogTitle>
        </DialogHeader>

        {questionsLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-20 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        ) : questionsError ? (
          <div className="text-center py-8">
            <p className="text-red-500">
              {questionsError &&
              "status" in questionsError &&
              questionsError.status === 403 &&
              questionsError.data &&
              typeof questionsError.data === "object" &&
              "message" in questionsError.data &&
              questionsError.data.message === "This evaluation has expired"
                ? "Vous ne pouvez pas faire le quiz car les détails ont expiré"
                : "Erreur lors du chargement des questions"}
            </p>
            <Button onClick={() => refetchQuestions()} className="mt-4">
              Réessayer
            </Button>
          </div>
        ) : quizCompleted ? (
          <div className="text-center py-8 space-y-4">
            <div className="text-2xl font-bold text-green-600">Félicitations !</div>
            <p className="text-lg">Vous avez terminé l'évaluation avec succès.</p>
            <p className="text-muted-foreground">Fermeture automatique dans quelques secondes...</p>
          </div>
        ) : questions.length > 0 && currentQuestion ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">{currentQuestion.text}</h3>
              <p className="text-sm text-muted-foreground">Points : {currentQuestion.points}</p>
            </div>

            {/* Show skeleton when fetching answer data */}
            {isFetchingAnswer || isLoadingAnswers ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                {currentQuestion.isImmediateResult ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-64" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Skeleton className="h-32 w-full" />
                )}
              </div>
            ) : questionAlreadyAnswered ? (
              <div className="space-y-4">
                <Label>Votre réponse :</Label>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  {currentQuestion.isImmediateResult ? (
                    <div className="flex items-center space-x-2">
                      <RadioGroup value={selectedOption} disabled>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={selectedOption} checked disabled />
                          <Label className="font-medium">
                            {
                              currentQuestion.options?.find((opt) => opt.id === selectedOption)
                                ?.text
                            }
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">{textAnswer}</p>
                  )}
                </div>
                <p className="text-sm text-green-600">Vous avez déjà répondu à cette question.</p>
              </div>
            ) : currentQuestion.isImmediateResult ? (
              <div className="space-y-4">
                <Label>Sélectionnez votre réponse :</Label>
                <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                  {currentQuestion.options?.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id}>{option.text}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ) : (
              <div className="space-y-4">
                <Label htmlFor="answer">Votre réponse :</Label>
                <Textarea
                  id="answer"
                  placeholder="Tapez votre réponse ici..."
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  rows={4}
                />
              </div>
            )}

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0 || isFetchingAnswer}
              >
                Précédent
              </Button>

              {questionAlreadyAnswered ? (
                <div className="flex gap-2">
                  {currentQuestionIndex === questions.length - 1 && (
                    <Button onClick={handleTerminate} variant="default">
                      Terminer
                    </Button>
                  )}
                  <Button onClick={handleNextQuestion} disabled={isFetchingAnswer}>
                    Suivant
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={
                    isButtonDisabled(
                      isSubmitting,
                      questionAlreadyAnswered,
                      currentQuestion,
                      selectedOption,
                      textAnswer
                    ) || isFetchingAnswer
                  }
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Soumission...
                    </>
                  ) : currentQuestionIndex === questions.length - 1 ? (
                    "Terminer"
                  ) : (
                    "Suivant"
                  )}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>Aucune question disponible pour cette évaluation.</p>
            <Button onClick={() => refetchQuestions()} className="mt-4">
              Réessayer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
