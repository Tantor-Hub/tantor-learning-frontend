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
import { AddCourseModal } from "../components/add-course-modal";
import {
  useCourseByIdSessionQuery,
  useDeleteCourseByIdMutation,
  useUpdateCourseByIdMutation,
} from "@/lib/apis/secretary/training-secretary-api";

export default function Courses({ sessionId }: { sessionId: string }) {
  const { data, isLoading, error } = useCourseByIdSessionQuery({ sessionId });
  const [deleteCourse] = useDeleteCourseByIdMutation();
  const [updateCourse] = useUpdateCourseByIdMutation();

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(null);

  const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    title: "",
    description: "",
    is_published: false,
    id_formateur: "",
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse({ id }).unwrap();
      setOpenDeleteDialog(false);
    } catch (err) {
      console.error("Failed to delete course", err);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const formateurs = editForm.id_formateur
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f);
      await updateCourse({
        id,
        title: editForm.title,
        description: editForm.description,
        is_published: editForm.is_published,
        id_formateur: formateurs,
      }).unwrap();
      setOpenUpdateDialog(false);
      setEditForm({ title: "", description: "", is_published: false, id_formateur: "" });
    } catch (err) {
      console.error("Failed to update course", err);
    }
  };

  if (isLoading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div>Error loading courses</div>;
  }

  const courses = data?.data.rows || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Cours de la session</h3>
        <AddCourseModal sessionId={sessionId} />
      </div>
      {courses.length === 0 ? (
        <p>No courses found for this session.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Formateurs</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell>
                  <Badge variant={course.is_published ? "default" : "outline"}>
                    {course.is_published ? "Publié" : "Non publié"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {course.id_formateur && course.id_formateur.length > 0
                    ? course.id_formateur.join(", ")
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditForm({
                          title: course.title,
                          description: course.description,
                          is_published: course.is_published,
                          id_formateur: course.id_formateur ? course.id_formateur.join(", ") : "",
                        });
                        setSelectedCourseId(course.id);
                        setOpenUpdateDialog(true);
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.
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
            <DialogTitle>Modifier le cours</DialogTitle>
            <DialogDescription>Modifiez les informations du cours.</DialogDescription>
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_published"
                checked={editForm.is_published}
                onCheckedChange={(checked) => setEditForm({ ...editForm, is_published: !!checked })}
              />
              <Label htmlFor="is_published">Publié</Label>
            </div>
            <div>
              <Label htmlFor="id_formateur">Formateurs (IDs séparés par virgule)</Label>
              <Input
                id="id_formateur"
                value={editForm.id_formateur}
                onChange={(e) => setEditForm({ ...editForm, id_formateur: e.target.value })}
              />
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
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
