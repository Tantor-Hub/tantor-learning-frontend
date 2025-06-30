import React, { useState } from "react";
import {
  useAddCategoryTrainingMutation,
  useListCategoryTrainingQuery,
  useUpdateCategoryTrainingMutation,
  useRemoveCategoryTrainingByIdMutation,
} from "@/lib/apis/secretary/training-secretary-api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Loading } from "@/components/shared/loading";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CategoryData {
  id: number;
  category: string;
  description: string;
}

interface CreateCategoryData {
  category: string;
  description: string;
}

interface UpdateCategoryData {
  category?: string;
  description?: string;
  id_thematique?: string;
}

export function CategoryFormation() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState<CreateCategoryData>({
    category: "",
    description: "",
  });

  const [editForm, setEditForm] = useState<UpdateCategoryData>({
    category: "",
    description: "",
  });

  // API hooks
  const { data: categoriesData, isLoading, refetch } = useListCategoryTrainingQuery();
  const [addCategory, { isLoading: isAdding }] = useAddCategoryTrainingMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryTrainingMutation();
  const [removeCategory, { isLoading: isDeleting }] = useRemoveCategoryTrainingByIdMutation();

  const categories = categoriesData?.data?.list || [];

  // Handle create category
  const handleCreateCategory = async () => {
    if (!createForm.category.trim() || !createForm.description.trim()) {
      toast.error("Erreur", {
        description: "Veuillez remplir tous les champs",
      });
      return;
    }

    try {
      await addCategory(createForm).unwrap();
      toast.success("Succès", {
        description: "Catégorie créée avec succès",
      });
      setCreateForm({ category: "", description: "" });
      setCreateDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error("Erreur", {
        description: "Erreur lors de la création de la catégorie",
      });
    }
  };

  // Handle edit category
  const handleEditCategory = (category: CategoryData) => {
    setSelectedCategory(category);
    setEditForm({
      category: category.category,
      description: category.description,
      id_thematique: String(category.id),
    });
    setEditDialogOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;

    try {
      await updateCategory({
        ...editForm,
        id_thematique: selectedCategory.id.toString(),
      }).unwrap();
      toast.success("Succès", {
        description: "Catégorie mise à jour avec succès",
      });
      setEditDialogOpen(false);
      setSelectedCategory(null);
      refetch();
    } catch (error) {
      toast.error("Erreur", {
        description: "Erreur lors de la mise à jour de la catégorie",
      });
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (id: string) => {
    try {
      await removeCategory({ id_category: id }).unwrap();
      toast.success("Succès", {
        description: "Catégorie supprimée avec succès",
      });
      refetch();
    } catch (error) {
      toast.error("Erreur", {
        description: "Erreur lors de la suppression de la catégorie",
      });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Catégorie de Formation</h1>

        {/* Create Category Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une catégorie
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
              <DialogDescription>
                Ajoutez une nouvelle catégorie de formation ici.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  value={createForm.category}
                  onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                  placeholder="Nom de la catégorie"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Description de la catégorie"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" onClick={handleCreateCategory} disabled={isAdding}>
                {isAdding && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Table */}

      <div className="w-full overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="border">
              <TableRow>
                <TableHead className="w-[25%] min-w-[120px]">Catégorie</TableHead>
                <TableHead className="w-[55%] min-w-[200px]">Description</TableHead>
                <TableHead className="w-[20%] min-w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border">
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    Aucune catégorie trouvée
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category: CategoryData) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium align-top">
                      <div className="break-words">{category.category}</div>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="break-words whitespace-normal leading-relaxed">
                        {category.description}
                      </div>
                    </TableCell>
                    <TableCell className="text-right align-top">
                      <div className="flex items-start justify-end gap-2">
                        {/* Edit Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                          className="shrink-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {/* Delete Button */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="shrink-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action ne peut pas être annulée. Cela supprimera
                                définitivement la catégorie "{category.category}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCategory(category.id.toString())}
                                disabled={isDeleting}
                              >
                                {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
            <DialogDescription>Modifiez les informations de la catégorie ici.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Catégorie</Label>
              <Input
                id="edit-category"
                value={editForm.category || ""}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                placeholder="Nom de la catégorie"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description || ""}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Description de la catégorie"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setSelectedCategory(null);
              }}
            >
              Annuler
            </Button>
            <Button type="submit" onClick={handleUpdateCategory} disabled={isUpdating}>
              {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
