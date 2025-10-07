import React, { Suspense } from "react";
import QuestionsClient from "./QuestionsClient";
import QuestionsSkeleton from "./questions-skeleton";

export default async function EvaluationQuestionsPage() {
  return (
    <Suspense fallback={<QuestionsSkeleton />}>
      <QuestionsClient />
    </Suspense>
  );
}
