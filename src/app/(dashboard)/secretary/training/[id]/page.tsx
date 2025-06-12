"use client";
import React, { useState, useEffect } from "react";
import { useListTrainingByIdQuery } from "@/lib/apis/secretary/training-secretary-api";
import { useRouter, useParams } from "next/navigation";
import { Loading } from "@/components/shared/loading";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Calendar, Clock, Users, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ITraining, ISession, ICategory } from "@/types/secretary/training-secretary";
import { EmptyState } from "@/components/shared/empty-state";
import SessionForm from "../SessionForm";

const SessionList = ({ sessions }: { sessions: ISession[] }) => {
  return (
    <div className="space-y-4">
      {sessions.map((session: ISession) => (
        <Card key={session.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{session.description}</h4>
                <p className="text-gray-600 mt-1">{session.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(session.duree).toLocaleDateString("fr-FR")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {session.date_session_debut} - {session.date_session_fin}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {session.duree} min
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {sessions.length === 0 && (
        <EmptyState
          icon="Calendar"
          title="Aucune séance"
          description="Ajoutez des séances pour structurer votre formation."
        />
      )}
    </div>
  );
};

const TrainingSummary = ({ formation }: { formation: any }) => {
  const totalDuration = 10;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Résumé</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Prix</span>
          <span className="font-semibold text-xl text-blue-600">{formation.prix}€</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Séances</span>
          <span className="font-medium">{formation.seances?.length || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Durée totale</span>
          <span className="font-medium">{totalDuration} min</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Statut</span>
          <Badge variant={formation.status === 1 ? "default" : "secondary"}>
            {formation.status === 1 ? "Actif" : "Inactif"}
          </Badge>
        </div>
        <div className="pt-4 border-t">
          <span className="text-gray-600 text-sm">Créée le</span>
          <p className="font-medium">{new Date(formation.createdAt).toLocaleDateString("fr-FR")}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const TrainingTabs = ({
  formation,
  trainingId,
  refetchFormations,
}: {
  formation: any;
  refetchFormations: () => void;
  trainingId: string;
}) => {
  const [showSessionModal, setShowSessionModal] = React.useState(false);
  const [sessions, setSessions] = React.useState<any[]>([]);
  const {
    data: sessionData,
    isLoading: isLoadingSessionData,
    isError,
    refetch: refetchSessionData,
  } = useListTrainingByIdQuery({ id: formation.id.toString() });

  useEffect(() => {
    if (sessionData?.data.Sessions) {
      setSessions(sessionData.data.Sessions);
    }
  }, [sessionData?.data.Sessions]);

  if (isLoadingSessionData) {
    return <Loading />;
  }

  const handleAddSession = () => {
    refetchSessionData();
    setShowSessionModal(false);
  };

  if (isError) {
    return <div>Error loading sessions</div>;
  }

  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="info">Informations</TabsTrigger>
        <TabsTrigger value="seances">Sessions ({sessions.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Détails de la formation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Description</Label>
              <p className="mt-1">
                {sessionData?.data.description ||
                  formation.description ||
                  "Aucune description disponible"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Prérequis</Label>
              <p className="mt-1">{formation.prerequis || "Aucun prérequis spécifique"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Catégorie</Label>
                <p className="mt-1">{formation.Category?.category}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Type</Label>
                <p className="mt-1">
                  {formation.Category.category === "onLine"
                    ? "En ligne"
                    : formation.Category.category === "presentiel"
                      ? "Présentiel"
                      : "Hybride"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="seances" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Sessions de formation</h3>
          <SessionForm
            open={showSessionModal}
            onOpenChange={setShowSessionModal}
            // training={formation}
            trainingId={trainingId}
            onSuccess={handleAddSession}
          >
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une session
            </Button>
          </SessionForm>
        </div>

        <SessionList sessions={sessions} />
      </TabsContent>
    </Tabs>
  );
};

function TrainingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const trainingId = params.id as string;
  const {
    data,
    isLoading,
    isError,
    refetch: refetchTraining,
  } = useListTrainingByIdQuery({ id: trainingId }, { skip: !trainingId });

  const [showSessionModal, setShowSessionModal] = React.useState(false);

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading training details</div>;

  const formation = data?.data;

  if (!formation) return null;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft /> Retour à la liste
              </Button>

              <SessionForm
                open={showSessionModal}
                onOpenChange={setShowSessionModal}
                // training={formation}
                onSuccess={() => {
                  setShowSessionModal(false);
                  refetchTraining();
                }}
                trainingId={trainingId}
              >
                Ajouter une session
              </SessionForm>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{formation.titre}</h1>
                  <p className="text-gray-600">{data.data.sous_titre}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <TrainingTabs
                formation={formation}
                refetchFormations={refetchTraining}
                trainingId={trainingId}
              />
            </div>
            <div>
              <TrainingSummary formation={data.data.Sessions || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <TrainingDetailsPage />
    </Suspense>
  );
}
