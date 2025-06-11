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
import { ICategory } from "@/types/secretary/training-secretary";

interface TrainingFormProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const categories: ICategory[] = [
  { id: 1, category: "Développement Mobile" },
  { id: 2, category: "Développement Web" },
  { id: 3, category: "Intelligence Artificielle" },
  { id: 4, category: "Cybersécurité" },
];

const trainingTypes = [
  {
    key: "onLine",
    type: "En ligne",
    description: "Formation en ligne avec supports et vidéos disponibles",
  },
  {
    key: "visioConference",
    type: "Vision Conférence",
    description: "Formation en vision conférence en direct",
  },
  {
    key: "presentiel",
    type: "En présentiel",
    description: "Formation organisée dans un centre physique",
  },
  {
    key: "hybride",
    type: "Hybride",
    description: "Combinaison de sessions en ligne et en présentiel",
  },
];

const TrainingForm: React.FC<TrainingFormProps> = ({ children, open, onOpenChange, onSuccess }) => {
  const [addTrainingMutation] = useAddTrainingMutation();
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

  const handleSubmit = async () => {
    try {
      const promise = await addTrainingMutation({
        titre: form.titre,
        sous_titre: form.sous_titre,
        type_formation: form.type_formation as
          | "onLine"
          | "visioConference"
          | "presentiel"
          | "hybride",
        prix: form.prix,
        id_category: String(1),
        description: form.description,
        prerequis: form.prerequis,
        rnc: form.rnc,
        objectif: form.objectif,
        alternance: form.alternance,
      }).unwrap();
      console.log(promise);
      onSuccess();
    } catch (error) {
      console.log(error);
      // console.error("Error adding training:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvelle Formation</DialogTitle>
          <DialogDescription>
            Créez une nouvelle formation en remplissant les informations ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="titre">Titre</Label>
              <Input
                id="titre"
                value={form.titre}
                onChange={(e) => setForm({ ...form, titre: e.target.value })}
                placeholder="Diplôme de Comptabilité"
              />
            </div>
            <div>
              <Label htmlFor="prix">Prix (€)</Label>
              <Input
                id="prix"
                type="number"
                value={form.prix}
                onChange={(e) => setForm({ ...form, prix: e.target.value })}
                placeholder="9000"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="sous_titre">Sous-titre</Label>
            <Input
              id="sous_titre"
              value={form.sous_titre}
              onChange={(e) => setForm({ ...form, sous_titre: e.target.value })}
              placeholder="Comptabilité et Finance • Bac+3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type_formation">Type de Formation</Label>
              <Select
                value={form.type_formation}
                onValueChange={(value) => setForm({ ...form, type_formation: value })}
              >
                <SelectTrigger>
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
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={form.id_category}
                onValueChange={(value) => setForm({ ...form, id_category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rnc">RNC</Label>
              <Input
                id="rnc"
                value={form.rnc}
                onChange={(e) => setForm({ ...form, rnc: e.target.value })}
                placeholder="Référence RNC de la formation"
              />
            </div>
            <div>
              <Label htmlFor="alternance">Alternance</Label>
              <Input
                id="alternance"
                value={form.alternance}
                onChange={(e) => setForm({ ...form, alternance: e.target.value })}
                placeholder="Durée d'alternance (ex: 3ans)"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="objectif">Objectifs</Label>
            <Textarea
              id="objectif"
              value={form.objectif}
              onChange={(e) => setForm({ ...form, objectif: e.target.value })}
              placeholder="Objectifs pédagogiques de la formation..."
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description détaillée de la formation..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="prerequis">Prérequis</Label>
            <Textarea
              id="prerequis"
              value={form.prerequis}
              onChange={(e) => setForm({ ...form, prerequis: e.target.value })}
              placeholder="Prérequis nécessaires pour suivre cette formation..."
              rows={2}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Créer la Formation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingForm;
