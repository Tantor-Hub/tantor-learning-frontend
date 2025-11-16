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
    await deleteCategory(id);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Book Categories</h2>
        <Button
          onClick={() => {
            setEditingCategory(null);
            setCategoryForm({});
            setCategoryDialogOpen(true);
          }}
        >
          Add Category
        </Button>
      </div>
      {categoriesLoading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.title}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="categoryTitle">Title</Label>
              <Input
                id="categoryTitle"
                value={categoryForm.title || ""}
                onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCategory}>
                {editingCategory ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
