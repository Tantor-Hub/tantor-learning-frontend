import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Edit, Ellipsis } from "lucide-react";
import { useDeleteTrainingByIdMutation } from "@/lib/apis/secretary/training-secretary-api";
import { ITraining } from "@/types/secretary/training-secretary";
import { toast } from "react-hot-toast";

interface TrainingCardProps {
  formation: ITraining;
  onViewDetails: (formation: ITraining) => void;
  onEdit: (formation: ITraining) => void;
  refetchFormations: () => void;
}

const TrainingCard: React.FC<TrainingCardProps> = ({
  formation,
  onViewDetails,
  onEdit,
  refetchFormations,
}) => {
  const [deleteTrainingMutation, { isLoading }] = useDeleteTrainingByIdMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteTrainingMutation({ id }).unwrap();
      toast.success("Suppression réussie");

      refetchFormations();
    } catch (error) {
      console.error("Delete error:", error);

      toast.error("Échec de la suppression");
    }
  };

  return (
    <Card key={formation.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="mb-2">
            {formation.trainingCategory?.title || ""}
          </Badge>
        </div>
        <CardTitle className="text-xl">{formation.title}</CardTitle>
        <CardDescription>{formation.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Prix:</span>
            <span className="font-semibold text-lg text-blue-600">{formation.prix}€</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Type:</span>
            <Badge variant="outline">{formation.trainingtype}</Badge>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => onViewDetails(formation)} variant="outline">
              <Ellipsis className="size-6" />
            </Button>
            <Button onClick={() => onEdit(formation)} variant="outline">
              <Edit className="size-6" />
            </Button>
            <Button
              onClick={() => handleDelete(String(formation.id))}
              variant="outline"
              className="text-destructive"
            >
              {isLoading ? (
                <Loader2 className="animate-spin size-6" />
              ) : (
                <Trash2 className="size-6" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingCard;
