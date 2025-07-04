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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRoundPlus } from "lucide-react";
import { useListUserByGroupQuery } from "@/lib/apis/admin/user-api";
import { useGetAllTrainingsQuery } from "@/lib/apis/public/public-api";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export interface ISessionData {
  id_session: number;
  duree: number;
  ponderation: number;
  id_preset_cours: number;
  id_formateur?: number;
}

export function AddCourseSession({ courseId }: { courseId: number }) {
  const { data: instructors, isLoading: isLoadingInstructors } = useListUserByGroupQuery({
    group: "teacher",
  });

  const { data: sessionsData, isLoading: isLoadingSessions } = useGetAllTrainingsQuery();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoadingInstructors || isLoadingSessions) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    // Get all form values
    const formValues = {
      id_session: formData.get("id_session") as string,
      duree: formData.get("duree") as string,
      ponderation: formData.get("ponderation") as string,
      id_formateur: formData.get("id_formateur") as string,
      id_preset_cours: courseId,
    };

    // Prepare the data to log
    const submissionData = {
      id_session: Number(formValues.id_session),
      duree: Number(formValues.duree),
      ponderation: Number(formValues.ponderation),
      id_formateur: formValues.id_formateur ? Number(formValues.id_formateur) : undefined,
      id_preset_cours: Number(formValues.id_preset_cours),
    };

    console.log("Form submitted with data:", submissionData);

    // Simulate API call delay (remove this in production)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);

    // Here you would typically send the data to your API
    // For example:
    // try {
    //   const response = await api.post('/endpoint', submissionData);
    //   console.log("API response:", response.data);
    // } catch (error) {
    //   console.error("API error:", error);
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2 justify-center">
          <UserRoundPlus />
          <Badge variant="secondary" className="hover:cursor-pointer">
            Assigner
          </Badge>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Configuration de séance</DialogTitle>
            <DialogDescription>
              Configurez les paramètres de la séance pour ce cours.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="id_session">Séance</Label>
              <Select name="id_session" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une séance" />
                </SelectTrigger>
                <SelectContent>
                  {sessionsData?.data.list.map((session) => (
                    <SelectItem key={session.id} value={String(session.id)}>
                      <div className="flex flex-col">
                        <span className="font-medium">{session.Formation.titre}</span>
                        <span className="text-sm text-muted-foreground">{session.designation}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-3">
                <Label htmlFor="duree">Durée (minutes)</Label>
                <Input
                  id="duree"
                  name="duree"
                  type="number"
                  min="1"
                  required
                  placeholder="60"
                  defaultValue={60}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="ponderation">Pondération</Label>
                <Input
                  id="ponderation"
                  name="ponderation"
                  type="number"
                  step="0.1"
                  min="0"
                  required
                  placeholder="10"
                  defaultValue={10}
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="id_formateur">Formateur (optionnel)</Label>
              <Select name="id_formateur">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un formateur" />
                </SelectTrigger>
                <SelectContent>
                  {instructors?.data.list.map((instructor) => (
                    <SelectItem key={instructor.id} value={String(instructor.id)}>
                      {instructor.nick_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
