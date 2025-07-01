"use client";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Plus, Loader2 } from "lucide-react";
import { useAddSessionMutation } from "@/lib/apis/secretary/session-secretary-api";
import { useListTrainingTypeQuery } from "@/lib/apis/secretary/training-secretary-api";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SessionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  trainingId: string;
  children: ReactNode;
}

const SessionForm: React.FC<SessionFormProps> = ({ open, onOpenChange, onSuccess, trainingId }) => {
  const [form, setForm] = useState({
    titre: "",
    description: "",
    date_debut: "",
    date_fin: "",
    prix: "900",
    type_formation: "onLine",
  });

  const [addSessionMutation, { isLoading }] = useAddSessionMutation();
  const { data: trainingTypes, isLoading: isTrainingTypesLoading } = useListTrainingTypeQuery();

  const handleSubmit = async () => {
    try {
      const promise = await addSessionMutation({
        id_formation: trainingId,
        descripiton: form.description,
        date_session_debut: form.date_debut,
        date_session_fin: form.date_fin,
        prix: form.prix,
        type_formation: form.type_formation,
      }).unwrap();
      console.log(promise);
      onSuccess();
      toast.success("Session ajoutée avec succès", {
        description: "La nouvelle session a été créée.",
      });
      setForm({
        titre: "",
        description: "",
        date_debut: "",
        date_fin: "",
        prix: "900",
        type_formation: "onLine",
      });
      onOpenChange(false);
    } catch (error) {
      toast.error("Erreur lors de la création", {
        description: "Une erreur est survenue lors de la création de la session.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une session
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle Session</DialogTitle>
          <DialogDescription>Ajoutez une nouvelle session à la formation</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="seance_titre">Titre de la séance</Label>
            <Input
              id="seance_titre"
              value={form.titre}
              onChange={(e) => setForm({ ...form, titre: e.target.value })}
              placeholder="Introduction à NestJS"
            />
          </div>
          <div>
            <Label htmlFor="seance_description">Description</Label>
            <Textarea
              id="seance_description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description de la séance..."
              rows={3}
            />
          </div>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="date_debut">Date de début</Label>
              <Input
                id="date_debut"
                type="date"
                value={form.date_debut}
                onChange={(e) => setForm({ ...form, date_debut: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="date_fin">Date de fin</Label>
              <Input
                id="date_fin"
                type="date"
                value={form.date_fin}
                onChange={(e) => setForm({ ...form, date_fin: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="prix">Prix (€)</Label>
            <Input
              id="prix"
              type="number"
              value={form.prix}
              onChange={(e) => setForm({ ...form, prix: e.target.value })}
              placeholder="900"
            />
          </div>
          <div>
            <Label>Type de formation</Label>
            <Select
              value={form.type_formation}
              onValueChange={(value) => setForm({ ...form, type_formation: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez un type de formation" />
              </SelectTrigger>
              <SelectContent>
                {isTrainingTypesLoading ? (
                  <SelectItem value="loading" disabled>
                    Chargement...
                  </SelectItem>
                ) : (
                  trainingTypes?.data?.map((type) => (
                    <SelectItem key={type.key} value={type.key}>
                      {type.type}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création...
              </>
            ) : (
              "Créer la session"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionForm;
