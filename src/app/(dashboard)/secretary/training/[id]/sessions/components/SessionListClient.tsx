"use client";

import React, { useState } from "react";
import {
  useListSessionByTrainingIdQuery,
  useCreateSessionMutation,
  useUpdateTrainingMutation,
  useDeleteTrainingByIdMutation,
  useListTrainingByIdQuery,
} from "@/lib/apis/secretary/training-secretary-api";
import { useDeleteSessionMutation } from "@/lib/apis/secretary/session-secretary-api";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Calendar as CalendarIcon, Clock, Users, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-hot-toast";
import {
  ISession,
  ICreateSessionRequest,
  ITraining,
  IUpdateTrainingRequest,
  ITrainingType,
} from "@/types/secretary/training-secretary";
import {
  useGetCatalogueFormationsByTrainingIdQuery,
  useCreateStudentCatalogueFormationMutation,
  useUpdateStudentCatalogueFormationMutation,
  useDeleteStudentCatalogueFormationMutation,
} from "@/lib/apis/catalogue-formation";
import { CatalogueFormation } from "@/types/catalogue-formation";
import { FileText, Edit, Trash2, Upload, Download } from "lucide-react";

const SessionCard = ({
  session,
  onViewDetails,
  onDelete,
}: {
  session: ISession;
  onViewDetails: (session: ISession) => void;
  onDelete: (sessionId: string) => void;
}) => {
  return (
    <Card className="border hover:cursor-pointer" onClick={() => onViewDetails(session)}>
      <CardHeader>
        <CardTitle className="text-xl">{session.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <span>
              {format(new Date(session.begining_date), "d MMMM yyyy", { locale: fr })} -{" "}
              {format(new Date(session.ending_date), "d MMMM yyyy", { locale: fr })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{session.available_places} places</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(session);
            }}
          >
            Voir les détails
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const UpdateTrainingForm = ({
  training,
  onSuccess,
}: {
  training: ITraining;
  onSuccess: () => void;
}) => {
  const [updateTraining, { isLoading }] = useUpdateTrainingMutation();
  const [formData, setFormData] = useState({
    id: training.id,
    title: training.title,
    subtitle: training.subtitle,
    id_trainingcategory: training.id_trainingcategory,
    trainingtype: training.trainingtype,
    rnc: training.rnc,
    description: training.description,
    requirement: training.requirement,
    pedagogygoals: training.pedagogygoals,
    prix: training.prix,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData: IUpdateTrainingRequest = {
        id: formData.id,
        title: formData.title,
        subtitle: formData.subtitle,
        id_trainingcategory: formData.id_trainingcategory,
        trainingtype: formData.trainingtype,
        rnc: formData.rnc,
        description: formData.description,
        requirement: formData.requirement,
        pedagogygoals: formData.pedagogygoals,
        prix: formData.prix,
      };

      await updateTraining(submitData).unwrap();
      toast.success("Formation mise à jour avec succès !");
      onSuccess();
    } catch (error) {
      console.error("Error updating training:", error);
      toast.error("Erreur lors de la mise à jour de la formation");
    }
  };

  const handleInputChange = (field: string, value: string | number | ITrainingType) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Titre *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          required
          placeholder="Entrez le titre de la formation"
        />
      </div>

      <div>
        <Label htmlFor="subtitle">Sous-titre</Label>
        <Input
          id="subtitle"
          value={formData.subtitle}
          onChange={(e) => handleInputChange("subtitle", e.target.value)}
          placeholder="Entrez le sous-titre de la formation"
        />
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          required
          rows={3}
          placeholder="Entrez la description de la formation"
        />
      </div>

      <div>
        <Label htmlFor="requirement">Prérequis</Label>
        <Textarea
          id="requirement"
          value={formData.requirement}
          onChange={(e) => handleInputChange("requirement", e.target.value)}
          rows={2}
          placeholder="Entrez les prérequis de la formation"
        />
      </div>

      <div>
        <Label htmlFor="pedagogygoals">Objectifs pédagogiques</Label>
        <Textarea
          id="pedagogygoals"
          value={formData.pedagogygoals}
          onChange={(e) => handleInputChange("pedagogygoals", e.target.value)}
          rows={2}
          placeholder="Entrez les objectifs pédagogiques"
        />
      </div>

      <div>
        <Label htmlFor="prix">Prix *</Label>
        <Input
          id="prix"
          type="number"
          min="0"
          value={formData.prix}
          onChange={(e) => handleInputChange("prix", parseFloat(e.target.value) || 0)}
          required
          placeholder="Prix de la formation"
        />
      </div>

      <div>
        <Label htmlFor="rnc">RNC</Label>
        <Input
          id="rnc"
          value={formData.rnc}
          onChange={(e) => handleInputChange("rnc", e.target.value)}
          placeholder="Numéro RNC"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Mise à jour..." : "Mettre à jour la formation"}
      </Button>
    </form>
  );
};

const CreateSessionForm = ({
  trainingId,
  onSuccess,
}: {
  trainingId: string;
  onSuccess: () => void;
}) => {
  const [createSession, { isLoading }] = useCreateSessionMutation();
  const [formData, setFormData] = useState({
    id_trainings: trainingId,
    title: "",
    nb_places: 1,
    regulation_text: "",
    begining_date: undefined as Date | undefined,
    ending_date: undefined as Date | undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation is handled by button disabled state
    if (!isFormValid()) {
      return;
    }

    try {
      const submitData: ICreateSessionRequest = {
        ...formData,
        begining_date: formData.begining_date!.toISOString(),
        ending_date: formData.ending_date!.toISOString(),
      };

      await createSession(submitData).unwrap();
      toast.success("Session créée avec succès !");
      onSuccess();
      // Reset form
      setFormData({
        id_trainings: trainingId,
        title: "",
        nb_places: 1,
        regulation_text: "",
        begining_date: undefined,
        ending_date: undefined,
      });
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Erreur lors de la création de la session");
    }
  };

  const handleInputChange = (field: string, value: string | number | Date | undefined) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // If beginning date is changed and ending date is before it, reset ending date
      if (field === "begining_date" && value instanceof Date && prev.ending_date) {
        if (prev.ending_date < value) {
          newData.ending_date = undefined;
        }
      }

      return newData;
    });
  };

  // Check if all required fields are filled and dates are valid
  const isFormValid = () => {
    const today = new Date(new Date().setHours(0, 0, 0, 0));

    return (
      formData.title.trim() !== "" &&
      formData.nb_places > 0 &&
      formData.begining_date !== undefined &&
      formData.ending_date !== undefined &&
      formData.regulation_text.trim() !== "" &&
      // Ensure beginning date is not in the past
      formData.begining_date >= today &&
      // Ensure ending date is not before beginning date
      formData.ending_date >= formData.begining_date
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Titre de la session *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          required
          placeholder="Entrez le titre de la session"
        />
      </div>

      <div>
        <Label htmlFor="nb_places">Nombre de places *</Label>
        <Input
          id="nb_places"
          type="number"
          min="1"
          value={formData.nb_places}
          onChange={(e) => handleInputChange("nb_places", parseInt(e.target.value) || 1)}
          required
          placeholder="Nombre total de places"
        />
        <p className="text-sm text-gray-500 mt-1">
          Les places disponibles seront calculées automatiquement
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Date de début *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !formData.begining_date && "text-muted-foreground"
                }`}
                type="button"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.begining_date ? (
                  format(formData.begining_date, "PPP", { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.begining_date}
                onSelect={(date) => handleInputChange("begining_date", date)}
                initialFocus
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label>Date de fin *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !formData.ending_date && "text-muted-foreground"
                }`}
                type="button"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.ending_date ? (
                  format(formData.ending_date, "PPP", { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.ending_date}
                onSelect={(date) => handleInputChange("ending_date", date)}
                initialFocus
                disabled={(date) => {
                  const today = new Date(new Date().setHours(0, 0, 0, 0));
                  const beginningDate = formData.begining_date;

                  // Disable past dates
                  if (date < today) return true;

                  // Disable dates before the beginning date if it's selected
                  if (beginningDate && date < beginningDate) return true;

                  return false;
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <Label htmlFor="regulation_text">Texte de réglementation *</Label>
        <Textarea
          id="regulation_text"
          value={formData.regulation_text}
          onChange={(e) => handleInputChange("regulation_text", e.target.value)}
          required
          rows={3}
          placeholder="Entrez le texte de réglementation pour cette session"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !isFormValid()}>
        {isLoading ? "Création..." : "Créer la session"}
      </Button>
    </form>
  );
};

export default function SessionListClient() {
  const router = useRouter();
  const params = useParams();
  const trainingId = params.id as string;
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const { data, isLoading, refetch } = useListSessionByTrainingIdQuery({ trainingId });
  const { data: trainingData } = useListTrainingByIdQuery({ id: trainingId });
  const [deleteSession, { isLoading: isDeleting }] = useDeleteSessionMutation();
  const [deleteTraining] = useDeleteTrainingByIdMutation();

  // Catalogue hooks
  const { data: catalogueData, isLoading: catalogueLoading } =
    useGetCatalogueFormationsByTrainingIdQuery(trainingId);
  const [createCatalogue, { isLoading: createLoading }] =
    useCreateStudentCatalogueFormationMutation();
  const [updateCatalogue, { isLoading: updateLoading }] =
    useUpdateStudentCatalogueFormationMutation();
  const [deleteCatalogue, { isLoading: deleteLoading }] =
    useDeleteStudentCatalogueFormationMutation();

  const [isCatalogueDialogOpen, setIsCatalogueDialogOpen] = useState(false);
  const [editingCatalogue, setEditingCatalogue] = useState<CatalogueFormation | null>(null);
  const [catalogueForm, setCatalogueForm] = useState({
    title: "",
    description: "",
    piece_jointe: null as File | null,
  });

  const catalogue = catalogueData?.data?.[0]; // Assuming single student catalogue per training

  const handleViewDetails = (session: ISession) => {
    router.push(`/secretary/training/${trainingId}/sessions/${session.id}`);
  };

  const handleGoBack = () => {
    router.push("/secretary/training");
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    refetch(); // Refresh the sessions list
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession({ id: sessionId }).unwrap();
      toast.success("Session supprimée avec succès !");
      refetch(); // Refresh the sessions list
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Erreur lors de la suppression de la session");
    }
  };

  const handleUpdateTrainingSuccess = () => {
    setIsUpdateDialogOpen(false);
  };

  const handleDeleteTraining = async () => {
    try {
      await deleteTraining({ id: trainingId }).unwrap();
      toast.success("Formation supprimée avec succès !");
      router.push("/secretary/training"); // Redirect to training list
    } catch (error) {
      console.error("Error deleting training:", error);
      toast.error("Erreur lors de la suppression de la formation");
    }
  };

  // Catalogue handlers
  const handleCreateCatalogue = async () => {
    if (!catalogueForm.title.trim()) {
      toast.error("Le titre est requis");
      return;
    }

    try {
      await createCatalogue({
        title: catalogueForm.title.trim(),
        id_training: trainingId,
        description: catalogueForm.description.trim() || undefined,
        piece_jointe: catalogueForm.piece_jointe || undefined,
      }).unwrap();
      toast.success("Catalogue créé avec succès");
      setIsCatalogueDialogOpen(false);
      resetCatalogueForm();
    } catch (error) {
      console.error("Error creating catalogue:", error);
      toast.error("Erreur lors de la création du catalogue");
    }
  };

  const handleUpdateCatalogue = async () => {
    if (!catalogueForm.title.trim()) {
      toast.error("Le titre est requis");
      return;
    }

    try {
      await updateCatalogue({
        title: catalogueForm.title.trim(),
        description: catalogueForm.description.trim() || undefined,
        piece_jointe: catalogueForm.piece_jointe || undefined,
        id: editingCatalogue!.id,
      }).unwrap();
      toast.success("Catalogue mis à jour avec succès");
      setEditingCatalogue(null);
      resetCatalogueForm();
    } catch (error) {
      console.error("Error updating catalogue:", error);
      toast.error("Erreur lors de la mise à jour du catalogue");
    }
  };

  const handleDeleteCatalogue = async () => {
    try {
      await deleteCatalogue().unwrap();
      toast.success("Catalogue supprimé avec succès");
    } catch (error) {
      console.error("Error deleting catalogue:", error);
      toast.error("Erreur lors de la suppression du catalogue");
    }
  };

  const resetCatalogueForm = () => {
    setCatalogueForm({
      title: "",
      description: "",
      piece_jointe: null,
    });
  };

  const handleCatalogueFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCatalogueForm({ ...catalogueForm, piece_jointe: file });
  };

  React.useEffect(() => {
    if (editingCatalogue) {
      setCatalogueForm({
        title: editingCatalogue.title || "",
        description: editingCatalogue.description || "",
        piece_jointe: null,
      });
    } else {
      resetCatalogueForm();
    }
  }, [editingCatalogue]);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 4 }, (_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const sessions = data?.data || [];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8 flex-col">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" onClick={handleGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux formations
            </Button>

            <div className="flex gap-2">
              <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Edit /> Modifier la formation
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Modifier la formation</DialogTitle>
                  </DialogHeader>
                  {trainingData?.data && (
                    <UpdateTrainingForm
                      training={trainingData.data}
                      onSuccess={handleUpdateTrainingSuccess}
                    />
                  )}
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-destructive text-white hover:bg-destructive/90">
                    <Trash2 />
                    Supprimer la formation
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Cela supprimera définitivement la formation et
                      toutes ses sessions associées.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteTraining}
                      className="bg-destructive text-white hover:bg-destructive/90"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Catalogue Section */}
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Catalogue de formation</h2>
              {!catalogue && (
                <Button onClick={() => setIsCatalogueDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un catalogue
                </Button>
              )}
            </div>

            {catalogueLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              </div>
            ) : catalogue ? (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-white">
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCatalogue(catalogue)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {catalogue.piece_jointe && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(catalogue.piece_jointe!, "_blank")}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteCatalogue}
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
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
          </div>

          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sessions de formation</h1>
              <p className="text-gray-600">
                Découvrez toutes les sessions disponibles pour cette formation
              </p>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une session
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle session</DialogTitle>
                </DialogHeader>
                <CreateSessionForm trainingId={trainingId} onSuccess={handleCreateSuccess} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune session disponible pour cette formation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onViewDetails={handleViewDetails}
                onDelete={handleDeleteSession}
              />
            ))}
          </div>
        )}

        {/* Catalogue Dialog */}
        <Dialog
          open={isCatalogueDialogOpen || !!editingCatalogue}
          onOpenChange={(open) => {
            if (!open) {
              setIsCatalogueDialogOpen(false);
              setEditingCatalogue(null);
              resetCatalogueForm();
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCatalogue ? "Modifier le catalogue" : "Créer un catalogue"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="catalogue-title">Titre *</Label>
                <Input
                  id="catalogue-title"
                  value={catalogueForm.title}
                  onChange={(e) => setCatalogueForm({ ...catalogueForm, title: e.target.value })}
                  placeholder="Titre du catalogue"
                />
              </div>
              <div>
                <Label htmlFor="catalogue-description">Description</Label>
                <Textarea
                  id="catalogue-description"
                  value={catalogueForm.description}
                  onChange={(e) =>
                    setCatalogueForm({ ...catalogueForm, description: e.target.value })
                  }
                  placeholder="Description du catalogue"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="catalogue-file">Pièce jointe</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="catalogue-file"
                    type="file"
                    onChange={handleCatalogueFileChange}
                    className="hidden"
                  />
                  <Label
                    htmlFor="catalogue-file"
                    className="flex items-center gap-2 cursor-pointer border rounded px-3 py-2 hover:bg-gray-50"
                  >
                    <Upload className="w-4 h-4" />
                    {catalogueForm.piece_jointe
                      ? catalogueForm.piece_jointe.name
                      : "Choisir un fichier"}
                  </Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCatalogueDialogOpen(false);
                    setEditingCatalogue(null);
                    resetCatalogueForm();
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={editingCatalogue ? handleUpdateCatalogue : handleCreateCatalogue}
                  disabled={createLoading || updateLoading}
                >
                  {createLoading || updateLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : null}
                  {editingCatalogue ? "Mettre à jour" : "Créer"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
