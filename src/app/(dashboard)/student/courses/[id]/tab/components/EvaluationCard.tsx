import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IStudentEvaluation } from "@/types/student-evaluations";
import { getTypeColor, formatDate } from "../utils";

interface EvaluationCardProps {
  evaluation: IStudentEvaluation;
  isCompleted: boolean;
  onStartQuiz: (evaluation: IStudentEvaluation) => void;
}

export function EvaluationCard({ evaluation, isCompleted, onStartQuiz }: EvaluationCardProps) {
  return (
    <Card
      key={evaluation.id}
      className={`hover:shadow-lg transition-shadow ${!evaluation.ispublish ? "opacity-60" : ""}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight">{evaluation.title}</CardTitle>
          <Badge className={getTypeColor(evaluation.type)}>{evaluation.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{evaluation.description}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Points : {evaluation.points}</span>
          <span className="text-muted-foreground">
            {evaluation.ispublish ? "Publié" : "Brouillon"}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Soumission : {formatDate(evaluation.submittiondate)}</p>
          {evaluation.isImmediateResult && <p className="text-green-600">Résultats immédiats</p>}
        </div>
        {evaluation.questions && evaluation.questions.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Questions : {evaluation.questions.length}
          </div>
        )}
        {evaluation.ispublish && (
          <Button
            className="w-full mt-4"
            onClick={() => onStartQuiz(evaluation)}
            disabled={isCompleted}
          >
            {isCompleted ? "Déjà terminé" : "Démarrer le quiz"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
