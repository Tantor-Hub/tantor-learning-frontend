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
  useGetStudentAnswersByQuestionIdQuery,
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

  // Get current question ID safely
  const currentQuestionId = questions[currentQuestionIndex]?.id || "";

  const { data: currentQuestionAnswers } = useGetStudentAnswersByQuestionIdQuery(
    currentQuestionId,
    { skip: !evaluation.id || !currentQuestionId || !showQuizDialog }
  );

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
    }
  }, [showQuizDialog]);

  // Load existing answer when question changes
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
  }, [currentQuestionIndex, currentQuestionAnswers, questions]);

  const resetQuizState = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption("");
    setTextAnswer("");
    setQuestionAlreadyAnswered(false);
    setIsSubmitting(false);
    setQuizCompleted(false);
    onClose();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption("");
      setTextAnswer("");
      setQuestionAlreadyAnswered(false);
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
        ) : questions.length > 0 && questions[currentQuestionIndex] ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">{questions[currentQuestionIndex].text}</h3>
              <p className="text-sm text-muted-foreground">
                Points : {questions[currentQuestionIndex].points}
              </p>
            </div>

            {questions[currentQuestionIndex].isImmediateResult ? (
              <div className="space-y-4">
                <Label>Sélectionnez votre réponse :</Label>
                <RadioGroup
                  value={selectedOption}
                  onValueChange={setSelectedOption}
                  disabled={questionAlreadyAnswered}
                >
                  {questions[currentQuestionIndex].options?.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id}>{option.text}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {questionAlreadyAnswered && (
                  <p className="text-sm text-green-600">Vous avez déjà répondu à cette question.</p>
                )}
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
                  disabled={questionAlreadyAnswered}
                />
                {questionAlreadyAnswered && (
                  <p className="text-sm text-green-600">Vous avez déjà répondu à cette question.</p>
                )}
              </div>
            )}

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Précédent
              </Button>
              <Button
                onClick={handleSubmitAnswer}
                disabled={isButtonDisabled(
                  isSubmitting,
                  questionAlreadyAnswered,
                  questions[currentQuestionIndex],
                  selectedOption,
                  textAnswer
                )}
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
