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
import { toast } from "sonner";

interface SessionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // training: {
  //   id_formation: number;
  //   titre: string;
  // };
  onSuccess: () => void;
  trainingId: string;
  children: ReactNode;
}

const SessionForm: React.FC<SessionFormProps> = ({
  open,
  onOpenChange,
  // training,
  onSuccess,
  trainingId,
}) => {
  const [form, setForm] = useState({
    titre: "",
    description: "",
    date: "",
    heure_debut: "",
    heure_fin: "",
    duree: "",
    prix: "900",
    type_formation: "onLine",
  });

  const [addSessionMutation, { isLoading }] = useAddSessionMutation();

  const handleSubmit = async () => {
    try {
      // Combine date and time to create ISO strings
      const dateDebut = new Date(`${form.date}T${form.heure_debut}`);
      const dateFin = new Date(`${form.date}T${form.heure_fin}`);
      // Format dates to ISO strings without timezone offset
      const formattedDateDebut = dateDebut.toISOString();
      const formattedDateFin = dateFin.toISOString();

      const promise = await addSessionMutation({
        id_formation: trainingId,
        descripiton: form.description,
        date_session_debut: formattedDateDebut as string,
        date_session_fin: formattedDateFin as string,
        prix: parseInt(form.prix).toString(),
        type_formation: form.type_formation,
      }).unwrap();
      // console.log(promise);
      onSuccess();
      toast.success("Session ajoutée avec succès", {
        description: "La nouvelle session a été créée.",
      });
      setForm({
        titre: "",
        description: "",
        date: "",
        heure_debut: "",
        heure_fin: "",
        duree: "",
        prix: "900",
        type_formation: "onLine",
      });
      onOpenChange(false);
    } catch (error) {
      toast.error("Erreur lors de la création", {
        description: "Une erreur est survenue lors de la création de la session.",
      });
      // console.log(error);
      // console.log(error);
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
          <DialogTitle>Nouvelle Séance</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle séance à la formation "{"training.titre"}"
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
                required
              />
            </div>
            <div>
              <Label htmlFor="heure_debut">Heure début</Label>
              <Input
                id="heure_debut"
                type="time"
                value={form.heure_debut}
                onChange={(e) => setForm({ ...form, heure_debut: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="heure_fin">Heure fin</Label>
              <Input
                id="heure_fin"
                type="time"
                value={form.heure_fin}
                onChange={(e) => setForm({ ...form, heure_fin: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
              "Créer la Séance"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionForm;
