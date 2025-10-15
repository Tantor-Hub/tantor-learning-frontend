"use client";
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/shared/loading";
import { useGetTrainingSessionByIdQuery } from "@/lib/apis/training-sessions";

// Import the correct types from the types file
import type { TrainingSession } from "@/types/training-sessions";

interface SessionResponse {
  status: number;
  message: string;
  data: TrainingSession;
}

// Function to calculate progress percentage
const calculateProgress = (startDate: string, endDate: string): number => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Ensure dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

  const totalDuration = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();

  // Handle cases where session hasn't started or has ended
  if (now < start) return 0;
  if (now > end) return 100;

  return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
};

// Function to format the remaining time
const formatRemainingTime = (startDate: string, endDate: string): string => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    const daysUntil = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return `Commence dans ${daysUntil} jour${daysUntil > 1 ? "s" : ""}`;
  }

  if (now > end) {
    return "Session terminée";
  }

  const daysRemaining = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return `${daysRemaining} jour${daysRemaining > 1 ? "s" : ""} restant${daysRemaining > 1 ? "s" : ""}`;
};

// Function to calculate total course duration (placeholder since we don't have course data)
const calculateTotalDuration = (courses: any[]): number => {
  // Since the TrainingSession type doesn't include courses, return a default value
  return 0;
};

// Function to format duration in hours and minutes
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;

  return `${hours}h ${mins}min`;
};

export function SessionProgress({ id_session }: { id_session: number }) {
  const { data: sessionResponse, isLoading } = useGetTrainingSessionByIdQuery({
    id: id_session.toString(),
  });

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto rounded shadow-none border flex-[2]">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Progression de la session</CardTitle>
          <CardDescription>Chargement des données...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <Loading />
        </CardContent>
      </Card>
    );
  }

  if (!sessionResponse?.data) {
    return (
      <Card className="w-full max-w-md mx-auto rounded shadow-none border flex-[2]">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Progression de la session</CardTitle>
          <CardDescription>Session non trouvée</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground">Aucune donnée disponible</p>
        </CardContent>
      </Card>
    );
  }

  const session = sessionResponse?.data;
  const progress = calculateProgress(session.begining_date, session.ending_date);
  const totalDuration = calculateTotalDuration([]);
  const remainingText = formatRemainingTime(session.begining_date, session.ending_date);

  // Format dates for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Get session status
  const getSessionStatus = (): { text: string; color: string } => {
    const now = new Date();
    const start = new Date(session.begining_date);
    const end = new Date(session.ending_date);

    if (now < start) {
      return { text: "À venir", color: "text-blue-500" };
    } else if (now > end) {
      return { text: "Terminée", color: "text-green-500" };
    } else {
      return { text: "En cours", color: "text-orange-500" };
    }
  };

  const status = getSessionStatus();

  return (
    <Card className="w-full mx-auto border rounded shadow-none flex-[2]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Progression de la session</CardTitle>
            <CardDescription>
              {formatDate(session.begining_date)} - {formatDate(session.ending_date)}
            </CardDescription>
            <CardDescription>{session.trainings.title}</CardDescription>
          </div>
          <span
            className={`text-sm font-medium px-2 py-1 rounded-full ${status.color} bg-opacity-20`}
          >
            {status.text}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              className="text-gray-200 stroke-current"
              strokeWidth="10"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              className="text-ring stroke-current"
              strokeWidth="10"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (progress / 100) * 251.2}
              transform="rotate(-90 50 50)"
            />
            {/* Text */}
            <text
              x="50"
              y="50"
              dominantBaseline="middle"
              textAnchor="middle"
              className="text-sm font-bold fill-foreground text-primary"
            >
              {Math.round(progress)}%
            </text>
          </svg>
        </div>
        {/* 
        <div className="mt-6 w-full space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted p-3 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Places disponibles</p>
              <p className="text-lg font-semibold">
                {session.nb_places_disponible} / {session.nb_places}
              </p>
            </div>
            <div className="bg-muted p-3 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Durée totale</p>
              <p className="text-lg font-semibold">{formatDuration(totalDuration)}</p>
            </div>
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Formation</p>
            <p className="font-medium">{session.Formation?.titre || "Formation"}</p>
            {session.Formation?.sous_titre && (
              <p className="text-sm text-muted-foreground mt-1">{session.Formation.sous_titre}</p>
            )}
          </div>

        </div> */}
      </CardContent>
    </Card>
  );
}
