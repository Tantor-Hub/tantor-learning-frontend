"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Plus, X, Loader2, ChevronsUpDown } from "lucide-react";
import { useGetLessonsByCourseIdQuery } from "@/lib/apis/instructor/instructor";
import { useCreateStudentEvaluationMutation } from "@/lib/apis/student-evaluations";
import { StudentevaluationType } from "@/types/student-evaluations";
import { toast } from "react-hot-toast";
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

interface AddLessonModalProps {
  courseId: string;
}

interface Lesson {
  id: string;
  title: string;
}

export function AddLessonModal({ courseId }: AddLessonModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<StudentevaluationType>(StudentevaluationType.QUIZ);
  const [points, setPoints] = useState(100);
  const [submittiondate, setSubmittiondate] = useState("");
  const [beginningTime, setBeginningTime] = useState("");
  const [endingTime, setEndingTime] = useState("");
  const [ispublish, setIspublish] = useState(false);
  const [isImmediateResult, setIsImmediateResult] = useState(false);

  const {
    data: lessonsData,
    isLoading: isLoadingLessons,
    error: lessonsError,
  } = useGetLessonsByCourseIdQuery({ courseId }, { skip: !isOpen || !courseId });

  const [createEvaluation, { isLoading: isCreating }] = useCreateStudentEvaluationMutation();

  const showTimeFields = [
    StudentevaluationType.TEST,
    StudentevaluationType.QUIZ,
    StudentevaluationType.EXAMEN,
  ].includes(type);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Handle lessons loading error
  useEffect(() => {
    if (lessonsError) {
      console.error("Error loading lessons:", lessonsError);
      toast.error("Erreur lors du chargement des leçons");
    }
  }, [lessonsError]);

  // Format date to ISO string with proper time handling
  const formatDateToISO = (dateString: string): string => {
    if (!dateString) return "";

    try {
      // datetime-local input returns format: "YYYY-MM-DDTHH:MM"
      const date = new Date(dateString);

      // Validate date
      if (isNaN(date.getTime())) {
        throw new Error("Date invalide");
      }

      return date.toISOString();
    } catch (error) {
      console.error("Date formatting error:", error);
      return "";
    }
  };

  // Validate time format (HH:MM)
  const isValidTime = (time: string): boolean => {
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
  };

  // Validate form data
  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!title.trim()) errors.push("Le titre est requis");
    if (!description.trim()) errors.push("La description est requise");
    if (selectedLessons.length === 0) errors.push("Au moins une leçon doit être sélectionnée");
    if (!submittiondate) errors.push("La date de soumission est requise");
    if (points < 0) errors.push("Les points doivent être positifs");

    if (showTimeFields) {
      if (!beginningTime) errors.push("L'heure de début est requise");
      if (!endingTime) errors.push("L'heure de fin est requise");
      if (beginningTime && endingTime && beginningTime >= endingTime) {
        errors.push("L'heure de fin doit être après l'heure de début");
      }
      if (beginningTime && !isValidTime(beginningTime)) {
        errors.push("Format d'heure de début invalide");
      }
      if (endingTime && !isValidTime(endingTime)) {
        errors.push("Format d'heure de fin invalide");
      }
    }

    // Validate submission date is in the future
    if (submittiondate) {
      const submissionDate = new Date(submittiondate);
      if (submissionDate <= new Date()) {
        errors.push("La date de soumission doit être dans le futur");
      }
    }

    return errors;
  };

  const handleToggleLesson = (lessonId: string) => {
    setSelectedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const handleRemoveLesson = (lessonId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    handleToggleLesson(lessonId);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType(StudentevaluationType.QUIZ);
    setPoints(100);
    setSubmittiondate("");
    setBeginningTime("");
    setEndingTime("");
    setIspublish(false);
    setIsImmediateResult(false);
    setSelectedLessons([]);
  };

  const handleCreate = async () => {
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    const toastId = toast.loading("Création de l'évaluation en cours...");

    try {
      // Prepare the data according to the expected API format
      const evaluationData = {
        title: title.trim(),
        description: description.trim(),
        type,
        points: Number(points),
        sessionCoursId: courseId,
        lessonId: selectedLessons,
        submittiondate: formatDateToISO(submittiondate),
        ...(showTimeFields && {
          beginningTime,
          endingTime,
        }),
        ispublish,
        isImmediateResult,
      };

      await createEvaluation(evaluationData).unwrap();

      toast.success("Évaluation créée avec succès", { id: toastId });
      setIsOpen(false);
    } catch (error: any) {
      // console.error("Creation error:", error);

      const errorMessage =
        error?.data?.message || error?.data?.error || "Erreur lors de la création de l'évaluation";

      toast.error(errorMessage, { id: toastId });
    }
  };

  // Get lesson title by ID
  const getLessonTitle = (lessonId: string): string => {
    const lesson = lessonsData?.data?.rows?.find((lesson: Lesson) => lesson.id === lessonId);
    return lesson?.title || "Leçon inconnue";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle évaluation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une évaluation</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'évaluation *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Entrez le titre de l'évaluation"
              className="w-full"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              placeholder="Décrivez l'évaluation, les objectifs, les consignes..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Type and Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type d'évaluation *</Label>
              <Select value={type} onValueChange={(value: StudentevaluationType) => setType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={StudentevaluationType.EXERCISE}>Exercice</SelectItem>
                  <SelectItem value={StudentevaluationType.HOMEWORK}>Devoir</SelectItem>
                  <SelectItem value={StudentevaluationType.TEST}>Test</SelectItem>
                  <SelectItem value={StudentevaluationType.QUIZ}>Quiz</SelectItem>
                  <SelectItem value={StudentevaluationType.EXAMEN}>Examen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Points *</Label>
              <Input
                id="points"
                type="number"
                min="0"
                max="1000"
                step="1"
                value={points}
                onChange={(e) => setPoints(Math.max(0, Number(e.target.value)))}
                placeholder="100"
              />
            </div>
          </div>

          {/* Submission Date */}
          <div className="space-y-2">
            <Label htmlFor="submittiondate">Date et heure de soumission *</Label>
            <Input
              id="submittiondate"
              type="datetime-local"
              value={submittiondate}
              onChange={(e) => setSubmittiondate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)} // Prevent past dates
            />
            <p className="text-sm text-gray-500">
              Date et heure limite pour soumettre l'évaluation
            </p>
          </div>

          {/* Time Fields (Conditional) */}
          {showTimeFields && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium text-sm">Plage horaire pour l'évaluation</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="beginningTime">Heure de début *</Label>
                  <Input
                    id="beginningTime"
                    type="time"
                    value={beginningTime}
                    onChange={(e) => setBeginningTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endingTime">Heure de fin *</Label>
                  <Input
                    id="endingTime"
                    type="time"
                    value={endingTime}
                    onChange={(e) => setEndingTime(e.target.value)}
                    min={beginningTime} // Ensure end time is after start time
                  />
                </div>
              </div>
            </div>
          )}

          {/* Lessons Selection */}
          <div className="space-y-3">
            <Label>Leçons associées *</Label>

            {/* Selected Lessons Badges */}
            {selectedLessons.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">Leçons sélectionnées ({selectedLessons.length})</Label>
                <ScrollArea className="h-24 w-full rounded-md border p-3">
                  <div className="flex flex-wrap gap-2">
                    {selectedLessons.map((lessonId) => (
                      <Badge
                        key={lessonId}
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-1"
                      >
                        {getLessonTitle(lessonId)}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-red-600 ml-1"
                          onClick={(e) => handleRemoveLesson(lessonId, e)}
                        />
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Lessons Popover */}
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isPopoverOpen}
                  className="w-full justify-between"
                  disabled={isLoadingLessons}
                >
                  {isLoadingLessons ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Chargement des leçons...
                    </>
                  ) : (
                    <>
                      {selectedLessons.length > 0
                        ? `${selectedLessons.length} leçon(s) sélectionnée(s)`
                        : "Sélectionner des leçons..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Rechercher une leçon..." />
                  <CommandList>
                    <CommandEmpty>
                      {lessonsError ? "Erreur de chargement" : "Aucune leçon trouvée"}
                    </CommandEmpty>
                    <CommandGroup>
                      {isLoadingLessons
                        ? Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton key={index} className="h-10 w-full mb-2" />
                          ))
                        : lessonsData?.data?.rows?.map((lesson: Lesson) => (
                            <CommandItem
                              key={lesson.id}
                              onSelect={() => handleToggleLesson(lesson.id)}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center w-full">
                                <div className="mr-2 flex h-4 w-4 items-center justify-center">
                                  {selectedLessons.includes(lesson.id) && (
                                    <Check className="h-4 w-4 text-green-600" />
                                  )}
                                </div>
                                <span className="flex-1 truncate">{lesson.title}</span>
                              </div>
                            </CommandItem>
                          ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="ispublish"
                checked={ispublish}
                onCheckedChange={(checked) => setIspublish(checked === true)}
              />
              <div className="space-y-1">
                <Label htmlFor="ispublish" className="cursor-pointer">
                  Publier immédiatement
                </Label>
                <p className="text-sm text-gray-500">Rendre l'évaluation visible aux étudiants</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="isImmediateResult"
                checked={isImmediateResult}
                onCheckedChange={(checked) => setIsImmediateResult(checked === true)}
              />
              <div className="space-y-1">
                <Label htmlFor="isImmediateResult" className="cursor-pointer">
                  Résultat immédiat
                </Label>
                <p className="text-sm text-gray-500">Afficher les résultats automatiquement</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={isCreating} type="button">
              Annuler
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700"
              type="button"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer l'évaluation"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
