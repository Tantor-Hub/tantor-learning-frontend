"use client";
import React, { useState, useEffect } from "react";
import { useGetTrainingByIdQuery } from "@/lib/apis/student/training-api";
import { Loading } from "@/components/shared/loading";
import { Badge } from "@/components/ui/badge";

// Type pour les données de session
interface SessionData {
  name: string;
  pv: number;
}

// Type pour les props du composant
interface BarVisualProps {
  id_session: string;
}

// Type pour les données de l'API
interface Formation {
  id: number;
  titre: string;
  sous_titre?: string;
  description?: string;
}

interface SessionDetails {
  id: number;
  uuid: string;
  designation: string;
  duree: string;
  nb_places: number;
  nb_places_disponible: number;
  progression: number;
  id_formation: number;
  type_formation: string;
  date_session_debut: string;
  date_session_fin: string;
  description: string | null;
  prix: number;
  initial_price: number | null;
  status: number;
  Formation: Formation;
  payment_methods: string[];
  required_documents: string[];
}

interface SessionResponse {
  status: number;
  message: string;
  data: SessionDetails;
}

export function BarVisual({ id_session }: BarVisualProps) {
  const [data, setData] = useState<any>([]);
  const {
    data: sessionResponse,
    isLoading,
    error,
  } = useGetTrainingByIdQuery({ id_session: +id_session });

  // Données simulées pour le graphique (basées sur les mois de la session)
  useEffect(() => {
    if (sessionResponse) {
      const session = sessionResponse.data;
      const startDate = new Date(session.date_session_debut);
      const endDate = new Date(session.date_session_fin);

      // Générer des données mensuelles basées sur la durée de la session
      const monthsData: SessionData[] = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const monthName = currentDate.toLocaleDateString("fr-FR", { month: "long" });
        // Valeur simulée basée sur le nombre de places
        const pvValue = Math.floor(Math.random() * session.nb_places);

        monthsData.push({
          name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
          pv: pvValue,
        });

        // Passer au mois suivant
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      setData(monthsData);
    }
  }, [sessionResponse]);

  if (isLoading) {
    return (
      <div className="p-4">
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
  // console.log("sessionId", JSON.stringify(session));
  // Formater les dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  // Obtenir le statut de la session
  const getSessionStatus = () => {
    const now = new Date();
    const startDate = new Date(session.date_session_debut);
    const endDate = new Date(session.date_session_fin);

    if (now < startDate) {
      return { text: "À venir", color: "bg-blue-100 text-blue-800" };
    } else if (now > endDate) {
      return { text: "Terminée", color: "bg-gray-100 text-gray-800" };
    } else {
      return { text: "En cours", color: "bg-green-100 text-green-800" };
    }
  };

  const status = getSessionStatus();

  return (
    <div className="space-y-4 p-4">
      {/* Détails de la session */}
      <div className="bg-white">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Détails de la session</h3>
          <Badge className={`px-3 py-1 text-sm rounded-full ${status.color}`}>{status.text}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Informations générales</h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Désignation:</dt>
                  <dd className="font-medium">{session.designation}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Formation:</dt>
                  <dd className="font-medium">{session.Formation.titre}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Type:</dt>
                  <dd className="font-medium capitalize">{session.type_formation.toLowerCase()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Prix:</dt>
                  <dd className="font-medium">{formatPrice(session.prix)}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Places disponibles</h4>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Occupées</span>
                  <span className="font-medium">
                    {session.nb_places - session.nb_places_disponible}/{session.nb_places}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${((session.nb_places - session.nb_places_disponible) / session.nb_places) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Dates</h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Début:</dt>
                  <dd className="font-medium">{formatDate(session.date_session_debut)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Fin:</dt>
                  <dd className="font-medium">{formatDate(session.date_session_fin)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Durée:</dt>
                  <dd className="font-medium">{session.duree}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Méthodes de paiement</h4>
              <div className="flex flex-wrap gap-2">
                {session.payment_methods.map((method: any, index: number) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
