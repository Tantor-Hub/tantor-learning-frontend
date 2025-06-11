import React, { ReactNode } from "react";
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
import { ITraining } from "@/types/secretary/training-secretary";

interface SessionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  training: ITraining;
  onSuccess: (session: any) => void;
  children: ReactNode;
}

const SessionForm: React.FC<SessionFormProps> = ({ open, onOpenChange, training, onSuccess }) => {
  const [form, setForm] = React.useState({
    titre: "",
    description: "",
    date: "",
    heure_debut: "",
    heure_fin: "",
    duree: "",
  });

  const handleSubmit = () => {
    const newSession = {
      id: Date.now(),
      titre: form.titre,
      description: form.description,
      date: form.date,
      heure_debut: form.heure_debut,
      heure_fin: form.heure_fin,
      duree: parseInt(form.duree),
    };
    onSuccess(newSession);
    setForm({
      titre: "",
      description: "",
      date: "",
      heure_debut: "",
      heure_fin: "",
      duree: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle Séance</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle séance à la formation "{training.titre}"
          </DialogDescription>
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
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="seance_date">Date</Label>
              <Input
                id="seance_date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="heure_debut">Heure début</Label>
              <Input
                id="heure_debut"
                type="time"
                value={form.heure_debut}
                onChange={(e) => setForm({ ...form, heure_debut: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="heure_fin">Heure fin</Label>
              <Input
                id="heure_fin"
                type="time"
                value={form.heure_fin}
                onChange={(e) => setForm({ ...form, heure_fin: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="duree">Durée (minutes)</Label>
            <Input
              id="duree"
              type="number"
              value={form.duree}
              onChange={(e) => setForm({ ...form, duree: e.target.value })}
              placeholder="180"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>Créer la Séance</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionForm;
