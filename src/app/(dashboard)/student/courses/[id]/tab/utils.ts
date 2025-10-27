import { StudentevaluationType } from "@/types/student-evaluations";

export const getTypeColor = (type: StudentevaluationType) => {
  const colorMap = {
    [StudentevaluationType.QUIZ]: "bg-blue-100 text-blue-800",
    [StudentevaluationType.TEST]: "bg-green-100 text-green-800",
    [StudentevaluationType.EXAMEN]: "bg-red-100 text-red-800",
    [StudentevaluationType.HOMEWORK]: "bg-yellow-100 text-yellow-800",
    [StudentevaluationType.EXERCISE]: "bg-purple-100 text-purple-800",
  };
  return colorMap[type] || "bg-gray-100 text-gray-800";
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const isButtonDisabled = (
  isSubmitting: boolean,
  questionAlreadyAnswered: boolean,
  currentQuestion: any,
  selectedOption: string,
  textAnswer: string
) => {
  if (isSubmitting || questionAlreadyAnswered) return false;

  if (!currentQuestion) return true;

  return currentQuestion.isImmediateResult ? !selectedOption : !textAnswer.trim();
};
