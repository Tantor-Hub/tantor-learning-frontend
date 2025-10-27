import { useState } from "react";
import { IStudentEvaluation } from "@/types/student-evaluations";
import { IEvaluationQuestion } from "@/types/evaluation-questions";

export interface QuizState {
  selectedEvaluation: IStudentEvaluation | null;
  currentQuestionIndex: number;
  selectedOption: string;
  textAnswer: string;
  questionAlreadyAnswered: boolean;
  isSubmitting: boolean;
  showQuizDialog: boolean;
  showSuccessAnimation: boolean;
  quizCompleted: boolean;
}

export const useQuizState = () => {
  const [selectedEvaluation, setSelectedEvaluation] = useState<IStudentEvaluation | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [questionAlreadyAnswered, setQuestionAlreadyAnswered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuizDialog, setShowQuizDialog] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const resetQuizState = () => {
    setSelectedEvaluation(null);
    setCurrentQuestionIndex(0);
    setSelectedOption("");
    setTextAnswer("");
    setQuestionAlreadyAnswered(false);
    setIsSubmitting(false);
    setShowQuizDialog(false);
    setQuizCompleted(false);
    setShowSuccessAnimation(false);
  };

  const handleStartQuizClick = (evaluation: IStudentEvaluation) => {
    console.log("Start quiz clicked for evaluation:", evaluation);
    setSelectedEvaluation(evaluation);
    setShowQuizDialog(true);
  };

  const handleNextQuestion = (questions: IEvaluationQuestion[]) => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption("");
      setTextAnswer("");
      setQuestionAlreadyAnswered(false);
    } else {
      setQuizCompleted(true);
      setShowSuccessAnimation(true);
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

  const handleSubmitAnswer = async (
    questions: IEvaluationQuestion[],
    submitAnswer: any,
    createAnswerOption: any
  ) => {
    if (!selectedEvaluation || !questions[currentQuestionIndex] || isSubmitting) return;

    if (questionAlreadyAnswered) {
      handleNextQuestion(questions);
      return;
    }

    setIsSubmitting(true);
    const currentQuestion = questions[currentQuestionIndex];

    try {
      const answerResponse = await submitAnswer({
        questionId: currentQuestion.id,
        evaluationId: selectedEvaluation.id!,
        answerText: currentQuestion.isImmediateResult ? "" : textAnswer,
      }).unwrap();

      if (currentQuestion.isImmediateResult && selectedOption) {
        await createAnswerOption({
          studentAnswerId: answerResponse.data.id,
          optionId: selectedOption,
        }).unwrap();
      }

      handleNextQuestion(questions);
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedEvaluation,
    currentQuestionIndex,
    selectedOption,
    setSelectedOption,
    textAnswer,
    setTextAnswer,
    questionAlreadyAnswered,
    setQuestionAlreadyAnswered,
    isSubmitting,
    setIsSubmitting,
    showQuizDialog,
    setShowQuizDialog,
    showSuccessAnimation,
    setShowSuccessAnimation,
    quizCompleted,
    setQuizCompleted,
    resetQuizState,
    handleStartQuizClick,
    handleNextQuestion,
    handlePreviousQuestion,
    handleSubmitAnswer,
  };
};
