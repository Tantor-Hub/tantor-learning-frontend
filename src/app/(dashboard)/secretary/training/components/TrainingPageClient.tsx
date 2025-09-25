"use client";

import { useListTrainingQuery } from "@/lib/apis/secretary/training-secretary-api";
import { ITraining } from "@/types/secretary/training-secretary";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users } from "lucide-react";

const TrainingCard = ({
  training,
  onViewSessions,
}: {
  training: ITraining;
  onViewSessions: (training: ITraining) => void;
}) => {
  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onViewSessions(training)}
    >
      <CardHeader>
        <CardTitle className="text-xl">{training.title}</CardTitle>
        <CardDescription>{training.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          {training.description || "Aucune description disponible"}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>0 sessions</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{training.prix}€</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{training.trainingCategory?.title || "Non catégorisé"}</span>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onViewSessions(training);
          }}
        >
          Voir les sessions
        </Button>
      </CardContent>
    </Card>
  );
};

export default function TrainingPageClient() {
  const { data: formationsData, isLoading } = useListTrainingQuery();
  const router = useRouter();

  const handleViewSessions = (training: ITraining) => {
    router.push(`/secretary/training/${training.id}/sessions`);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const trainings = formationsData?.data || [];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Formations</h1>
          <p className="text-gray-600">Découvrez toutes nos formations disponibles</p>
        </div>

        {trainings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune formation disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainings.map((training) => (
              <TrainingCard
                key={training.id}
                training={training}
                onViewSessions={handleViewSessions}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
