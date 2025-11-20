"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetStudentEvaluationsBySessionCourseStudentQuery } from "@/lib/apis/student-evaluations";
import { IStudentEvaluation } from "@/types/student-evaluations";
import { LottieSuccessView } from "@/components/payment/lottie-success-view";
import { useQuizState } from "./quiz-logic";
import { EvaluationCard } from "./components/EvaluationCard";
import { QuizDialog } from "./components/QuizDialog";

export function EvaluationsTab() {
  const { id: sessionCoursId } = useParams();

  // Use the custom hook for quiz state management
  const quizState = useQuizState();

  // API queries
  const { data, isLoading, error } = useGetStudentEvaluationsBySessionCourseStudentQuery({
    sessionCoursId: sessionCoursId as string,
  });

  // Derived state
  const evaluations = data?.data.evaluations || [];

  // Handlers using the quiz state
  const handleStartQuizClick = (evaluation: IStudentEvaluation) => {
    quizState.handleStartQuizClick(evaluation);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        Erreur :{" "}
        {error instanceof Error
          ? error.message
          : "Une erreur s'est produite lors de la récupération des évaluations"}
      </div>
    );
  }

  if (evaluations.length === 0) {
    return (
      <div className="text-center py-8">
        <p>Aucune évaluation disponible pour ce cours.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Course Info */}
      {/* Removed sessionCours display as it's no longer in the response */}

      {/* Evaluations List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Évaluations ({evaluations.length})</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {evaluations.map((evaluation: IStudentEvaluation) => (
            <EvaluationCard
              key={evaluation.id}
              evaluation={evaluation}
              isCompleted={false}
              onStartQuiz={handleStartQuizClick}
            />
          ))}
        </div>
      </div>

      {quizState.selectedEvaluation && (
        <QuizDialog
          showQuizDialog={quizState.showQuizDialog}
          onClose={quizState.resetQuizState}
          evaluation={quizState.selectedEvaluation}
        />
      )}

      {quizState.showSuccessAnimation && <LottieSuccessView />}
    </div>
  );
}
