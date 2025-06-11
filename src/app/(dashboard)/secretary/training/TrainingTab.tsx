import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import SessionForm from "./SessionForm";
import SessionList from "./SessionList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ITraining } from "@/types/secretary/training-secretary";

interface TrainingTabsProps {
  formation: ITraining;
  refetchFormations: () => void;
}

const TrainingTabs: React.FC<TrainingTabsProps> = ({ formation, refetchFormations }) => {
  const [showSessionModal, setShowSessionModal] = React.useState(false);
  const [sessions, setSessions] = React.useState(formation.seances || []);

  const handleAddSession = (newSession: any) => {
    setSessions([...sessions, newSession]);
    setShowSessionModal(false);
  };

  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="info">Informations</TabsTrigger>
        <TabsTrigger value="seances">Séances ({sessions.length})</TabsTrigger>
      </TabsList>

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
          <h3 className="text-lg font-semibold">Séances de formation</h3>
          <SessionForm
            open={showSessionModal}
            onOpenChange={setShowSessionModal}
            training={formation}
            onSuccess={handleAddSession}
          >
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une séance
            </Button>
          </SessionForm>
        </div>

        <SessionList sessions={sessions} />
      </TabsContent>
    </Tabs>
  );
};

export default TrainingTabs;
