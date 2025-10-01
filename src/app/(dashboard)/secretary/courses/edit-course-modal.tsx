import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import { useUpdateCourseMutation } from "@/lib/apis/common/courses-api";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface ICourse {
  id: number;
  title: string;
  description: string;
  is_published: boolean;
  id_formateurs: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  }>;
}

export function EditCourseModal({ course }: { course: ICourse }) {
  const [updateCourse, { isLoading: isLoadingUpdateCourse }] = useUpdateCourseMutation();
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateCourse({
        id_cours: course.id,
        title: formData.title,
        description: formData.description,
        id_formateurs: course.id_formateurs.map((instructor) => instructor.id),
      });
      toast.success("Cours mis à jour avec succès");
    } catch {
      toast.error("Une erreur est survenue lors de la mise à jour");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modifier le cours</DialogTitle>
            <DialogDescription>Modifiez les informations du cours.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Titre du cours</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Entrez le titre du cours"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Entrez la description du cours"
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoadingUpdateCourse}>
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoadingUpdateCourse}>
              {isLoadingUpdateCourse ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                "Mettre à jour"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
