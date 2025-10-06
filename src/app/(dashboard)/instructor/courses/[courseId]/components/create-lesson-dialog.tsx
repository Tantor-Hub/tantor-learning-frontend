"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CreateLessonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; ispublish?: boolean }) => void;
  isLoading: boolean;
}

export function CreateLessonDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CreateLessonDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ispublish: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.description.trim()) {
      onSubmit(formData);
      setFormData({ title: "", description: "", ispublish: false });
    }
  };

  const handleClose = () => {
    setFormData({ title: "", description: "", ispublish: false });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle leçon</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de la leçon</Label>
            <Input
              id="title"
              placeholder="Ex: Introduction à la programmation"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez le contenu de cette leçon..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2 flex items-center gap-2">
            <input
              id="ispublish"
              type="checkbox"
              checked={formData.ispublish}
              onChange={(e) => setFormData((prev) => ({ ...prev, ispublish: e.target.checked }))}
              className="w-4 h-4"
            />
            <Label htmlFor="ispublish" className="mb-0">
              Publier la leçon
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.title.trim() || !formData.description.trim()}
            >
              {isLoading ? "Création..." : "Créer la leçon"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
