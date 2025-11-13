"use client";
import React, { useState, useEffect } from "react";
import { useGetTrainingSessionByIdQuery } from "@/lib/apis/training-sessions";
import { Loading } from "@/components/shared/loading";
import { Badge } from "@/components/ui/badge";

// Type pour les données de progression temporelle
interface TimeProgressData {
  day: string;
  progress: number;
  date: string;
}

// Type pour les props du composant
interface BarVisualProps {
  id_session: string;
}

// Import the correct types from the types file
import type { TrainingSession } from "@/types/training-sessions";

interface SessionResponse {
  status: number;
  message: string;
  data: TrainingSession;
}

// Fonction pour calculer la progression basée sur le temps
const calculateTimeProgress = (
  startDate: string,
  endDate: string,
  currentDate: Date = new Date()
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

  const totalDuration = end.getTime() - start.getTime();
  const elapsed = currentDate.getTime() - start.getTime();

  if (currentDate < start) return 0;
  if (currentDate > end) return 100;

  return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
};

export function BarVisual({ id_session }: BarVisualProps) {
  const [timeProgressData, setTimeProgressData] = useState<TimeProgressData[]>([]);
  const {
    data: sessionResponse,
    isLoading,
    error,
  } = useGetTrainingSessionByIdQuery({ id: id_session });

  // Générer les données de progression temporelle
  useEffect(() => {
    if (sessionResponse) {
      const session = sessionResponse.data;
      const startDate = new Date(session.begining_date);
      const endDate = new Date(session.ending_date);
      const now = new Date();

      // Générer des données quotidiennes pour la durée de la session
      const dailyData: TimeProgressData[] = [];
      const totalDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Limiter à 30 points de données maximum pour la lisibilité
      const step = Math.max(1, Math.floor(totalDays / 30));

      for (let i = 0; i <= totalDays; i += step) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        if (currentDate > endDate) break;

        const progress = calculateTimeProgress(
          session.begining_date,
          session.ending_date,
          currentDate
        );

        dailyData.push({
          day: `Jour ${i + 1}`,
          progress: Math.round(progress),
          date: currentDate.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
          }),
        });
      }

      // Toujours inclure le point final si ce n'est pas déjà inclus
      if (dailyData.length > 0 && dailyData[dailyData.length - 1].progress < 100) {
        dailyData.push({
          day: `Jour ${totalDays}`,
          progress: 100,
          date: endDate.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
          }),
        });
      }

      setTimeProgressData(dailyData);
    }
  }, [sessionResponse]);

  if (isLoading) {
    return (
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Détails de la session</h3>
        <div className="flex items-center justify-center h-64">
          <Loading />
        </div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <div className="text-red-500">Erreur lors du chargement des données</div>
  //     </div>
  //   );
  // }

  if (!sessionResponse?.data) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-64">
        <h3 className="text-xl text-primary font-semibold">Détails de la session</h3>
        <p className="text-base text-muted-foreground">Aucune donnée de session disponible</p>
      </div>
    );
  }

  const session = sessionResponse.data;

  // Obtenir le statut de la session
  const getSessionStatus = () => {
    const now = new Date();
    const startDate = new Date(session.begining_date);
    const endDate = new Date(session.ending_date);

    if (now < startDate) {
      return { text: "À venir", color: "bg-blue-100 text-blue-800" };
    } else if (now > endDate) {
      return { text: "Terminée", color: "bg-gray-100 text-gray-800" };
    } else {
      return { text: "En cours", color: "bg-green-100 text-green-800" };
    }
  };

  const status = getSessionStatus();

  // Formater les dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Formater le prix
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(parseFloat(price));
  };

  return (
    <div className="space-y-4 p-4">
      {/* Détails de la session */}
      <div>
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold text-gray-900">Détails de la session</h3>
          <Badge className={`px-3 py-1 text-sm rounded-full ${status.color}`}>{status.text}</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informations générales */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-4">Informations générales</h4>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Titre de la session:</dt>
                  <dd className="font-medium">{session.title}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Formation:</dt>
                  <dd className="font-medium">{session.trainings.title}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Sous-titre:</dt>
                  <dd className="font-medium">{session.trainings.subtitle}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Type:</dt>
                  <dd className="font-medium">{session.trainings.trainingtype}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Prix:</dt>
                  <dd className="font-medium">{formatPrice(session.trainings.prix)}</dd>
                </div>
              </dl>
            </div>

            {/* Places disponibles */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-4">Places disponibles</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">Places occupées</span>
                  <span className="font-medium">
                    {session.nb_places - session.available_places}/{session.nb_places}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${((session.nb_places - session.available_places) / session.nb_places) * 100}%`,
                    }}
                  />
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {session.available_places} places restantes
                </div>
              </div>
            </div>
          </div>

          {/* Dates et documents */}
          <div className="space-y-6">
            {/* Dates */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-4">Dates</h4>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Début:</dt>
                  <dd className="font-medium">{formatDate(session.begining_date)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Fin:</dt>
                  <dd className="font-medium">{formatDate(session.ending_date)}</dd>
                </div>
              </dl>
            </div>

            {/* Documents requis */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-4">Documents requis</h4>
              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-gray-600 mb-2">Avant la formation:</h5>
                  <div className="flex flex-wrap gap-2">
                    {session.required_document_before?.map((doc, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {doc}
                      </span>
                    )) || []}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-600 mb-2">Pendant la formation:</h5>
                  <div className="flex flex-wrap gap-2">
                    {session.required_document_during?.map((doc, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                      >
                        {doc}
                      </span>
                    )) || []}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-600 mb-2">Après la formation:</h5>
                  <div className="flex flex-wrap gap-2">
                    {session.required_document_after?.map((doc, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded"
                      >
                        {doc}
                      </span>
                    )) || []}
                  </div>
                </div>
              </div>
            </div>

            {/* Méthodes de paiement */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-4">Méthodes de paiement</h4>
              <div className="flex flex-wrap gap-2">
                {(session.payment_method ?? []).map((method, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                    {typeof method === "string" ? method.toUpperCase() : ""}
                  </span>
                ))}
              </div>
              {session.cpf_link && (
                <div className="mt-3">
                  <a
                    href={session.cpf_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Lien CPF
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description et règlement */}
        <div className="mt-8 pt-6 border-t">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-3">Description</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {session.trainings.description}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-3">Règlement intérieur</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{session.regulation_text}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
