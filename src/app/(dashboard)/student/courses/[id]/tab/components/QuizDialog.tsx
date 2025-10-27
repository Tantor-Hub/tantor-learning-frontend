"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentAnswer } from "./student-answer";
import { StudentAnswerOption } from "./student-answer-option";
import { IStudentEvaluation } from "@/types/student-evaluations";
import { IEvaluationQuestion } from "@/types/evaluation-questions";
import { useGetEvaluationQuestionsByEvaluationIdQuery } from "@/lib/apis/evaluation-questions";

interface QuizDialogProps {
  showQuizDialog: boolean;
  onClose: () => void;
  evaluation: IStudentEvaluation;
}

export function QuizDialog({ showQuizDialog, onClose, evaluation }: QuizDialogProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // API queries - only for questions
  const {
    data: questionsData,
    isLoading: questionsLoading,
    error: questionsError,
    refetch: refetchQuestions,
  } = useGetEvaluationQuestionsByEvaluationIdQuery(evaluation.id || "", {
    skip: !evaluation.id || !showQuizDialog,
  });

  const questions: IEvaluationQuestion[] = questionsData?.data || [];

  // Reset state when dialog opens
  useEffect(() => {
    if (showQuizDialog) {
      setCurrentQuestionIndex(0);
      setQuizCompleted(false);
    }
  }, [showQuizDialog]);

  const resetQuizState = () => {
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
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

  const handleQuestionSubmit = () => {
    handleNextQuestion();
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
            <button
              onClick={() => refetchQuestions()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Réessayer
            </button>
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
              <p className="text-xs text-muted-foreground">
                Type:{" "}
                {currentQuestion.isImmediateResult
                  ? "Question à choix multiples"
                  : "Question libre"}
              </p>
            </div>

            {/* Render appropriate component based on question type */}
            {currentQuestion.isImmediateResult ? (
              <StudentAnswerOption
                currentQuestion={currentQuestion}
                evaluationId={evaluation.id!}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                onQuestionSubmit={handleQuestionSubmit}
                onPreviousQuestion={handlePreviousQuestion}
                onClose={resetQuizState}
              />
            ) : (
              <StudentAnswer
                currentQuestion={currentQuestion}
                evaluationId={evaluation.id!}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                onQuestionSubmit={handleQuestionSubmit}
                onPreviousQuestion={handlePreviousQuestion}
                onClose={resetQuizState}
              />
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p>Aucune question disponible pour cette évaluation.</p>
            <button
              onClick={() => refetchQuestions()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Réessayer
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
