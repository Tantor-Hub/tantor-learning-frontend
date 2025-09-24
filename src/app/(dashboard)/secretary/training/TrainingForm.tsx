import React from "react";
import {
  useCreateTrainingMutation,
  useUpdateTrainingMutation,
} from "@/lib/apis/secretary/training-secretary-api";
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
import { useListCategoryTrainingQuery } from "@/lib/apis/secretary/training-secretary-api";
import { ITrainingType } from "@/types/secretary/training-secretary";

interface TrainingFormProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  training?: any; // Optional training object for editing
}

const TrainingForm: React.FC<TrainingFormProps> = ({
  children,
  open,
  onOpenChange,
  onSuccess,
  training,
}) => {
  const { data: categoriesData, isLoading: categoriesLoading } = useListCategoryTrainingQuery();
  const [createTraining, { isLoading: createLoading }] = useCreateTrainingMutation();
  const [updateTraining, { isLoading: updateLoading }] = useUpdateTrainingMutation();
  const isLoading = createLoading || updateLoading;

  const [form, setForm] = React.useState({
    title: "",
    subtitle: "",
    trainingtype: "",
    id_trainingcategory: "",
    prix: "",
    description: "",
    requirement: "",
    rnc: "",
    pedagogygoals: "",
  });

  const [originalForm, setOriginalForm] = React.useState({
    title: "",
    subtitle: "",
    trainingtype: "",
    id_trainingcategory: "",
    prix: "",
    description: "",
    requirement: "",
    rnc: "",
    pedagogygoals: "",
  });

  // Extract categories from API response
  const categories = React.useMemo(() => categoriesData?.data || [], [categoriesData?.data]);
  console.log(categories);

  // Populate form when editing
  React.useEffect(() => {
    if (training && categories.length > 0) {
      // Find the correct category UUID from the categories list
      const category = categories.find((cat) => cat.id === training.id_category?.toString());
      const categoryId = category ? category.id : training.id_category?.toString() || "";

      const formData = {
        title: training.titre || "",
        subtitle: training.sous_titre || "",
        trainingtype: training.type_formation || "",
        id_trainingcategory: categoryId,
        prix: training.prix?.toString() || "",
        description: training.description || "",
        requirement: training.prerequis || "",
        rnc: training.rnc || "",
        pedagogygoals: training.alternance ? "true" : "",
      };

      setForm(formData);
      setOriginalForm(formData);
    } else if (training) {
      // Fallback if categories not loaded yet
      const formData = {
        title: training.titre || "",
        subtitle: training.sous_titre || "",
        trainingtype: training.type_formation || "",
        id_trainingcategory: training.id_category?.toString() || "",
        prix: training.prix?.toString() || "",
        description: training.description || "",
        requirement: training.prerequis || "",
        rnc: training.rnc || "",
        pedagogygoals: training.alternance ? "true" : "",
      };

      setForm(formData);
      setOriginalForm(formData);
    } else {
      resetForm();
    }
  }, [training, categories]);

  // Training types mapping
  const trainingTypes = [
    { key: ITrainingType.EN_LIGNE, type: "En ligne" },
    { key: ITrainingType.VISION_CONFERENCE, type: "Vision Conférence" },
    { key: ITrainingType.PRESENTIEL, type: "En présentiel" },
    { key: ITrainingType.HYBRIDE, type: "Hybride" },
  ];

  const handleSubmit = async () => {
    // Basic validation - only for creation
    if (
      !training &&
      (!form.title || !form.prix || !form.trainingtype || !form.id_trainingcategory)
    ) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    // Check if there are changes when updating
    if (training && !hasChanges()) {
      toast.error("Aucune modification détectée");
      return;
    }

    try {
      if (training) {
        // Update existing training - send all current values
        await updateTraining({
          id: training.id.toString(),
          title: form.title,
          subtitle: form.subtitle,
          trainingtype: form.trainingtype as any, // Send as display value to match API validation
          id_trainingcategory: form.id_trainingcategory,
          prix: Number(form.prix),
          description: form.description,
          requirement: form.requirement,
          rnc: form.rnc,
          pedagogygoals: form.pedagogygoals, // Keep as string to match API types
        }).unwrap();
        toast.success("Formation mise à jour avec succès");
      } else {
        // Create new training
        await createTraining({
          title: form.title,
          subtitle: form.subtitle,
          trainingtype: form.trainingtype as any, // Send as display value to match API validation
          id_trainingcategory: form.id_trainingcategory,
          prix: Number(form.prix),
          description: form.description,
          requirement: form.requirement,
          rnc: form.rnc,
          pedagogygoals: form.pedagogygoals, // Keep as string to match API types
        }).unwrap();
        toast.success("Formation créée avec succès");
      }
      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      toast.error(training ? "Erreur lors de la mise à jour" : "Erreur lors de la création");
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      subtitle: "",
      trainingtype: "",
      id_trainingcategory: "",
      prix: "",
      description: "",
      requirement: "",
      rnc: "",
      pedagogygoals: "",
    });
    setOriginalForm({
      title: "",
      subtitle: "",
      trainingtype: "",
      id_trainingcategory: "",
      prix: "",
      description: "",
      requirement: "",
      rnc: "",
      pedagogygoals: "",
    });
  };

  // Check if form has changes
  const hasChanges = () => {
    return (
      form.title !== originalForm.title ||
      form.subtitle !== originalForm.subtitle ||
      form.trainingtype !== originalForm.trainingtype ||
      form.id_trainingcategory !== originalForm.id_trainingcategory ||
      form.prix !== originalForm.prix ||
      form.description !== originalForm.description ||
      form.requirement !== originalForm.requirement ||
      form.rnc !== originalForm.rnc ||
      form.pedagogygoals !== originalForm.pedagogygoals
    );
  };

  // Check if individual field has changed
  const hasFieldChanged = (fieldName: string) => {
    return (
      form[fieldName as keyof typeof form] !== originalForm[fieldName as keyof typeof originalForm]
    );
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
          <DialogTitle className="text-2xl font-semibold">
            {training ? "Modifier la Formation" : "Nouvelle Formation"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {training
              ? "Modifiez les informations de la formation ci-dessous."
              : "Créez une nouvelle formation en remplissant les informations ci-dessous."}
          </DialogDescription>
          {training && hasChanges() && (
            <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-blue-700">Modifications détectées</span>
            </div>
          )}
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Informations générales
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Titre de la formation <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Diplôme de Comptabilité et Gestion"
                  className={`mt-1 w-full ${training && hasFieldChanged("title") ? "border-blue-500 bg-blue-50" : ""}`}
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
                  className={`mt-1 ${training && hasFieldChanged("prix") ? "border-blue-500 bg-blue-50" : ""}`}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="subtitle" className="text-sm font-medium">
                Sous-titre
              </Label>
              <Input
                id="subtitle"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Ex: Comptabilité et Finance • Bac+3"
                className={`mt-1 ${training && hasFieldChanged("subtitle") ? "border-blue-500 bg-blue-50" : ""}`}
              />
            </div>
          </div>

          {/* Configuration Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Configuration</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="w-full">
                <Label htmlFor="trainingtype" className="text-sm font-medium">
                  Type de Formation <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.trainingtype}
                  onValueChange={(value) => setForm({ ...form, trainingtype: value })}
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainingTypes.map((type) => (
                      <SelectItem key={type.key} value={type.key}>
                        {type.type}
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
                  value={form.id_trainingcategory}
                  onValueChange={(value) => setForm({ ...form, id_trainingcategory: value })}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue
                      placeholder={
                        categoriesLoading ? "Chargement..." : "Sélectionner la catégorie"
                      }
                    />
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
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Contenu pédagogique</h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pedagogygoals" className="text-sm font-medium">
                    Objectifs pédagogiques
                  </Label>
                  <Textarea
                    id="pedagogygoals"
                    value={form.pedagogygoals}
                    onChange={(e) => setForm({ ...form, pedagogygoals: e.target.value })}
                    placeholder="Décrivez les objectifs et compétences à acquérir..."
                    rows={4}
                    className="mt-1 resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="requirement" className="text-sm font-medium">
                    Prérequis
                  </Label>
                  <Textarea
                    id="requirement"
                    value={form.requirement}
                    onChange={(e) => setForm({ ...form, requirement: e.target.value })}
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
                  className={`mt-1 resize-none ${training && hasFieldChanged("description") ? "border-blue-500 bg-blue-50" : ""}`}
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
            disabled={isLoading || categoriesLoading || (training && !hasChanges())}
            className="bg-blue-600 hover:bg-blue-700 px-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {training ? "Mise à jour en cours..." : "Création en cours..."}
              </>
            ) : training ? (
              "Mis à jour"
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
