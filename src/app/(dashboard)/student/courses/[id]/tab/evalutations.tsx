"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetStudentEvaluationsBySessionQuery } from "@/lib/apis/student-evaluations";
import { StudentevaluationType, IStudentEvaluation } from "@/types/student-evaluations";

export function EvaluationsTab() {
  const { id: sessionCoursId } = useParams();

  const { data, isLoading, error } = useGetStudentEvaluationsBySessionQuery({
    sessionCoursId: sessionCoursId as string,
  });

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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
