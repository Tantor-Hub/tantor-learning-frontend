"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  useLazyGetStudentAnswersByQuestionIdQuery,
  useCreateStudentAnswerMutation,
  useGetStudentAnswersByEvaluationIdQuery,
} from "@/lib/apis/student-answers";
import { IEvaluationQuestion } from "@/types/evaluation-questions";
import { Loader2 } from "lucide-react";

interface StudentAnswerProps {
  currentQuestion: IEvaluationQuestion;
  evaluationId: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  onQuestionSubmit: () => void;
  onPreviousQuestion: () => void;
  onClose: () => void;
}

export function StudentAnswer({
  currentQuestion,
  evaluationId,
  currentQuestionIndex,
  totalQuestions,
  onQuestionSubmit,
  onPreviousQuestion,
  onClose,
}: StudentAnswerProps) {
  const [textAnswer, setTextAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionAlreadyAnswered, setQuestionAlreadyAnswered] = useState(false);
  const [existingAnswer, setExistingAnswer] = useState("");

  // API calls inside child component
  const [submitAnswer] = useCreateStudentAnswerMutation();

  const { data: existingAnswers, isLoading: isLoadingExistingAnswers } =
    useGetStudentAnswersByEvaluationIdQuery(evaluationId, { skip: !evaluationId });

  const [
    getStudentAnswersByQuestionId,
    { data: currentQuestionAnswers, isFetching: isLoadingAnswers },
  ] = useLazyGetStudentAnswersByQuestionIdQuery();

  // Check if question is already answered and fetch existing answer
  useEffect(() => {
    if (existingAnswers?.data && currentQuestion.id) {
      const answersArray = Array.isArray(existingAnswers.data)
        ? existingAnswers.data
        : (existingAnswers.data as any)?.answers || [];

      const existingAnswerData = answersArray.find(
        (answer: any) => answer.questionId === currentQuestion.id
      );

      if (existingAnswerData) {
        setQuestionAlreadyAnswered(true);
        setExistingAnswer(existingAnswerData.answerText || "");
        setTextAnswer(existingAnswerData.answerText || "");
      } else {
        setQuestionAlreadyAnswered(false);
        setExistingAnswer("");
        setTextAnswer("");
      }
    }
  }, [existingAnswers, currentQuestion.id]);

  const handleSubmit = async () => {
    if (!textAnswer.trim() || questionAlreadyAnswered) return;

    setIsSubmitting(true);
    try {
      await submitAnswer({
        questionId: currentQuestion.id,
        evaluationId: evaluationId,
        answerText: textAnswer,
      }).unwrap();

      onQuestionSubmit();
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTerminate = () => {
    onClose();
  };

  if (isLoadingExistingAnswers || isLoadingAnswers) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Answer Input */}
      <div className="space-y-4">
        <Label htmlFor="answer">Votre réponse :</Label>

        {questionAlreadyAnswered ? (
          <div className="p-4 bg-gray-50 rounded-lg border">
            <p className="text-gray-700 whitespace-pre-wrap">{existingAnswer}</p>
          </div>
        ) : (
          <Textarea
            id="answer"
            placeholder="Tapez votre réponse ici..."
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            rows={4}
            disabled={isSubmitting}
          />
        )}
      </div>

      {questionAlreadyAnswered && (
        <p className="text-sm text-green-600">Vous avez déjà répondu à cette question.</p>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPreviousQuestion}
          disabled={currentQuestionIndex === 0 || isSubmitting}
        >
          Précédent
        </Button>

        {questionAlreadyAnswered ? (
          <div className="flex gap-2">
            {currentQuestionIndex === totalQuestions - 1 && (
              <Button onClick={handleTerminate} variant="default">
                Terminer
              </Button>
            )}
            <Button onClick={onQuestionSubmit} disabled={isSubmitting}>
              Suivant
            </Button>
          </div>
        ) : (
          <Button onClick={handleSubmit} disabled={!textAnswer.trim() || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Soumission
              </>
            ) : currentQuestionIndex === totalQuestions - 1 ? (
              "Terminer"
            ) : (
              "Suivant"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
