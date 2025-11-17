"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetBookCategoriesQuery,
  useCreateBookCategoryMutation,
  useUpdateBookCategoryMutation,
  useDeleteBookCategoryMutation,
} from "@/lib/apis/bookcategory";
import {
  BookCategory,
  CreateBookCategoryRequest,
  UpdateBookCategoryRequest,
} from "@/types/bookcategory";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function BookCategoriesTab() {
  // Book Categories hooks
  const { data: categoriesResponse, isLoading: categoriesLoading } = useGetBookCategoriesQuery();
  const categories = categoriesResponse?.data || [];
  const [createCategory] = useCreateBookCategoryMutation();
  const [updateCategory] = useUpdateBookCategoryMutation();
  const [deleteCategory] = useDeleteBookCategoryMutation();

  // State for dialog
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BookCategory | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  // Form state
  const [categoryForm, setCategoryForm] = useState<
    Partial<CreateBookCategoryRequest & UpdateBookCategoryRequest>
  >({});

  const handleCreateCategory = async () => {
    if (editingCategory) {
      await updateCategory({
        id: editingCategory.id,
        body: categoryForm as UpdateBookCategoryRequest,
      });
    } else {
      await createCategory(categoryForm as CreateBookCategoryRequest);
    }
    setCategoryDialogOpen(false);
    setEditingCategory(null);
    setCategoryForm({});
  };

  const handleEditCategory = (category: BookCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      title: category.title,
    });
    setCategoryDialogOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    let loadingToastId: string | undefined;
    try {
      setDeletingCategoryId(id);
      loadingToastId = toast.loading("Suppression de la catégorie...");

      await deleteCategory(id).unwrap();

      toast.success("Catégorie supprimée avec succès !", { id: loadingToastId });
      setDeletingCategoryId(null);
    } catch (error: any) {
      console.error("Error deleting category:", error);
      console.error("Error details:", {
        status: error?.status,
        data: error?.data,
        message: error?.message,
        fullError: JSON.stringify(error, null, 2),
      });

      // Extract error message from various possible locations
      let errorMessage = "Erreur lors de la suppression de la catégorie";

      // Handle 409 conflict error with detailed message
      if (error?.status === 409) {
        // Try multiple locations for the error message
        if (typeof error?.data === "string") {
          // If data is a string (like in the API response)
          errorMessage = error.data;
        } else if (error?.data?.data) {
          // If data is nested
          errorMessage = error.data.data;
        } else if (error?.data?.message) {
          // If message is in data object
          errorMessage = error.data.message;
        } else if (error?.message) {
          // Fallback to message field
          errorMessage = error.message;
        } else {
          errorMessage = "Impossible de supprimer cette catégorie car des livres y sont associés.";
        }

        toast.error(errorMessage, {
          id: loadingToastId,
          duration: 6000, // Show longer for important error messages
        });
      } else {
        // Handle other errors
        if (typeof error?.data === "string") {
          errorMessage = error.data;
        } else if (error?.data?.data) {
          errorMessage = error.data.data;
        } else if (error?.data?.message) {
          errorMessage = error.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        toast.error(errorMessage, {
          id: loadingToastId,
        });
      }
      setDeletingCategoryId(null);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Catégories de livres</h2>
        <Button
          onClick={() => {
            setEditingCategory(null);
            setCategoryForm({});
            setCategoryDialogOpen(true);
          }}
        >
          Ajouter une catégorie
        </Button>
      </div>
      {categoriesLoading ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => {
              const isDeletingThis = deletingCategoryId === category.id;
              return (
                <TableRow key={category.id} className={isDeletingThis ? "opacity-50" : ""}>
                  <TableCell>{category.title}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                      className="mr-2"
                      disabled={isDeletingThis}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={isDeletingThis}
                    >
                      {isDeletingThis ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Suppression...
                        </>
                      ) : (
                        "Supprimer"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Modifier la catégorie" : "Ajouter une catégorie"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="categoryTitle">Titre</Label>
              <Input
                id="categoryTitle"
                value={categoryForm.title || ""}
                onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateCategory}>
                {editingCategory ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
