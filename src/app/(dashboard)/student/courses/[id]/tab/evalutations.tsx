"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGetStudentEvaluationsBySessionQuery } from "@/lib/apis/student-evaluations";
import { useGetEvaluationQuestionsByEvaluationIdQuery } from "@/lib/apis/evaluation-questions";
import {
  useSubmitStudentAnswerMutation,
  useGetStudentAnswersByEvaluationIdQuery,
} from "@/lib/apis/student-answers";
import { useCreateStudentAnswerOptionMutation } from "@/lib/apis/student-answer-options";
import { StudentevaluationType, IStudentEvaluation } from "@/types/student-evaluations";
import { IEvaluationQuestion } from "@/types/evaluation-questions";

export function EvaluationsTab() {
  const { id: sessionCoursId } = useParams();

  const [selectedEvaluation, setSelectedEvaluation] = useState<IStudentEvaluation | null>(null);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [textAnswer, setTextAnswer] = useState<string>("");

  const { data, isLoading, error } = useGetStudentEvaluationsBySessionQuery({
    sessionCoursId: sessionCoursId as string,
  });

  const { data: questionsData, isLoading: questionsLoading } =
    useGetEvaluationQuestionsByEvaluationIdQuery(selectedEvaluation?.id || "", {
      skip: !selectedEvaluation,
    });

  const { data: existingAnswers } = useGetStudentAnswersByEvaluationIdQuery(
    selectedEvaluation?.id || "",
    { skip: !selectedEvaluation }
  );

  const [submitAnswer] = useSubmitStudentAnswerMutation();
  const [createAnswerOption] = useCreateStudentAnswerOptionMutation();

  const questions = questionsData?.data || [];
  const hasExistingAnswers = existingAnswers?.data && existingAnswers.data.length > 0;

  const handleStartQuiz = (evaluation: IStudentEvaluation) => {
    setSelectedEvaluation(evaluation);
    setCurrentQuestionIndex(0);
    setSelectedOption("");
    setTextAnswer("");
    setQuizDialogOpen(true);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedEvaluation || !questions[currentQuestionIndex]) return;

    const currentQuestion = questions[currentQuestionIndex];

    try {
      // Submit the answer
      const answerResponse = await submitAnswer({
        questionId: currentQuestion.id,
        evaluationId: selectedEvaluation.id!,
        answerText: currentQuestion.isImmediateResult ? "" : textAnswer,
      }).unwrap();

      // If it's a multiple choice question, create the answer option
      if (currentQuestion.isImmediateResult && selectedOption) {
        await createAnswerOption({
          studentAnswerId: answerResponse.data.id,
          optionId: selectedOption,
        }).unwrap();
      }

      // Move to next question or close dialog
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption("");
        setTextAnswer("");
      } else {
        setQuizDialogOpen(false);
        setSelectedEvaluation(null);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
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
        Error:{" "}
        {error instanceof Error ? error.message : "An error occurred while fetching evaluations"}
      </div>
    );
  }

  const evaluations = data?.data.evaluations || [];
  const sessionCours = data?.data.sessionCours;

  if (evaluations.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No evaluations available for this course.</p>
      </div>
    );
  }

  const getTypeColor = (type: StudentevaluationType) => {
    switch (type) {
      case StudentevaluationType.QUIZ:
        return "bg-blue-100 text-blue-800";
      case StudentevaluationType.TEST:
        return "bg-green-100 text-green-800";
      case StudentevaluationType.EXAMEN:
        return "bg-red-100 text-red-800";
      case StudentevaluationType.HOMEWORK:
        return "bg-yellow-100 text-yellow-800";
      case StudentevaluationType.EXERCISE:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Session Course Info */}
      {sessionCours && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{sessionCours.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{sessionCours.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Evaluations List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Evaluations ({evaluations.length})</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {evaluations.map((evaluation: IStudentEvaluation) => (
            <Card
              key={evaluation.id}
              className={`hover:shadow-lg transition-shadow ${
                !evaluation.ispublish ? "opacity-60" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-tight">{evaluation.title}</CardTitle>
                  <Badge className={getTypeColor(evaluation.type)}>{evaluation.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {evaluation.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Points: {evaluation.points}</span>
                  <span className="text-muted-foreground">
                    {evaluation.ispublish ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Submission: {formatDate(evaluation.submittiondate)}</p>
                  {evaluation.isImmediateResult && (
                    <p className="text-green-600">Immediate results</p>
                  )}
                </div>
                {evaluation.questions && evaluation.questions.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Questions: {evaluation.questions.length}
                  </div>
                )}
                {evaluation.ispublish && (
                  <div className="mt-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="w-full"
                          onClick={() => handleStartQuiz(evaluation)}
                          disabled={hasExistingAnswers && selectedEvaluation?.id === evaluation.id}
                        >
                          {hasExistingAnswers && selectedEvaluation?.id === evaluation.id
                            ? "Déjà terminé"
                            : "Démarrer le quiz"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Start {evaluation.type}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            You are about to start the {evaluation.title} evaluation.
                            {hasExistingAnswers && selectedEvaluation?.id === evaluation.id
                              ? " You have already completed this evaluation."
                              : " Make sure you have enough time to complete it."}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => setQuizDialogOpen(true)}
                            disabled={
                              hasExistingAnswers && selectedEvaluation?.id === evaluation.id
                            }
                          >
                            Start
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quiz Dialog */}
      <Dialog open={quizDialogOpen} onOpenChange={setQuizDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedEvaluation?.title} - Question {currentQuestionIndex + 1} of{" "}
              {questions.length}
            </DialogTitle>
          </DialogHeader>

          {questionsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : questions.length > 0 && questions[currentQuestionIndex] ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">{questions[currentQuestionIndex].text}</h3>
                <p className="text-sm text-muted-foreground">
                  Points: {questions[currentQuestionIndex].points}
                </p>
              </div>

              {questions[currentQuestionIndex].isImmediateResult ? (
                <div className="space-y-4">
                  <Label>Select your answer:</Label>
                  <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                    {questions[currentQuestionIndex].options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id}>{option.text}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ) : (
                <div className="space-y-4">
                  <Label htmlFor="answer">Your answer:</Label>
                  <Textarea
                    id="answer"
                    placeholder="Type your answer here..."
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    rows={4}
                  />
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentQuestionIndex > 0) {
                      setCurrentQuestionIndex(currentQuestionIndex - 1);
                      setSelectedOption("");
                      setTextAnswer("");
                    }
                  }}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={
                    questions[currentQuestionIndex].isImmediateResult
                      ? !selectedOption
                      : !textAnswer.trim()
                  }
                >
                  {currentQuestionIndex === questions.length - 1 ? "Fini" : "Suivant"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p>No questions available for this evaluation.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
