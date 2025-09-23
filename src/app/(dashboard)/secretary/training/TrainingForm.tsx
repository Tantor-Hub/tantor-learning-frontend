import React from "react";
import { useAddTrainingMutation } from "@/lib/apis/secretary/training-secretary-api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  useListTrainingTypeQuery,
  useListCategoryTrainingQuery,
} from "@/lib/apis/secretary/training-secretary-api";

interface TrainingFormProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const TrainingForm: React.FC<TrainingFormProps> = ({ children, open, onOpenChange, onSuccess }) => {
  const { data: categoriesResponse, isLoading: isCategoriesListTrainingLoading } =
    useListCategoryTrainingQuery();
  const { data: trainingTypesResponse, isLoading: isTrainingTypeLoading } =
    useListTrainingTypeQuery();
  const [addTrainingMutation, { isLoading }] = useAddTrainingMutation();

  const [form, setForm] = React.useState({
    titre: "",
    sous_titre: "",
    type_formation: "",
    id_category: "",
    prix: "",
    description: "",
    prerequis: "",
    rnc: "",
    objectif: "",
    alternance: "",
  });

  // Extract categories from API response
  const categories = categoriesResponse?.data || [];

  // Extract training types from API response
  const trainingTypes = trainingTypesResponse?.data || [];

  const handleSubmit = async () => {
    try {
      await addTrainingMutation({
        titre: form.titre,
        sous_titre: form.sous_titre,
        type_formation: form.type_formation as
          | "onLine"
          | "visioConference"
          | "presentiel"
          | "hybride",
        prix: form.prix,
        id_category: form.id_category || String(categories[0]?.id || ""),
        description: form.description,
        prerequis: form.prerequis,
        rnc: form.rnc,
        // objectif: form.objectif,
        alternance: form.alternance,
      }).unwrap();
      toast.success("Création réussie");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Erreur lors de la création");
    }
  };

  const resetForm = () => {
    setForm({
      titre: "",
      sous_titre: "",
      type_formation: "",
      id_category: "",
      prix: "",
      description: "",
      prerequis: "",
      rnc: "",
      objectif: "",
      alternance: "",
    });
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-semibold">Nouvelle Formation</DialogTitle>
          <DialogDescription className="text-base">
            Créez une nouvelle formation en remplissant les informations ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Informations générales
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <Label htmlFor="titre" className="text-sm font-medium">
                  Titre de la formation <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="titre"
                  value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  placeholder="Ex: Diplôme de Comptabilité et Gestion"
                  className="mt-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="prix" className="text-sm font-medium">
                  Prix (€) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="prix"
                  type="number"
                  value={form.prix}
                  onChange={(e) => setForm({ ...form, prix: e.target.value })}
                  placeholder="9000"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="sous_titre" className="text-sm font-medium">
                Sous-titre
              </Label>
              <Input
                id="sous_titre"
                value={form.sous_titre}
                onChange={(e) => setForm({ ...form, sous_titre: e.target.value })}
                placeholder="Ex: Comptabilité et Finance • Bac+3"
                className="mt-1"
              />
            </div>
          </div>

          {/* Configuration Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Configuration</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="w-full">
                <Label htmlFor="type_formation" className="text-sm font-medium">
                  Type de Formation <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.type_formation}
                  onValueChange={(value) => setForm({ ...form, type_formation: value })}
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Sélectionner le type" className="w-full" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainingTypes.map((type) => (
                      <SelectItem key={type.key} value={type.key} className="w-full">
                        <div>
                          <div className="font-medium">{type.type}</div>
                          {/* <div className="text-xs text-gray-500">{type.description}</div> */}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full">
                <Label htmlFor="category" className="text-sm font-medium">
                  Catégorie <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.id_category}
                  onValueChange={(value) => setForm({ ...form, id_category: value })}
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Sélectionner la catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="rnc" className="text-sm font-medium">
                  Référence RNC
                </Label>
                <Input
                  id="rnc"
                  value={form.rnc}
                  onChange={(e) => setForm({ ...form, rnc: e.target.value })}
                  placeholder="Ex: RNCP34734"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="alternance" className="text-sm font-medium">
                  Durée d'alternance
                </Label>
                <Input
                  id="alternance"
                  value={form.alternance}
                  onChange={(e) => setForm({ ...form, alternance: e.target.value })}
                  placeholder="Ex: 24 mois"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Contenu pédagogique</h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="objectif" className="text-sm font-medium">
                    Objectifs pédagogiques
                  </Label>
                  <Textarea
                    id="objectif"
                    value={form.objectif}
                    onChange={(e) => setForm({ ...form, objectif: e.target.value })}
                    placeholder="Décrivez les objectifs et compétences à acquérir..."
                    rows={4}
                    className="mt-1 resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="prerequis" className="text-sm font-medium">
                    Prérequis
                  </Label>
                  <Textarea
                    id="prerequis"
                    value={form.prerequis}
                    onChange={(e) => setForm({ ...form, prerequis: e.target.value })}
                    placeholder="Niveau requis, diplômes, expérience..."
                    rows={4}
                    className="mt-1 resize-none"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Description détaillée
                </Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Description complète du programme, méthodes pédagogiques, modalités d'évaluation..."
                  rows={8}
                  className="mt-1 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading} className="px-6">
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 px-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Création en cours...
              </>
            ) : (
              "Créer la Formation"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingForm;
