import React from "react";
import { Button } from "@/components/ui/button";
import TrainingTabs from "./TrainingTab";
import TrainingSummary from "./TrainingSummary";
import { ITraining } from "@/types/secretary/training-secretary";

interface TrainingDetailsProps {
  formation: ITraining | null;
  onBack: () => void;
  refetchFormations: () => void;
}

const TrainingDetails: React.FC<TrainingDetailsProps> = ({
  formation,
  onBack,
  refetchFormations,
}) => {
  if (!formation) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          ← Retour à la liste
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{formation.titre}</h1>
          <p className="text-gray-600">{formation.sous_titre}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <TrainingTabs formation={formation} refetchFormations={refetchFormations} />
        </div>
        <div>
          <TrainingSummary formation={formation} />
        </div>
      </div>
    </div>
  );
};

export default TrainingDetails;
