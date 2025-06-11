import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Loader2, Trash2 } from "lucide-react";
import { useDeleteTrainingByIdMutation } from "@/lib/apis/secretary/training-secretary-api";
import { ITraining } from "@/types/secretary/training-secretary";
import { toast } from "sonner";

interface TrainingCardProps {
  formation: ITraining;
  onViewDetails: (formation: ITraining) => void;
  refetchFormations: () => void;
}

const TrainingCard: React.FC<TrainingCardProps> = ({
  formation,
  onViewDetails,
  refetchFormations,
}) => {
  const [deleteTrainingMutation, { isLoading }] = useDeleteTrainingByIdMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteTrainingMutation({ id }).unwrap();
      toast.success("Suppression réussie", {
        description: "La formation a été supprimée avec succès.",
      });

      refetchFormations();
    } catch (error) {
      console.error("Delete error:", error);

      toast.error("Échec de la suppression", {
        description:
          "Une erreur est survenue lors de la suppression de la formation. Veuillez réessayer.",
      });
    }
  };

  return (
    <Card key={formation.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="mb-2">
            {formation.Category?.category}
          </Badge>
          <Badge variant={formation.status === 1 ? "default" : "secondary"}>
            {formation.status === 1 ? "Actif" : "Inactif"}
          </Badge>
        </div>
        <CardTitle className="text-xl">{formation.titre}</CardTitle>
        <CardDescription>{formation.sous_titre}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Prix:</span>
            <span className="font-semibold text-lg text-blue-600">{formation.prix}€</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Type:</span>
            <Badge variant="outline">
              {formation.Category.category === "onLine"
                ? "En ligne"
                : formation.Category.category === "presentiel"
                  ? "Présentiel"
                  : "Hybride"}
            </Badge>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => onViewDetails(formation)} className="flex-1" variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Détails
            </Button>
            <Button
              onClick={() => handleDelete(String(formation.id))}
              variant="outline"
              size="icon"
              className="text-red-600"
            >
              {isLoading ? (
                <Loader2 className="animate-spin  size-4" />
              ) : (
                <Trash2 className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingCard;
