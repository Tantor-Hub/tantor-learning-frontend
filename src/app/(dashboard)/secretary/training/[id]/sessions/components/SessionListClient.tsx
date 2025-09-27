"use client";

import React, { useState } from "react";
import {
  useListSessionByTrainingIdQuery,
  useCreateSessionMutation,
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
import { ArrowLeft, Calendar as CalendarIcon, Clock, Users, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-hot-toast";
import { ISession, ICreateSessionRequest } from "@/types/secretary/training-secretary";

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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon" onClick={(e) => e.stopPropagation()}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer la session</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer la session "{session.title}" ? Cette action est
                  irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(session.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
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
    available_places: 0, // This will be calculated automatically by the backend
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
        available_places: 0, // This will be calculated automatically by the backend
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

  const { data, isLoading, refetch } = useListSessionByTrainingIdQuery({ trainingId });
  const [deleteSession, { isLoading: isDeleting }] = useDeleteSessionMutation();

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
        <div className="mb-8">
          <Button variant="outline" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux formations
          </Button>
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
      </div>
    </div>
  );
}
