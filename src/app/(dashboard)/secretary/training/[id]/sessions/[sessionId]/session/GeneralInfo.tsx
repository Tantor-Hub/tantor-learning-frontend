"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSessionByIdQuery } from "@/lib/apis/secretary/session-secretary-api";

export default function GeneralInfo() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const { data: sessionData, isLoading, error } = useGetSessionByIdQuery({ id: sessionId });

  // Log the response for debugging
  React.useEffect(() => {
    if (sessionData) {
    }
    if (error) {
    }
  }, [sessionData, error]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales de la session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Titre de la session</Label>
              <Skeleton className="h-4 w-64 mt-1" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">ID Formation</Label>
              <Skeleton className="h-4 w-32 mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Date de début</Label>
                <Skeleton className="h-4 w-24 mt-1" />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Date de fin</Label>
                <Skeleton className="h-4 w-24 mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Nombre de places</Label>
                <Skeleton className="h-4 w-16 mt-1" />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Places disponibles</Label>
                <Skeleton className="h-4 w-16 mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Texte de règlement</Label>
              <Skeleton className="h-20 w-full mt-1" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales de la session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-red-600">Erreur lors du chargement des données de la session</p>
              <p className="text-sm text-gray-500 mt-2">Vérifiez la console pour plus de détails</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const session = sessionData?.data;

  if (!session) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales de la session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-600">Aucune donnée de session trouvée</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return "Non définie";
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales de la session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Titre de la session</Label>
            <p className="mt-1 text-gray-900 font-medium">{session.title || "Non défini"}</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-600">ID Formation</Label>
            <p className="mt-1 text-gray-900 font-mono text-sm">
              {session.id_trainings || "Non défini"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Date de début</Label>
              <p className="mt-1 text-gray-900">{formatDate(session.begining_date)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Date de fin</Label>
              <p className="mt-1 text-gray-900">{formatDate(session.ending_date)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Nombre total de places</Label>
              <p className="mt-1 text-gray-900 font-semibold">{session.nb_places || 0}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Places disponibles</Label>
              <p className="mt-1 text-gray-900 font-semibold">{session.available_places || 0}</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-600">Documents requis - Avant</Label>
            <div className="mt-1">
              {session.required_document_before && session.required_document_before.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {session.required_document_before.map((doc, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Aucun document requis</p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-600">Documents requis - Pendant</Label>
            <div className="mt-1">
              {session.required_document_during && session.required_document_during.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {session.required_document_during.map((doc, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Aucun document requis</p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-600">Documents requis - Après</Label>
            <div className="mt-1">
              {session.required_document_after && session.required_document_after.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {session.required_document_after.map((doc, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Aucun document requis</p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-600">Méthodes de paiement</Label>
            <div className="mt-1">
              {session.payment_method && session.payment_method.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {session.payment_method.map((method, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Aucune méthode de paiement définie</p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-600">Texte de règlement</Label>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">
                {session.regulation_text || "Aucun règlement défini"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <Label className="text-sm font-medium text-gray-600">Créé le</Label>
              <p className="mt-1 text-gray-900 text-sm">
                {session.createdAt ? formatDate(session.createdAt) : "Non défini"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Dernière modification</Label>
              <p className="mt-1 text-gray-900 text-sm">
                {session.updatedAt ? formatDate(session.updatedAt) : "Non défini"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
