"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateSessionMutation } from "@/lib/apis/secretary/training-secretary-api";
import { toast } from "react-hot-toast";
import { Loader2, CheckCircle, Plus } from "lucide-react";

interface MinimalSessionFormProps {
  trainingId: string;
  onSuccess: () => void;
}

const MinimalSessionForm: React.FC<MinimalSessionFormProps> = ({ trainingId, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [nbPlaces, setNbPlaces] = useState("");
  const [textReglement, setTextReglement] = useState("");
  alert("Minimal open");
  const [createSession, { isLoading }] = useCreateSessionMutation();

  const isValid = () => {
    return (
      description.trim() !== "" &&
      dateStart !== "" &&
      dateEnd !== "" &&
      nbPlaces.trim() !== "" &&
      parseInt(nbPlaces) > 0
    );
  };

  const handleSubmit = async () => {
    if (!isValid()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    try {
      toast.loading("Création de la session...");
      await createSession({
        id_trainings: trainingId,
        title: description,
        nb_places: parseInt(nbPlaces),
        regulation_text: textReglement,
        begining_date: dateStart + "T08:00:00",
        ending_date: dateEnd + "T17:30:00",
        required_document: [],
        payment_method: [],
        survey: [],
      }).unwrap();
      toast.dismiss();
      toast.success("Session créée avec succès");
      setOpen(false);
      setDescription("");
      setDateStart("");
      setDateEnd("");
      setNbPlaces("");
      setTextReglement("");
      onSuccess();
    } catch (error) {
      toast.dismiss();
      console.error("Erreur lors de la création de la session:", error);
      toast.error("Erreur lors de la création de la session");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une session
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle Session de Formation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le contenu et les objectifs de cette session..."
              rows={3}
              className={description.trim() === "" ? "border-red-300" : ""}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateStart">
                Date de début <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dateStart"
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className={dateStart === "" ? "border-red-300" : ""}
              />
            </div>
            <div>
              <Label htmlFor="dateEnd">
                Date de fin <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dateEnd"
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className={dateEnd === "" ? "border-red-300" : ""}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="nbPlaces">
              Nombre de places <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nbPlaces"
              type="number"
              min="1"
              value={nbPlaces}
              onChange={(e) => setNbPlaces(e.target.value)}
              className={nbPlaces.trim() === "" || parseInt(nbPlaces) <= 0 ? "border-red-300" : ""}
              placeholder="Ex: 30"
            />
          </div>
          <div>
            <Label htmlFor="textReglement">Règlement intérieur (optionnel)</Label>
            <Textarea
              id="textReglement"
              value={textReglement}
              onChange={(e) => setTextReglement(e.target.value)}
              placeholder="Ex: Les participants doivent respecter les règles..."
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading || !isValid()}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Créer la session
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MinimalSessionForm;
