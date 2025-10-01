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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UserCheck } from "lucide-react";
import { useListUserByGroupQuery } from "@/lib/apis/admin/user-api";
import { useUpdateCourseMutation } from "@/lib/apis/common/courses-api";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { UserRole } from "@/types/user";

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

interface IUserWithNames {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
}

export function AssignInstructorsModal({ course }: { course: ICourse }) {
  const { data: instructors, isLoading: isLoadingInstructors } = useListUserByGroupQuery({
    group: UserRole.INSTRUCTOR,
  });
  const [updateCourse, { isLoading: isLoadingUpdateCourse }] = useUpdateCourseMutation();
  const [selectedInstructors, setSelectedInstructors] = useState<number[]>(
    course.id_formateurs.map((instructor) => instructor.id)
  );

  const handleInstructorToggle = (instructorId: number) => {
    setSelectedInstructors((prev) =>
      prev.includes(instructorId)
        ? prev.filter((id) => id !== instructorId)
        : [...prev, instructorId]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateCourse({
        id_cours: course.id,
        title: course.title,
        description: course.description,
        id_formateurs: selectedInstructors,
      });
      toast.success("Formateurs assignés avec succès");
    } catch {
      toast.error("Une erreur est survenue lors de l'assignation");
    }
  };

  if (isLoadingInstructors) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserCheck className="h-4 w-4 mr-2" />
          Assigner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Assigner des formateurs</DialogTitle>
            <DialogDescription>
              Sélectionnez les formateurs à assigner à ce cours.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label>Formateurs disponibles</Label>
              <div className="grid gap-3 max-h-60 overflow-y-auto">
                {instructors?.data.list?.map((instructor: any) => (
                  <div key={instructor.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`instructor-${instructor.id}`}
                      checked={selectedInstructors.includes(instructor.id)}
                      onCheckedChange={() => handleInstructorToggle(instructor.id)}
                    />
                    <Label
                      htmlFor={`instructor-${instructor.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {instructor.firstName} {instructor.lastName}
                    </Label>
                  </div>
                ))}
              </div>
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
                  Assignation...
                </>
              ) : (
                "Assigner"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
