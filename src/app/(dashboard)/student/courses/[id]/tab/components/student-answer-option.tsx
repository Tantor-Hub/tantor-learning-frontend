"use client";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IEvaluationQuestion } from "@/types/evaluation-questions";
import {
  useCreateStudentAnswerOptionMutation,
  useLazyGetStudentAnswerOptionsByQuestionIdQuery,
} from "@/lib/apis/student-answer-options";

interface StudentAnswerOptionProps {
  currentQuestion: IEvaluationQuestion;
  evaluationId: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  onQuestionSubmit: () => void;
  onPreviousQuestion: () => void;
  onClose: () => void;
  existingStudentAnswerId?: string;
  existingAnswerOptions?: string[];
  isLoadingExistingData?: boolean;
}

export function StudentAnswerOption({
  currentQuestion,
  evaluationId,
  currentQuestionIndex,
  totalQuestions,
  onQuestionSubmit,
  onPreviousQuestion,
  onClose,
  existingStudentAnswerId,
  existingAnswerOptions = [],
  isLoadingExistingData = false,
}: StudentAnswerOptionProps) {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const [createStudentAnswerOption, { isLoading: isCreatingAnswerOption }] =
    useCreateStudentAnswerOptionMutation();

  const [
    getStudentAnswerOptionsByQuestionId,
    { data: existingAnswerData, isLoading: isLoadingExistingAnswer },
  ] = useLazyGetStudentAnswerOptionsByQuestionIdQuery();

  const hasExistingAnswer = existingAnswerOptions.length > 0;
  const isAlreadyAnswered = (existingAnswerData?.data?.answerOptions?.length ?? 0) > 0;

  // Fetch existing answer options for the question
  useEffect(() => {
    if (currentQuestion.id) {
      getStudentAnswerOptionsByQuestionId(currentQuestion.id);
    }
  }, [currentQuestion.id, getStudentAnswerOptionsByQuestionId]);

  // Initialize selected option based on existing answer ONLY ONCE
  useEffect(() => {
    if (
      !hasInitialized &&
      (existingAnswerOptions.length > 0 || existingAnswerData?.data?.answerOptions)
    ) {
      if (existingAnswerOptions.length > 0) {
        setSelectedOption(existingAnswerOptions[0]);
      } else if (
        existingAnswerData?.data?.answerOptions &&
        existingAnswerData.data.answerOptions.length > 0
      ) {
        setSelectedOption(existingAnswerData.data.answerOptions[0].optionId);
      }
      setHasInitialized(true);
    }
  }, [existingAnswerOptions, existingAnswerData, hasInitialized]);

  // Reset initialization when question changes
  useEffect(() => {
    setHasInitialized(false);
    setSelectedOption("");
  }, [currentQuestion.id]);

  const handleSubmit = async () => {
    if (!selectedOption || isAlreadyAnswered) return;

    setIsSubmitting(true);
    try {
      await createStudentAnswerOption({
        questionId: currentQuestion.id,
        optionId: selectedOption,
      }).unwrap();

      onQuestionSubmit();
    } catch (error) {
      console.error("Error submitting answer:", error);
      // You might want to add toast notification here
      // toast.error("Erreur lors de la soumission de la réponse");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTerminate = () => {
    onClose();
  };

  // Debug logging to check the state
  console.log("Selected option:", selectedOption);
  console.log("Current question options:", currentQuestion.options);
  console.log("Is already answered:", isAlreadyAnswered);

  if (isLoadingExistingData || isLoadingExistingAnswer) {
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-64" />
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Answer Options */}
      {!isAlreadyAnswered && (
        <div className="space-y-4">
          <Label>Sélectionnez votre réponse :</Label>
          <RadioGroup
            value={selectedOption}
            onValueChange={setSelectedOption}
            disabled={isSubmitting}
            id="answer-options"
            className="space-y-3"
          >
            {currentQuestion.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-3">
                <RadioGroupItem
                  value={option.id}
                  id={option.id}
                  // Ensure the radio button is accessible
                  aria-describedby={`option-${option.id}-text`}
                />
                <Label
                  htmlFor={option.id}
                  className="text-sm font-normal flex-1 cursor-pointer"
                  id={`option-${option.id}-text`}
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {isAlreadyAnswered && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700 font-medium">
            ✓ Vous avez déjà répondu à cette question
          </p>
          {hasExistingAnswer && (
            <p className="text-sm text-green-600 mt-1">
              Réponse sélectionnée :{" "}
              {currentQuestion.options?.find((opt) => opt.id === existingAnswerOptions[0])?.text}
            </p>
          )}
          {!hasExistingAnswer &&
            existingAnswerData?.data?.answerOptions &&
            existingAnswerData.data.answerOptions.length > 0 && (
              <p className="text-sm text-green-600 mt-1">
                Réponse sélectionnée :{" "}
                {
                  currentQuestion.options?.find(
                    (opt) => opt.id === existingAnswerData.data.answerOptions[0].optionId
                  )?.text
                }
              </p>
            )}
        </div>
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

        {isAlreadyAnswered ? (
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
          <Button
            onClick={handleSubmit}
            disabled={!selectedOption || isSubmitting || isCreatingAnswerOption}
          >
            {isSubmitting || isCreatingAnswerOption ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
