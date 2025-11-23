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
import { useCreateBookMutation } from "@/lib/apis/book";
import { useLazyGetBookCategoriesQuery } from "@/lib/apis/bookcategory";
import { useLazyGetAllTrainingSessionsSimplifiedQuery } from "@/lib/apis/training-sessions";
import { BookCategory } from "@/types/bookcategory";
import { SimplifiedTrainingSession } from "@/types/training-sessions";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

export function CreateBookModal() {
  // Dialog state
  const [isOpen, setIsOpen] = useState(false);

  // Mutation and queries
  const [createBook, { isLoading: isCreating }] = useCreateBookMutation();
  const [getBookCategories, { data: categoriesData, isLoading: categoriesLoading }] =
    useLazyGetBookCategoriesQuery();
  const [getSessions, { data: sessionsData, isLoading: sessionsLoading }] =
    useLazyGetAllTrainingSessionsSimplifiedQuery();

  const categories: BookCategory[] = categoriesData?.data || [];
  const sessions: SimplifiedTrainingSession[] = sessionsData?.data || [];

  // Form state
  const [bookForm, setBookForm] = useState({
    title: "",
    description: "",
    author: "",
    category: [] as string[],
    session: [] as string[],
    status: "free" as "free" | "premium",
    public: true,
    downloadable: false,
  });

  // File upload state
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [pieceJointFile, setPieceJointFile] = useState<File | null>(null);
  const [fileErrors, setFileErrors] = useState<{ icon?: string; piece_joint?: string }>({});

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setFileErrors({});
      setBookForm({
        title: "",
        description: "",
        author: "",
        category: [],
        session: [],
        status: "free",
        public: true,
        downloadable: false,
      });
      setIconFile(null);
      setPieceJointFile(null);
    }
  }, [isOpen]);

  const validateFileStep = () => {
    const errors: { icon?: string; piece_joint?: string } = {};

    if (!iconFile) {
      errors.icon = "L'icône est requise. Veuillez sélectionner une image.";
    }

    if (!pieceJointFile) {
      errors.piece_joint = "La pièce jointe est requise. Veuillez sélectionner un PDF.";
    }

    setFileErrors(errors);

    return Object.keys(errors).length === 0;
  };

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

    // Validate icon and piece_joint files are provided
    const filesAreValid = validateFileStep();
    if (!filesAreValid) {
      setCurrentStep(totalSteps);
      return;
    }

    const loadingToastId = toast.loading("Création du livre...");

    try {
      // Create FormData with all book data and files
      const bookFormData = new FormData();
      bookFormData.append("title", bookForm.title.trim());
      bookFormData.append("description", bookForm.description || "");
      bookFormData.append("session", JSON.stringify(bookForm.session || []));
      bookFormData.append("author", bookForm.author || "");
      bookFormData.append("category", JSON.stringify(bookForm.category));
      bookFormData.append("public", bookForm.public.toString());
      bookFormData.append("downloadable", bookForm.downloadable.toString());

      // Append the files directly - backend will handle Cloudinary upload
      bookFormData.append("icon", iconFile!);
      bookFormData.append("piece_joint", pieceJointFile!);

      await createBook(bookFormData).unwrap();
      toast.success("Livre créé avec succès !", { id: loadingToastId });

      setIsOpen(false);
    } catch (error: any) {
      console.error("Error creating book:", error);
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
          setFileErrors((prev) => ({ ...prev, icon: "" }));
        }}
        required
        disabled={isCreating}
      />
      {iconFile && (
        <p className="text-sm text-muted-foreground mt-1">Sélectionné : {iconFile.name}</p>
      )}
      {!iconFile && fileErrors.icon && (
        <p className="text-sm text-destructive mt-1">{fileErrors.icon}</p>
      )}
    </div>
  );

  const renderPieceJointField = () => (
    <div>
      <Label htmlFor="piece_joint">
        Pièce jointe <span className="text-red-500">*</span>
      </Label>
      <Input
        id="piece_joint"
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setPieceJointFile(file);
          setFileErrors((prev) => ({ ...prev, piece_joint: "" }));
        }}
        required
        disabled={isCreating}
      />
      {pieceJointFile && (
        <p className="text-sm text-muted-foreground mt-1">Sélectionné : {pieceJointFile.name}</p>
      )}
      {!pieceJointFile && fileErrors.piece_joint && (
        <p className="text-sm text-destructive mt-1">{fileErrors.piece_joint}</p>
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

  return (
    <>
      {/* Trigger Button */}
      <Button onClick={() => setIsOpen(true)}>
        <Plus /> Ajouter un livre
      </Button>

      {/* Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="w-[96vw] max-w-5xl sm:max-w-6xl max-h-[90vh] overflow-y-auto"
          onInteractOutside={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Ajouter un livre</DialogTitle>
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
                    value={bookForm.title}
                    onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={bookForm.description}
                    onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="author">Auteur</Label>
                  <Input
                    id="author"
                    value={bookForm.author}
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
                            : [
                                <CommandItem
                                  key="select-all"
                                  onSelect={() => {
                                    const allSelected = bookForm.session.length === sessions.length;
                                    setBookForm({
                                      ...bookForm,
                                      session: allSelected ? [] : sessions.map((s) => s.sessionId),
                                    });
                                  }}
                                >
                                  <Checkbox
                                    checked={bookForm.session.length === sessions.length}
                                    onCheckedChange={(checked) => {
                                      setBookForm({
                                        ...bookForm,
                                        session: checked ? sessions.map((s) => s.sessionId) : [],
                                      });
                                    }}
                                    className="mr-2"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  Tout sélectionner
                                </CommandItem>,
                                ...sessions.map((session) => {
                                  const selectedSessions = bookForm.session || [];
                                  const isSelected = selectedSessions.includes(session.sessionId);
                                  return (
                                    <CommandItem
                                      key={session.sessionId}
                                      onSelect={() => {
                                        const newSelected = isSelected
                                          ? selectedSessions.filter(
                                              (id) => id !== session.sessionId
                                            )
                                          : [...selectedSessions, session.sessionId];
                                        setBookForm({ ...bookForm, session: newSelected });
                                      }}
                                    >
                                      <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={(checked) => {
                                          const newSelected = checked
                                            ? [...selectedSessions, session.sessionId]
                                            : selectedSessions.filter(
                                                (id) => id !== session.sessionId
                                              );
                                          setBookForm({ ...bookForm, session: newSelected });
                                        }}
                                        className="mr-2"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                      {session.sessionTitle} - {session.trainingTitle}
                                    </CommandItem>
                                  );
                                }),
                              ]}
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
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={(checked) => {
                                        const newSelected = checked
                                          ? [...selectedCategories, category.id]
                                          : selectedCategories.filter((id) => id !== category.id);
                                        setBookForm({ ...bookForm, category: newSelected });
                                      }}
                                      className="mr-2"
                                      onClick={(e) => e.stopPropagation()}
                                    />
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
                    disabled={isCreating}
                  >
                    Retour
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isCreating}
                >
                  Annuler
                </Button>
                <Button
                  onClick={
                    currentStep < totalSteps
                      ? () => setCurrentStep((prev) => Math.min(totalSteps, prev + 1))
                      : handleSubmit
                  }
                  disabled={isCreating}
                >
                  {isCreating ? "Création..." : currentStep < totalSteps ? "Suivant" : "Créer"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
