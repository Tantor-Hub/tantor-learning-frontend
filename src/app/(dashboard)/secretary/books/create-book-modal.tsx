"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useCreateBookMutation, useUpdateBookMutation } from "@/lib/apis/book";
import { useLazyGetBookCategoriesQuery } from "@/lib/apis/bookcategory";
import { useUploadImageMutation, useUploadDocumentMutation } from "@/lib/apis/upload-api";
import { Book, CreateBookRequest, UpdateBookRequest } from "@/types/book";
import { BookCategory } from "@/types/bookcategory";
import toast from "react-hot-toast";

interface CreateBookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingBook?: Book | null;
  onSuccess?: () => void;
}

export function CreateBookModal({
  open,
  onOpenChange,
  editingBook,
  onSuccess,
}: CreateBookModalProps) {
  const [createBook] = useCreateBookMutation();
  const [updateBook] = useUpdateBookMutation();
  const [uploadImage] = useUploadImageMutation();
  const [uploadDocument] = useUploadDocumentMutation();

  // Categories lazy query
  const [getBookCategories, { data: categoriesData, isLoading: categoriesLoading }] =
    useLazyGetBookCategoriesQuery();
  const categories: BookCategory[] = categoriesData?.data || [];

  // Form state
  const [bookForm, setBookForm] = useState<Partial<CreateBookRequest & UpdateBookRequest>>({});

  // File upload state
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [pieceJointFile, setPieceJointFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<"form" | "uploading" | "complete">("form");

  // Reset form when modal opens/closes or editingBook changes
  useEffect(() => {
    if (open) {
      if (editingBook) {
        setBookForm({
          title: editingBook.title,
          description: editingBook.description,
          session: editingBook.session,
          author: editingBook.author,
          status: editingBook.status,
          category: editingBook.category,
          public: true, // Default or from book if available
          icon: editingBook.icon,
          piece_joint: editingBook.piece_joint,
        });
      } else {
        setBookForm({
          category: [],
          status: "free", // Default status
          public: true,
          downloadable: false,
        });
      }
      setIconFile(null);
      setPieceJointFile(null);
      setUploadStep("form");
    } else {
      setBookForm({});
      setIconFile(null);
      setPieceJointFile(null);
      setUploadStep("form");
    }
  }, [open, editingBook]);

  const handleSubmit = async () => {
    // Validate required fields
    if (!bookForm.title?.trim()) {
      toast.error("Title is required.");
      return;
    }

    if (!bookForm.status || (bookForm.status !== "premium" && bookForm.status !== "free")) {
      toast.error("Status is required and must be either 'premium' or 'free'.");
      return;
    }

    if (!bookForm.category?.length) {
      toast.error("At least one category is required.");
      return;
    }

    // Validate icon and piece_joint files are provided when creating
    if (!editingBook) {
      if (!iconFile) {
        toast.error("Icon is required. Please select an image file.");
        return;
      }

      if (!pieceJointFile) {
        toast.error("Piece joint is required. Please select a file.");
        return;
      }
    }

    setIsUploading(true);
    setUploadStep("uploading");
    const uploadToastId = toast.loading("Uploading files...");

    try {
      let iconUrl = bookForm.icon || "";
      let pieceJointUrl = bookForm.piece_joint || "";

      // Step 1: Upload files if creating new book or if files were selected when editing
      if (!editingBook) {
        // Upload icon
        const iconFormData = new FormData();
        iconFormData.append("image", iconFile!);
        const iconResult = await uploadImage(iconFormData).unwrap();
        iconUrl = iconResult.url;

        // Upload piece_joint (document)
        const docFormData = new FormData();
        docFormData.append("image", pieceJointFile!); // Using same endpoint for now
        const docResult = await uploadDocument(docFormData).unwrap();
        pieceJointUrl = docResult.url;
      } else {
        // When editing, only upload if new files were selected
        if (iconFile) {
          const iconFormData = new FormData();
          iconFormData.append("image", iconFile);
          const iconResult = await uploadImage(iconFormData).unwrap();
          iconUrl = iconResult.url;
        } else {
          // Keep existing icon URL if no new file selected
          iconUrl = bookForm.icon || "";
        }

        if (pieceJointFile) {
          const docFormData = new FormData();
          docFormData.append("image", pieceJointFile);
          const docResult = await uploadDocument(docFormData).unwrap();
          pieceJointUrl = docResult.url;
        } else {
          // Keep existing piece_joint URL if no new file selected
          pieceJointUrl = bookForm.piece_joint || "";
        }
      }

      toast.dismiss(uploadToastId);
      toast.loading("Creating book...", { id: uploadToastId });

      // Step 2: Create or update book with FormData including files
      const bookFormData = new FormData();
      bookFormData.append("title", bookForm.title!.trim());
      bookFormData.append("description", bookForm.description || "");
      bookFormData.append("session", JSON.stringify(bookForm.session || []));
      bookFormData.append("author", bookForm.author || "");
      bookFormData.append("status", bookForm.status!);
      bookFormData.append("category", JSON.stringify(bookForm.category!));
      bookFormData.append("public", (bookForm.public ?? true).toString());
      bookFormData.append("downloadable", (bookForm.downloadable ?? false).toString());

      if (editingBook) {
        // For update, append files if new ones selected, otherwise use URLs
        if (iconFile) {
          bookFormData.append("icon", iconFile);
        } else if (bookForm.icon) {
          bookFormData.append("icon", bookForm.icon);
        }

        if (pieceJointFile) {
          bookFormData.append("piece_joint", pieceJointFile);
        } else if (bookForm.piece_joint) {
          bookFormData.append("piece_joint", bookForm.piece_joint);
        }

        await updateBook({
          id: editingBook.id,
          body: bookFormData,
        });
        toast.success("Book updated successfully!", { id: uploadToastId });
      } else {
        // For create, append the uploaded files
        bookFormData.append("icon", iconFile!);
        bookFormData.append("piece_joint", pieceJointFile!);

        await createBook(bookFormData);
        toast.success("Book created successfully!", { id: uploadToastId });
      }

      setUploadStep("complete");
      onOpenChange(false);
      setBookForm({});
      setIconFile(null);
      setPieceJointFile(null);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating/updating book:", error);
      toast.dismiss(uploadToastId);
      toast.error(error?.data?.message || "An error occurred. Please try again.");
      setUploadStep("form");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingBook ? "Edit Book" : "Add Book"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={bookForm.title || ""}
              onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={bookForm.description || ""}
              onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={bookForm.author || ""}
              onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="status">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select
              value={bookForm.status || "free"}
              onValueChange={(value) =>
                setBookForm({ ...bookForm, status: value as "premium" | "free" })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Categories Multi-Select */}
          <div>
            <Label>Categories (Required)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                  onClick={() => {
                    if (categories.length === 0 && !categoriesLoading) {
                      getBookCategories();
                    }
                  }}
                >
                  {bookForm.category && bookForm.category.length > 0
                    ? `${bookForm.category.length} selected`
                    : "Select categories..."}
                  <span className="ml-2">▼</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search categories..." />
                  <CommandEmpty>
                    {categoriesLoading ? "Loading..." : "No categories found."}
                  </CommandEmpty>
                  <CommandGroup className="max-h-48 overflow-y-auto">
                    {categories.map((category) => {
                      const selectedCategories = bookForm.category || [];
                      const isSelected = selectedCategories.includes(category.id);
                      return (
                        <CommandItem
                          key={category.id}
                          onSelect={() => {
                            const newSelected = isSelected
                              ? selectedCategories.filter((id) => id !== category.id)
                              : [...selectedCategories, category.id];
                            setBookForm({ ...bookForm, category: newSelected });
                          }}
                        >
                          <Checkbox checked={isSelected} className="mr-2" />
                          {category.title}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {bookForm.category && bookForm.category.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {bookForm.category.map((catId) => {
                  const category = categories.find((c) => c.id === catId);
                  return (
                    <Badge key={catId} variant="secondary">
                      {category?.title || catId}
                      <button
                        className="ml-1 text-xs"
                        onClick={() => {
                          const newSelected = bookForm.category!.filter((id) => id !== catId);
                          setBookForm({ ...bookForm, category: newSelected });
                        }}
                      >
                        ×
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          {!editingBook && (
            <>
              <div>
                <Label htmlFor="icon">
                  Icon <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="icon"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setIconFile(file);
                  }}
                  required={!editingBook}
                  disabled={isUploading}
                />
                {iconFile && (
                  <p className="text-sm text-muted-foreground mt-1">Selected: {iconFile.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="piece_joint">
                  Piece Joint <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="piece_joint"
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setPieceJointFile(file);
                  }}
                  required={!editingBook}
                  disabled={isUploading}
                />
                {pieceJointFile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected: {pieceJointFile.name}
                  </p>
                )}
              </div>
            </>
          )}
          {editingBook && (
            <>
              <div>
                <Label htmlFor="icon">Icon (Optional - leave empty to keep current)</Label>
                <Input
                  id="icon"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setIconFile(file);
                  }}
                  disabled={isUploading}
                />
                {iconFile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    New file selected: {iconFile.name}
                  </p>
                )}
                {!iconFile && bookForm.icon && (
                  <p className="text-sm text-muted-foreground mt-1">Current: {bookForm.icon}</p>
                )}
              </div>
              <div>
                <Label htmlFor="piece_joint">
                  Piece Joint (Optional - leave empty to keep current)
                </Label>
                <Input
                  id="piece_joint"
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setPieceJointFile(file);
                  }}
                  disabled={isUploading}
                />
                {pieceJointFile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    New file selected: {pieceJointFile.name}
                  </p>
                )}
                {!pieceJointFile && bookForm.piece_joint && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Current: {bookForm.piece_joint}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Public and Downloadable checkboxes */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="public"
                checked={bookForm.public ?? true}
                onCheckedChange={(checked) =>
                  setBookForm({ ...bookForm, public: checked as boolean })
                }
                disabled={isUploading}
              />
              <Label htmlFor="public" className="cursor-pointer">
                Public
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="downloadable"
                checked={bookForm.downloadable ?? false}
                onCheckedChange={(checked) =>
                  setBookForm({ ...bookForm, downloadable: checked as boolean })
                }
                disabled={isUploading}
              />
              <Label htmlFor="downloadable" className="cursor-pointer">
                Downloadable
              </Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isUploading}>
              {isUploading
                ? uploadStep === "uploading"
                  ? "Uploading..."
                  : "Creating..."
                : editingBook
                  ? "Update"
                  : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
