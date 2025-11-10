"use client";

import React from "react";
import {
  useListTrainingByIdQuery,
  useListSessionByTrainingIdQuery,
} from "@/lib/apis/secretary/training-secretary-api";
import {
  useGetCatalogueFormationsByTrainingIdQuery,
  useDeleteStudentCatalogueFormationMutation,
} from "@/lib/apis/catalogue-formation";
import { useRouter, useParams } from "next/navigation";
import { Loading } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, MoreVertical, Trash2, FileText, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ISession } from "@/types/secretary/training-secretary";
import { EmptyState } from "@/components/shared/empty-state";
import MinimalSessionForm from "../../MinimalSessionForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SessionTab from "../session/SessionTab";
import { toast } from "react-hot-toast";

const SessionList = ({ sessions }: { sessions: ISession[] }) => {
  return (
    <div className="space-y-4">
      {sessions.map((session: ISession) => (
        <Card key={session.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{session.title}</CardTitle>
              <CardDescription>
                {/* {new Dasession.createdAt?.toLocaleDateString("fr-FR") || "Aucune description disponible"} */}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Modifier</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <p>{session.regulation_text || "Aucun règlement spécifié"}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              Places disponibles: {session.nb_places} sur {session.available_places}
            </div>
            {/* <div>Paiement: {session.payment_method.map(item) => <span>{item}</span>}</div> */}
          </CardFooter>
        </Card>
      ))}

      {sessions.length === 0 && (
        <EmptyState
          icon="Calendar"
          title="Aucune session"
          description="Ajoutez des sessions pour structurer votre formation."
        />
      )}
    </div>
  );
};

const TrainingSummary = ({ formation }: { formation: any }) => {
  const totalDuration = formation.Sessions?.reduce((acc: number, session: ISession) => {
    // You might want to parse the duration from session.duree here
    return acc + 10; // Placeholder - implement actual duration calculation
  }, 0);

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
          <span className="text-gray-600">Sessions</span>
          <span className="font-medium">{formation.Sessions?.length || 0}</span>
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
          {/* <p className="font-medium">{new Date(formation.createdAt).toLocaleDateString("fr-FR")}</p> */}
        </div>
      </CardContent>
    </Card>
  );
};

// Catalogue Management Component
const CatalogueManagement = ({ training }: { training: any }) => {
  const { data: catalogueData, isLoading: catalogueLoading } =
    useGetCatalogueFormationsByTrainingIdQuery(training.id);
  const [deleteCatalogue, { isLoading: deleteLoading }] =
    useDeleteStudentCatalogueFormationMutation();

  const catalogue = catalogueData?.data?.[0]; // Assuming single student catalogue per training

  const handleDelete = async () => {
    try {
      await deleteCatalogue().unwrap();
      toast.success("Catalogue supprimé avec succès");
    } catch (error) {
      console.error("Error deleting catalogue:", error);
      toast.error("Erreur lors de la suppression du catalogue");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Catalogue de Formation</CardTitle>
        <CardDescription>Gérez le catalogue de formation pour les étudiants</CardDescription>
      </CardHeader>
      <CardContent>
        {catalogueLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : catalogue ? (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">{catalogue.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{catalogue.description}</p>
                  {catalogue.piece_jointe && (
                    <div className="flex items-center gap-2 mt-2">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm text-blue-600">{catalogue.piece_jointe}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {/* {catalogue.piece_jointe && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(catalogue.piece_jointe!, '_blank')}
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  )} */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucun catalogue défini pour cette formation
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const TrainingTabs = ({ formation, trainingId }: { formation: any; trainingId: string }) => {
  const { data, isLoading, refetch } = useListSessionByTrainingIdQuery({ trainingId: trainingId });

  if (isLoading) return <Loading />;

  const sessions = data?.data || [];

  const handleAddSession = () => {
    refetch();
  };

  return (
    <Tabs defaultValue="catalogue" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="catalogue">Catalogue</TabsTrigger>
        <TabsTrigger value="info">Informations</TabsTrigger>
        <TabsTrigger value="sessions">Sessions ({sessions.length})</TabsTrigger>
        <TabsTrigger value="session">Session</TabsTrigger>
      </TabsList>

      <TabsContent value="catalogue" className="space-y-4">
        <CatalogueManagement training={formation} />
      </TabsContent>

      <TabsContent value="info" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Détails de la formation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Description</Label>
              <p className="mt-1">{formation.description || "Aucune description disponible"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Prérequis</Label>
              <p className="mt-1">{formation.prerequis || "Aucun prérequis spécifié"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Catégorie</Label>
                <p className="mt-1">{formation.Category?.category}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Type</Label>
                <p className="mt-1 capitalize">
                  {formation.type_formation?.toLowerCase() || "Non spécifié"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sessions" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Sessions de formation</h3>
          <MinimalSessionForm trainingId={trainingId} onSuccess={handleAddSession} />
        </div>

        <SessionList sessions={sessions} />
      </TabsContent>

      <TabsContent value="session" className="space-y-4">
        <SessionTab />
      </TabsContent>
    </Tabs>
  );
};

export default function TrainingDetailsClient() {
  const router = useRouter();
  const params = useParams();
  const trainingId = params.id as string;
  const { data, isLoading, isError } = useListTrainingByIdQuery({ id: trainingId });

  if (isLoading) return <Loading />;
  if (isError) return <div>Erreur lors du chargement des détails de la formation</div>;

  const formation = data?.data;
  if (!formation) return null;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{formation.title}</h1>
                  <p className="text-gray-600">{formation.subtitle}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <TrainingTabs formation={formation} trainingId={trainingId} />
            </div>
            <div>
              <TrainingSummary formation={formation} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
