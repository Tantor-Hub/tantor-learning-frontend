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
import { useLazyGetAllTrainingSessionsSimplifiedQuery } from "@/lib/apis/training-sessions";
import { Book, CreateBookRequest, UpdateBookRequest } from "@/types/book";
import { BookCategory } from "@/types/bookcategory";
import { SimplifiedTrainingSession } from "@/types/training-sessions";
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
  const [createBook, { isLoading: isCreating }] = useCreateBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();

  // Categories lazy query
  const [getBookCategories, { data: categoriesData, isLoading: categoriesLoading }] =
    useLazyGetBookCategoriesQuery();
  const categories: BookCategory[] = categoriesData?.data || [];

  // Sessions lazy query
  const [getSessions, { data: sessionsData, isLoading: sessionsLoading }] =
    useLazyGetAllTrainingSessionsSimplifiedQuery();
  const sessions: SimplifiedTrainingSession[] = sessionsData?.data || [];

  // Form state
  const [bookForm, setBookForm] = useState<Partial<CreateBookRequest & UpdateBookRequest>>({});

  // File upload state
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [pieceJointFile, setPieceJointFile] = useState<File | null>(null);

  const isUploading = isCreating || isUpdating;

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
        // Load sessions when editing to display session names in badges
        if (sessions.length === 0 && !sessionsLoading) {
          getSessions();
        }
      } else {
        setBookForm({
          category: [],
          session: [],
          status: "free", // Default status
          public: true,
          downloadable: false,
        });
      }
      setIconFile(null);
      setPieceJointFile(null);
    } else {
      setBookForm({});
      setIconFile(null);
      setPieceJointFile(null);
    }
  }, [open, editingBook, sessions.length, sessionsLoading, getSessions]);

  const handleSubmit = async () => {
    // Validate required fields
    if (!bookForm.title?.trim()) {
      toast.error("Le titre est requis.");
      return;
    }

    if (!bookForm.status || (bookForm.status !== "premium" && bookForm.status !== "free")) {
      toast.error("Le statut est requis et doit être soit 'premium' soit 'free'.");
      return;
    }

    if (!bookForm.category?.length) {
      toast.error("Au moins une catégorie est requise.");
      return;
    }

    // Validate icon and piece_joint files are provided when creating
    if (!editingBook) {
      if (!iconFile) {
        toast.error("L'icône est requise. Veuillez sélectionner un fichier image.");
        return;
      }

      if (!pieceJointFile) {
        toast.error("La pièce jointe est requise. Veuillez sélectionner un fichier.");
        return;
      }
    }

    const loadingToastId = toast.loading(
      editingBook ? "Mise à jour du livre..." : "Création du livre..."
    );

    try {
      // Create FormData with all book data and files
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
        // For update, append files if new ones selected, otherwise use existing URLs
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
        toast.success("Livre mis à jour avec succès !", { id: loadingToastId });
      } else {
        // For create, append the files directly - backend will handle Cloudinary upload
        bookFormData.append("icon", iconFile!);
        bookFormData.append("piece_joint", pieceJointFile!);

        await createBook(bookFormData);
        toast.success("Livre créé avec succès !", { id: loadingToastId });
      }

      onOpenChange(false);
      setBookForm({});
      setIconFile(null);
      setPieceJointFile(null);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating/updating book:", error);
      toast.dismiss(loadingToastId);
      toast.error(error?.data?.message || "Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingBook ? "Modifier le livre" : "Ajouter un livre"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">
              Titre <span className="text-red-500">*</span>
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
            <Label htmlFor="author">Auteur</Label>
            <Input
              id="author"
              value={bookForm.author || ""}
              onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="status">
              Statut <span className="text-red-500">*</span>
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
                <SelectItem value="free">Gratuit</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sessions Multi-Select */}
          <div>
            <Label>Sessions</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                  onClick={() => {
                    if (sessions.length === 0 && !sessionsLoading) {
                      getSessions();
                    }
                  }}
                >
                  {bookForm.session && bookForm.session.length > 0
                    ? `${bookForm.session.length} sélectionné${bookForm.session.length > 1 ? "s" : ""}`
                    : "Sélectionner des sessions..."}
                  <span className="ml-2">▼</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Rechercher des sessions..." />
                  <CommandEmpty>
                    {sessionsLoading ? "Chargement..." : "Aucune session trouvée."}
                  </CommandEmpty>
                  <CommandGroup className="max-h-48 overflow-y-auto">
                    {sessions.map((session) => {
                      const selectedSessions = bookForm.session || [];
                      const isSelected = selectedSessions.includes(session.sessionId);
                      return (
                        <CommandItem
                          key={session.sessionId}
                          onSelect={() => {
                            const newSelected = isSelected
                              ? selectedSessions.filter((id) => id !== session.sessionId)
                              : [...selectedSessions, session.sessionId];
                            setBookForm({ ...bookForm, session: newSelected });
                          }}
                        >
                          <Checkbox checked={isSelected} className="mr-2" />
                          {session.sessionTitle} - {session.trainingTitle}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {bookForm.session && bookForm.session.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {bookForm.session.map((sessionId) => {
                  const session = sessions.find((s) => s.sessionId === sessionId);
                  return (
                    <Badge key={sessionId} variant="secondary">
                      {session ? `${session.sessionTitle} - ${session.trainingTitle}` : sessionId}
                      <button
                        className="ml-1 text-xs"
                        onClick={() => {
                          const newSelected = bookForm.session!.filter((id) => id !== sessionId);
                          setBookForm({ ...bookForm, session: newSelected });
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

          {/* Categories Multi-Select */}
          <div>
            <Label>Catégories (Requis)</Label>
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
                    ? `${bookForm.category.length} sélectionnée${bookForm.category.length > 1 ? "s" : ""}`
                    : "Sélectionner des catégories..."}
                  <span className="ml-2">▼</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Rechercher des catégories..." />
                  <CommandEmpty>
                    {categoriesLoading ? "Chargement..." : "Aucune catégorie trouvée."}
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
                  Icône <span className="text-red-500">*</span>
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
                  <p className="text-sm text-muted-foreground mt-1">
                    Sélectionné : {iconFile.name}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="piece_joint">
                  Pièce jointe <span className="text-red-500">*</span>
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
                    Sélectionné : {pieceJointFile.name}
                  </p>
                )}
              </div>
            </>
          )}
          {editingBook && (
            <>
              <div>
                <Label htmlFor="icon">
                  Icône (Optionnel - laisser vide pour conserver l'actuel)
                </Label>
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
                    Nouveau fichier sélectionné : {iconFile.name}
                  </p>
                )}
                {!iconFile && bookForm.icon && (
                  <p className="text-sm text-muted-foreground mt-1">Actuel : {bookForm.icon}</p>
                )}
              </div>
              <div>
                <Label htmlFor="piece_joint">
                  Pièce jointe (Optionnel - laisser vide pour conserver l'actuel)
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
                    Nouveau fichier sélectionné : {pieceJointFile.name}
                  </p>
                )}
                {!pieceJointFile && bookForm.piece_joint && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Actuel : {bookForm.piece_joint}
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
                Téléchargeable
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
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={isUploading}>
              {isUploading
                ? editingBook
                  ? "Mise à jour..."
                  : "Création..."
                : editingBook
                  ? "Mettre à jour"
                  : "Créer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
