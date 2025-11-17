"use client";
import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetStudentAnswersByEvaluationAndStudentQuery } from "@/lib/apis/student-evaluations";
import { useUpdateStudentAnswerPointsMutation } from "@/lib/apis/student-answers";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, Save } from "lucide-react";
import { toast } from "react-hot-toast";

export default function StudentAnswers() {
  const params = useParams();
  const evaluationId = params.evaluationId as string;
  const studentId = params.studentId as string;
  const courseId = params.courseId as string;
  const router = useRouter();

  const [points, setPoints] = useState<{ [key: string]: number }>({});

  const { data: answersData, isLoading } = useGetStudentAnswersByEvaluationAndStudentQuery(
    { evaluationId, studentId },
    { skip: !evaluationId || !studentId }
  );

  const [updatePoints] = useUpdateStudentAnswerPointsMutation();

  const answers = useMemo(() => answersData?.data?.answers || [], [answersData?.data?.answers]);
  const evaluation = answersData?.data?.evaluation;

  // Initialize points state when answers load
  React.useEffect(() => {
    const initialPoints: { [key: string]: number } = {};
    answers.forEach((answer: any) => {
      initialPoints[answer.id] = answer.points;
    });
    setPoints(initialPoints);
  }, [answers]);

  const handlePointsChange = (answerId: string, value: number) => {
    setPoints((prev) => ({
      ...prev,
      [answerId]: value,
    }));
  };

  const handleSavePoints = async (answerId: string) => {
    const newPoints = points[answerId];
    if (newPoints === undefined) return;

    const answer = answers.find((a: any) => a.id === answerId);
    if (!answer) return;

    // Validate points don't exceed question max or go below 0
    if (newPoints < 0 || newPoints > answer.question.points) {
      toast.error(`Les points doivent être entre 0 et ${answer.question.points}`);
      return;
    }

    await toast.promise(updatePoints({ answerId, points: newPoints }).unwrap(), {
      loading: "Mise à jour des points...",
      success: "Points mis à jour avec succès",
      error: "Erreur lors de la mise à jour des points",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-6 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
              <div className="mt-4">
                <Skeleton className="h-4 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Correction des réponses</h3>
          {evaluation && <p className="text-sm text-gray-600">Évaluation: {evaluation.title}</p>}
        </div>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>

      {answers.length === 0 ? (
        <div className="min-h-[200px] flex items-center justify-center text-gray-600">
          Aucune réponse trouvée pour cet étudiant.
        </div>
      ) : (
        answers.map((answer: any) => (
          <Card key={answer.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {answer.isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                {answer.question.text}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Type: {answer.question.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Points:</label>
                    <Input
                      type="number"
                      min="0"
                      max={answer.question.points}
                      value={points[answer.id] || 0}
                      onChange={(e) => handlePointsChange(answer.id, parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                    <span className="text-sm text-gray-600">/ {answer.question.points}</span>
                    <Button
                      size="sm"
                      onClick={() => handleSavePoints(answer.id)}
                      disabled={points[answer.id] === answer.points}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {answer.question.type === "multiple_choice" && answer.selectedOptions ? (
                  <div>
                    <p className="font-medium">Réponse sélectionnée:</p>
                    {answer.selectedOptions.map((option: any) => (
                      <div key={option.id} className="ml-4">
                        <span className={option.isCorrect ? "text-green-600" : "text-red-600"}>
                          {option.option.text}
                        </span>
                        {option.isCorrect && (
                          <CheckCircle className="inline h-4 w-4 ml-2 text-green-500" />
                        )}
                        {!option.isCorrect && (
                          <XCircle className="inline h-4 w-4 ml-2 text-red-500" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">Réponse:</p>
                    <p className="ml-4">{answer.answerText || "Aucune réponse textuelle"}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
