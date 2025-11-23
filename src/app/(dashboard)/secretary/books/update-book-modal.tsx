"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useUpdateBookMutation, useLazyGetBookByIdForSecretaryQuery } from "@/lib/apis/book";
import { useLazyGetBookCategoriesQuery } from "@/lib/apis/bookcategory";
import { useLazyGetAllTrainingSessionsSimplifiedQuery } from "@/lib/apis/training-sessions";
import { Book, UpdateBookRequest } from "@/types/book";
import { BookCategory } from "@/types/bookcategory";
import { SimplifiedTrainingSession } from "@/types/training-sessions";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface UpdateBookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
  onSuccess?: () => void;
}

export function UpdateBookModal({ open, onOpenChange, bookId, onSuccess }: UpdateBookModalProps) {
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const [getBookById, { data: bookData, isLoading: isFetchingBook }] =
    useLazyGetBookByIdForSecretaryQuery();

  // Categories lazy query
  const [getBookCategories, { data: categoriesData, isLoading: categoriesLoading }] =
    useLazyGetBookCategoriesQuery();
  const categories: BookCategory[] = categoriesData?.data || [];

  // Sessions lazy query
  const [getSessions, { data: sessionsData, isLoading: sessionsLoading }] =
    useLazyGetAllTrainingSessionsSimplifiedQuery();
  const sessions: SimplifiedTrainingSession[] = sessionsData?.data || [];

  // Form state
  const [bookForm, setBookForm] = useState<Partial<UpdateBookRequest>>({});

  // Store original book data for comparison
  const [originalBookData, setOriginalBookData] = useState<Book | null>(null);

  // File upload state
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [pieceJointFile, setPieceJointFile] = useState<File | null>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  // Fetch book data when modal opens
  useEffect(() => {
    if (open && bookId) {
      getBookById({ id: bookId });
    }
  }, [open, bookId, getBookById]);

  // Reset form when modal opens/closes or bookData changes
  useEffect(() => {
    if (open && bookData) {
      setCurrentStep(1);
      setOriginalBookData(bookData);
      setBookForm({
        title: bookData.title,
        description: bookData.description,
        session: bookData.session,
        author: bookData.author,
        category: bookData.category,
        public: bookData.public ?? true,
        downloadable: bookData.downloadable,
        icon: bookData.icon,
        piece_joint: bookData.piece_joint,
      });
      // Load sessions to display session names in badges
      if (sessions.length === 0 && !sessionsLoading) {
        getSessions();
      }
      setIconFile(null);
      setPieceJointFile(null);
    } else if (!open) {
      setBookForm({});
      setOriginalBookData(null);
      setIconFile(null);
      setPieceJointFile(null);
      setCurrentStep(1);
    }
  }, [open, bookData, sessions.length, sessionsLoading, getSessions]);

  const handleSubmit = async () => {
    // Validate required fields
    if (!bookForm.title?.trim()) {
      toast.error("Le titre est requis.");
      return;
    }

    if (!bookForm.category?.length) {
      toast.error("Au moins une catégorie est requise.");
      return;
    }

    const loadingToastId = toast.loading("Mise à jour du livre...");

    try {
      // Create FormData with all current form fields
      const bookFormData = new FormData();

      // Always append all non-file fields
      bookFormData.append("title", bookForm.title!.trim());
      bookFormData.append("description", bookForm.description || "");
      bookFormData.append("session", JSON.stringify(bookForm.session || []));
      bookFormData.append("author", bookForm.author || "");
      bookFormData.append("category", JSON.stringify(bookForm.category!));
      bookFormData.append("public", (bookForm.public ?? true).toString());
      bookFormData.append("downloadable", (bookForm.downloadable ?? false).toString());

      // For update, only append files if new ones are selected
      // Backend will keep existing files if no new files are provided
      if (iconFile) {
        bookFormData.append("icon", iconFile);
      }

      if (pieceJointFile) {
        bookFormData.append("piece_joint", pieceJointFile);
      }

      await updateBook({
        id: bookId,
        body: bookFormData,
      }).unwrap();

      toast.success("Livre mis à jour avec succès !", { id: loadingToastId });

      onOpenChange(false);
      setBookForm({});
      setOriginalBookData(null);
      setIconFile(null);
      setPieceJointFile(null);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error updating book:", error);
      toast.dismiss(loadingToastId);
      toast.error(error?.data?.message || "Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>
        Étape {currentStep} / {totalSteps}
      </span>
      <div className="flex gap-2">
        {[...Array(totalSteps)].map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          return (
            <span
              key={stepNumber}
              className={`h-2 w-10 rounded-full ${isActive ? "bg-primary" : "bg-muted"}`}
            />
          );
        })}
      </div>
    </div>
  );

  const renderIconField = () => (
    <div>
      <Label htmlFor="icon">Icône (optionnel - laisser vide pour conserver l'actuel)</Label>
      <Input
        id="icon"
        type="file"
        accept=".jpeg,.jpg,.png,.gif,.webp"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          if (file && file.size > 100 * 1024 * 1024) {
            // 100MB
            toast.error("L'icône ne peut pas dépasser 100MB.");
            setIconFile(null);
            e.target.value = "";
            return;
          }
          setIconFile(file);
        }}
        disabled={isUpdating}
      />
      {iconFile && (
        <p className="text-sm text-muted-foreground mt-1">Nouveau fichier : {iconFile.name}</p>
      )}
      {!iconFile && bookForm.icon && (
        <p className="text-sm text-muted-foreground mt-1">Actuel : {bookForm.icon}</p>
      )}
    </div>
  );

  const renderPieceJointField = () => (
    <div>
      <Label htmlFor="piece_joint">
        Pièce jointe (optionnel - laisser vide pour conserver l'actuel)
      </Label>
      <Input
        id="piece_joint"
        type="file"
        accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.jpeg,.jpg,.png,.gif,.webp"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          if (file && file.size > 10 * 1024 * 1024 * 1024) {
            // 10GB
            toast.error("La pièce jointe ne peut pas dépasser 10GB.");
            setPieceJointFile(null);
            e.target.value = "";
            return;
          }
          setPieceJointFile(file);
        }}
        disabled={isUpdating}
      />
      {pieceJointFile && (
        <p className="text-sm text-muted-foreground mt-1">
          Nouveau fichier : {pieceJointFile.name}
        </p>
      )}
      {!pieceJointFile && bookForm.piece_joint && (
        <p className="text-sm text-muted-foreground mt-1">Actuel : {bookForm.piece_joint}</p>
      )}
    </div>
  );

  const renderStepTwoContent = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {renderIconField()}
        {renderPieceJointField()}
      </div>
    </div>
  );

  if (isFetchingBook) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[96vw] max-w-5xl sm:max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le livre</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[96vw] max-w-5xl sm:max-w-6xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <DialogHeader className="flex flex-row items-start justify-between space-y-0">
          <DialogTitle>Modifier le livre</DialogTitle>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="space-y-6">
          {renderStepIndicator()}
          {currentStep === 1 && (
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
                  <PopoverContent
                    align="start"
                    className="p-0"
                    style={{ width: "var(--radix-popover-trigger-width)" }}
                  >
                    <Command>
                      <CommandInput placeholder="Rechercher des sessions..." />
                      <CommandEmpty>
                        {sessionsLoading ? (
                          <div className="space-y-2 p-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-full" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          "Aucune session trouvée."
                        )}
                      </CommandEmpty>
                      <CommandGroup className="max-h-48 overflow-y-auto">
                        {sessionsLoading && sessions.length === 0
                          ? Array.from({ length: 3 }).map((_, i) => (
                              <CommandItem key={i} disabled>
                                <Skeleton className="h-4 w-4 mr-2" />
                                <Skeleton className="h-4 w-full" />
                              </CommandItem>
                            ))
                          : sessions.map((session) => {
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
                          {session
                            ? `${session.sessionTitle} - ${session.trainingTitle}`
                            : sessionId}
                          <button
                            className="ml-1 text-xs"
                            onClick={() => {
                              const newSelected = bookForm.session!.filter(
                                (id) => id !== sessionId
                              );
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
                  <PopoverContent
                    align="start"
                    className="p-0"
                    style={{ width: "var(--radix-popover-trigger-width)" }}
                  >
                    <Command>
                      <CommandInput placeholder="Rechercher des catégories..." />
                      <CommandEmpty>
                        {categoriesLoading ? (
                          <div className="space-y-2 p-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-full" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          "Aucune catégorie trouvée."
                        )}
                      </CommandEmpty>
                      <CommandGroup className="max-h-48 overflow-y-auto">
                        {categoriesLoading && categories.length === 0
                          ? Array.from({ length: 3 }).map((_, i) => (
                              <CommandItem key={i} disabled>
                                <Skeleton className="h-4 w-4 mr-2" />
                                <Skeleton className="h-4 w-full" />
                              </CommandItem>
                            ))
                          : categories.map((category) => {
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
            </div>
          )}

          {currentStep === 2 && renderStepTwoContent()}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                  disabled={isUpdating}
                >
                  Retour
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isUpdating}
              >
                Annuler
              </Button>
              <Button
                onClick={
                  currentStep < totalSteps
                    ? () => setCurrentStep((prev) => Math.min(totalSteps, prev + 1))
                    : handleSubmit
                }
                disabled={isUpdating}
              >
                {isUpdating
                  ? "Mise à jour..."
                  : currentStep < totalSteps
                    ? "Suivant"
                    : "Mettre à jour"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
