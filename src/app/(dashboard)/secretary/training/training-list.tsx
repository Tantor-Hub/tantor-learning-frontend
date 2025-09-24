import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TrainingCard from "./TrainingCard";
import TrainingForm from "./TrainingForm";
import EmptyState from "./EmptyState";
import { ITraining } from "@/types/secretary/training-secretary";
import { Loading } from "@/components/shared/loading";
interface TrainingListProps {
  formations: ITraining[];
  onViewDetails: (formation: ITraining) => void;
  onEdit: (formation: ITraining) => void;
  refetchFormations: () => void;
  isLoadingFormationData: boolean;
}

const TrainingList: React.FC<TrainingListProps> = ({
  formations,
  onViewDetails,
  onEdit,
  refetchFormations,
  isLoadingFormationData,
}) => {
  const [showFormationModal, setShowFormationModal] = React.useState(false);
  const [editingTraining, setEditingTraining] = React.useState<ITraining | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Formations</h1>
          <p className="text-gray-600 mt-2">Créez et gérez toutes vos formations</p>
        </div>
        <TrainingForm
          open={showFormationModal}
          onOpenChange={(open) => {
            setShowFormationModal(open);
            if (!open) setEditingTraining(null);
          }}
          onSuccess={() => {
            setShowFormationModal(false);
            setEditingTraining(null);
            refetchFormations();
          }}
          training={editingTraining}
        >
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une Formation
          </Button>
        </TrainingForm>
      </div>

      {isLoadingFormationData && <Loading />}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {formations.map((formation) => (
          <TrainingCard
            key={formation.id}
            formation={formation}
            onViewDetails={onViewDetails}
            onEdit={(formation) => {
              setEditingTraining(formation);
              setShowFormationModal(true);
            }}
            refetchFormations={refetchFormations}
          />
        ))}
      </div>

      {formations.length === 0 && !isLoadingFormationData && (
        <EmptyState
          icon="BookOpen"
          title="Aucune formation"
          description="Commencez par créer votre première formation."
        />
      )}
    </div>
  );
};

export default TrainingList;
