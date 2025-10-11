"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown, MoreHorizontal, Edit, Trash2, Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";
import { useListUserByRoleQuery } from "@/lib/apis/users-api";
import { Skeleton } from "@/components/ui/skeleton";
import { AddCourseModal } from "../components/add-course-modal";
import { EmptyState } from "@/components/shared/empty-state";
import {
  useCourseByIdSessionQuery,
  useDeleteCourseByIdMutation,
  useUpdateCourseByIdMutation,
} from "@/lib/apis/secretary/training-secretary-api";
import { UserRole } from "@/types/user";
import { toast } from "react-hot-toast";

export default function Courses({ sessionId }: { sessionId: string }) {
  const { data, isLoading, error, refetch } = useCourseByIdSessionQuery({ sessionId });
  const [deleteCourse] = useDeleteCourseByIdMutation();
  const [updateCourse, { isLoading: isLoadingUpdateCourse }] = useUpdateCourseByIdMutation();

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(null);

  const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    title: "",
    description: "",
    ponderation: 1,
    is_published: false,
  });
  const [selectedFormateurs, setSelectedFormateurs] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);

  const { data: usersData, isLoading: isLoadingUsers } = useListUserByRoleQuery({
    role: UserRole.INSTRUCTOR,
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse({ id }).unwrap();
      setOpenDeleteDialog(false);
      refetch();
    } catch (err) {
      console.error("Failed to delete course", err);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateCourse({
        id,
        title: editForm.title,
        description: editForm.description,
        ponderation: editForm.ponderation,
        is_published: editForm.is_published,
        id_formateur: selectedFormateurs,
      }).unwrap();
      toast.success("Matière modifier avec succès!");
      setOpenUpdateDialog(false);
      setEditForm({ title: "", description: "", ponderation: 1, is_published: false });
      setSelectedFormateurs([]);
      refetch();
    } catch (err) {
      toast.error("Échec de la modification du Matière.");
      console.error("Failed to update course", err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Matière de la session</h3>
          <Skeleton className="h-10 w-32" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Pondération</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Formateurs</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return <div>Error loading courses</div>;
  }
  const courses = data?.data.rows || [];
  const users = usersData?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Matière de la session</h3>
        <AddCourseModal sessionId={sessionId} />
      </div>
      {courses.length === 0 ? (
        <EmptyState
          icon="DocumentIcon"
          title="Aucune matière trouvée"
          description="Il n'y a pas encore des matières pour cette session. Commencez par en ajouter un."
        />
      ) : (
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Pondération</TableHead>
                <TableHead>Publiée</TableHead>
                <TableHead>Formateur</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.description}</TableCell>
                  <TableCell>{course.ponderation || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={course.is_published ? "default" : "outline"}>
                      {course.is_published ? "Publié" : "Non publié"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {course.formateurs && course.formateurs.length > 0
                      ? course.formateurs.map((f) => `${f.lastName} ${f.firstName}`).join(", ")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Ellipsis className="hover:cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditForm({
                              title: course.title,
                              description: course.description,
                              ponderation: course.ponderation || 1,
                              is_published: course.is_published,
                            });
                            setSelectedFormateurs(course.id_formateur || []);
                            setSelectedCourseId(course.id);
                            setOpenUpdateDialog(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedCourseId(course.id);
                            setOpenDeleteDialog(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce Matière ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedCourseId && handleDelete(selectedCourseId)}
              className="bg-destructive"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Dialog */}
      <Dialog open={openUpdateDialog} onOpenChange={setOpenUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le Matière</DialogTitle>
            <DialogDescription>Modifiez les informations du Matière.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="ponderation">Pondération</Label>
              <Input
                id="ponderation"
                type="number"
                value={editForm.ponderation}
                onChange={(e) => setEditForm({ ...editForm, ponderation: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_published"
                checked={editForm.is_published}
                onCheckedChange={(checked) => setEditForm({ ...editForm, is_published: !!checked })}
              />
              <Label htmlFor="is_published">Publié</Label>
            </div>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="formateurs">Formateurs</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedFormateurs.length > 0
                      ? `${selectedFormateurs.length} formateur(s) sélectionné(s)`
                      : "Sélectionner des formateurs..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Rechercher des formateurs..." />
                    <CommandEmpty>Aucun formateur trouvé.</CommandEmpty>
                    <CommandGroup className="max-h-48 overflow-y-auto">
                      {isLoadingUsers
                        ? Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2">
                              <Skeleton className="h-4 w-4" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          ))
                        : users?.map((user) => {
                            const isSelected = selectedFormateurs.includes(user.id.toString());
                            return (
                              <CommandItem
                                key={user.id}
                                value={user.id.toString()}
                                onSelect={() => {
                                  if (isSelected) {
                                    setSelectedFormateurs((prev) =>
                                      prev.filter((id) => id !== user.id.toString())
                                    );
                                  } else {
                                    setSelectedFormateurs((prev) => [...prev, user.id.toString()]);
                                  }
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    isSelected ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {user.firstName} {user.lastName}
                              </CommandItem>
                            );
                          })}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpenUpdateDialog(false)}>
              Annuler
            </Button>
            <Button
              type="button"
              onClick={() => selectedCourseId && handleUpdate(selectedCourseId)}
            >
              {isLoadingUpdateCourse ? "Enregistrement..." : "Modifier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
