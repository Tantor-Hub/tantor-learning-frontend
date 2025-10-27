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
import { LottieSuccessView } from "@/components/payment/lottie-success-view";

export function EvaluationsTab() {
  const { id: sessionCoursId } = useParams();

  const [selectedEvaluation, setSelectedEvaluation] = useState<IStudentEvaluation | null>(null);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [textAnswer, setTextAnswer] = useState<string>("");
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const { data, isLoading, error } = useGetStudentEvaluationsBySessionQuery({
    sessionCoursId: sessionCoursId as string,
  });

  const {
    data: questionsData,
    isLoading: questionsLoading,
    error: questionsError,
  } = useGetEvaluationQuestionsByEvaluationIdQuery(selectedEvaluation?.id || "", {
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
    setQuizCompleted(false);
    setShowSuccessAnimation(false);
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
        setQuizCompleted(true);
        setShowSuccessAnimation(true);
        // Show success animation for 3 seconds, then close
        setTimeout(() => {
          setShowSuccessAnimation(false);
          setQuizDialogOpen(false);
          setSelectedEvaluation(null);
          setQuizCompleted(false);
        }, 3000);
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
        Erreur :{" "}
        {error instanceof Error
          ? error.message
          : "Une erreur s'est produite lors de la récupération des évaluations"}
      </div>
    );
  }

  const evaluations = data?.data.evaluations || [];
  const sessionCours = data?.data.sessionCours;

  if (evaluations.length === 0) {
    return (
      <div className="text-center py-8">
        <p>Aucune évaluation disponible pour ce cours.</p>
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
        <h2 className="text-2xl font-bold mb-4">Évaluations ({evaluations.length})</h2>
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
                  <span className="font-medium">Points : {evaluation.points}</span>
                  <span className="text-muted-foreground">
                    {evaluation.ispublish ? "Publié" : "Brouillon"}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Soumission : {formatDate(evaluation.submittiondate)}</p>
                  {evaluation.isImmediateResult && (
                    <p className="text-green-600">Résultats immédiats</p>
                  )}
                </div>
                {evaluation.questions && evaluation.questions.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Questions : {evaluation.questions.length}
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
                          <AlertDialogTitle>Démarrer {evaluation.type} ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Vous êtes sur le point de commencer l'évaluation {evaluation.title}.
                            {hasExistingAnswers && selectedEvaluation?.id === evaluation.id
                              ? " Vous avez déjà terminé cette évaluation."
                              : " Assurez-vous d'avoir suffisamment de temps pour la terminer."}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => setQuizDialogOpen(true)}
                            disabled={
                              hasExistingAnswers && selectedEvaluation?.id === evaluation.id
                            }
                          >
                            Démarrer
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
              {selectedEvaluation?.title} - Question {currentQuestionIndex + 1} sur{" "}
              {questions.length}
            </DialogTitle>
          </DialogHeader>

          {questionsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-20 w-full" />
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
            </div>
          ) : quizCompleted ? (
            <div className="text-center py-8 space-y-4">
              <div className="text-2xl font-bold text-green-600">Félicitations !</div>
              <p className="text-lg">Vous avez terminé l'évaluation avec succès.</p>
              <p className="text-muted-foreground">
                Fermeture automatique dans quelques secondes...
              </p>
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
                  onClick={() => {
                    if (currentQuestionIndex > 0) {
                      setCurrentQuestionIndex(currentQuestionIndex - 1);
                      setSelectedOption("");
                      setTextAnswer("");
                    }
                  }}
                  disabled={currentQuestionIndex === 0}
                >
                  Précédent
                </Button>
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={
                    questions[currentQuestionIndex].isImmediateResult
                      ? !selectedOption
                      : !textAnswer.trim()
                  }
                >
                  {currentQuestionIndex === questions.length - 1 ? "Terminer" : "Suivant"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p>Aucune question disponible pour cette évaluation.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {showSuccessAnimation && <LottieSuccessView />}
    </div>
  );
}
