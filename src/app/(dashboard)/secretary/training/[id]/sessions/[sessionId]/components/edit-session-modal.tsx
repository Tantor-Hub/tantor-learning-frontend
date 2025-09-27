"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useUpdateSessionMutation,
  useGetSessionByIdQuery,
} from "@/lib/apis/secretary/session-secretary-api";

interface EditSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
}

interface SessionFormData {
  id: string;
  id_trainings?: string;
  title?: string;
  nb_places?: number;
  available_places?: number;
  regulation_text?: string;
  begining_date?: string;
  ending_date?: string;
}

export function EditSessionModal({ open, onOpenChange, sessionId }: EditSessionModalProps) {
  const [formData, setFormData] = useState<SessionFormData>({
    id: sessionId,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: sessionData, isLoading: sessionLoading } = useGetSessionByIdQuery({
    id: sessionId,
  });
  const [updateSession] = useUpdateSessionMutation();

  // Initialize form data when session data is loaded
  useEffect(() => {
    if (sessionData?.data) {
      const session = sessionData.data;
      setFormData({
        id: sessionId,
        id_trainings: session.id_trainings,
        title: session.title,
        nb_places: session.nb_places,
        available_places: session.available_places,
        regulation_text: session.regulation_text,
        begining_date: session.begining_date
          ? new Date(session.begining_date).toISOString().split("T")[0]
          : "",
        ending_date: session.ending_date
          ? new Date(session.ending_date).toISOString().split("T")[0]
          : "",
      });
    }
  }, [sessionData, sessionId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!formData.title?.trim()) {
      newErrors.title = "Le titre est requis";
    }

    if (!formData.nb_places || formData.nb_places <= 0) {
      newErrors.nb_places = "Le nombre de places doit être supérieur à 0";
    }

    if (!formData.available_places || formData.available_places < 0) {
      newErrors.available_places = "Le nombre de places disponibles ne peut pas être négatif";
    }

    if (
      formData.available_places &&
      formData.nb_places &&
      formData.available_places > formData.nb_places
    ) {
      newErrors.available_places =
        "Les places disponibles ne peuvent pas dépasser le nombre total de places";
    }

    if (!formData.begining_date) {
      newErrors.begining_date = "La date de début est requise";
    }

    if (!formData.ending_date) {
      newErrors.ending_date = "La date de fin est requise";
    }

    if (formData.begining_date && formData.ending_date) {
      const startDate = new Date(formData.begining_date);
      const endDate = new Date(formData.ending_date);
      if (startDate >= endDate) {
        newErrors.ending_date = "La date de fin doit être postérieure à la date de début";
      }
    }

    if (!formData.regulation_text?.trim()) {
      newErrors.regulation_text = "Le texte de règlement est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof SessionFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs avant de continuer");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateSession(formData).unwrap();
      toast.success("Session mise à jour avec succès");
      onOpenChange(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la session");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  if (sessionLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Chargement des données de la session...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Modifier la session
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations de la session de formation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations de base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Titre de la session *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title || ""}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Ex: Session de formation avancée"
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id_trainings" className="text-sm font-medium">
                    ID Formation
                  </Label>
                  <Input
                    id="id_trainings"
                    value={formData.id_trainings || ""}
                    onChange={(e) => handleInputChange("id_trainings", e.target.value)}
                    placeholder="ID de la formation"
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">Ce champ ne peut pas être modifié</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nb_places" className="text-sm font-medium">
                    Nombre total de places *
                  </Label>
                  <Input
                    id="nb_places"
                    type="number"
                    min="1"
                    value={formData.nb_places || ""}
                    onChange={(e) => handleInputChange("nb_places", parseInt(e.target.value) || 0)}
                    placeholder="Ex: 20"
                    className={errors.nb_places ? "border-red-500" : ""}
                  />
                  {errors.nb_places && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.nb_places}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="available_places" className="text-sm font-medium">
                    Places disponibles *
                  </Label>
                  <Input
                    id="available_places"
                    type="number"
                    min="0"
                    value={formData.available_places || ""}
                    onChange={(e) =>
                      handleInputChange("available_places", parseInt(e.target.value) || 0)
                    }
                    placeholder="Ex: 15"
                    className={errors.available_places ? "border-red-500" : ""}
                  />
                  {errors.available_places && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.available_places}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dates de la session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="begining_date" className="text-sm font-medium">
                    Date de début *
                  </Label>
                  <Input
                    id="begining_date"
                    type="date"
                    value={formData.begining_date || ""}
                    onChange={(e) => handleInputChange("begining_date", e.target.value)}
                    className={errors.begining_date ? "border-red-500" : ""}
                  />
                  {errors.begining_date && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.begining_date}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ending_date" className="text-sm font-medium">
                    Date de fin *
                  </Label>
                  <Input
                    id="ending_date"
                    type="date"
                    value={formData.ending_date || ""}
                    onChange={(e) => handleInputChange("ending_date", e.target.value)}
                    className={errors.ending_date ? "border-red-500" : ""}
                  />
                  {errors.ending_date && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.ending_date}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Regulation Text */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Règlement de la session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="regulation_text" className="text-sm font-medium">
                  Texte de règlement *
                </Label>
                <Textarea
                  id="regulation_text"
                  value={formData.regulation_text || ""}
                  onChange={(e) => handleInputChange("regulation_text", e.target.value)}
                  placeholder="Entrez le règlement de la session..."
                  className={`min-h-[200px] ${errors.regulation_text ? "border-red-500" : ""}`}
                />
                {errors.regulation_text && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.regulation_text}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Ce texte sera affiché aux participants de la session
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Error Summary */}
          {hasErrors && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Veuillez corriger les erreurs suivantes avant de continuer :
                <ul className="mt-2 list-disc list-inside">
                  {Object.values(errors).map((error, index) => (
                    <li key={index} className="text-sm">
                      {error}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            {hasErrors && (
              <span className="text-red-500">
                {Object.keys(errors).length} erreur(s) à corriger
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || hasErrors}
              className="flex items-center gap-2"
              title={
                hasErrors
                  ? "Veuillez corriger les erreurs avant de continuer"
                  : "Mettre à jour la session"
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Mettre à jour
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
