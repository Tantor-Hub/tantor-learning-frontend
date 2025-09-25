"use client";

import React from "react";
import { useListSessionByTrainingIdQuery } from "@/lib/apis/secretary/training-secretary-api";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Users } from "lucide-react";
import { ISession } from "@/types/secretary/training-secretary";

const SessionCard = ({
  session,
  onViewDetails,
}: {
  session: ISession;
  onViewDetails: (session: ISession) => void;
}) => {
  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onViewDetails(session)}
    >
      <CardHeader>
        <CardTitle className="text-xl">{session.title}</CardTitle>
        <CardDescription>
          {session.regulation_text || "Aucune description disponible"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(session.begining_date).toLocaleDateString("fr-FR")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{new Date(session.ending_date).toLocaleDateString("fr-FR")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{session.nb_places} places</span>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(session);
          }}
        >
          Voir les détails
        </Button>
      </CardContent>
    </Card>
  );
};

export default function SessionListClient() {
  const router = useRouter();
  const params = useParams();
  const trainingId = params.id as string;

  const { data, isLoading } = useListSessionByTrainingIdQuery({ trainingId });

  const handleViewDetails = (session: ISession) => {
    router.push(`/secretary/training/${trainingId}/sessions/${session.id}`);
  };

  const handleGoBack = () => {
    router.push("/secretary/training");
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 4 }, (_, index) => (
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

  const sessions = data?.data || [];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <Button variant="outline" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux formations
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sessions de formation</h1>
          <p className="text-gray-600">
            Découvrez toutes les sessions disponibles pour cette formation
          </p>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune session disponible pour cette formation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} onViewDetails={handleViewDetails} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
