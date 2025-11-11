"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  CreateEventForLessonsRequest,
} from "@/types/events";
import { useGetCoursesBySessionQuery } from "@/lib/apis/events";
import { useLazyGetLessonBySessionCourseIdSecretaryAccessQuery } from "@/lib/apis/lessons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";

const eventFormSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  begining_date: z
    .date({
      required_error: "La date de début est requise",
    })
    .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
      message: "Veuillez sélectionner une date de début valide",
    }),
  beginning_hour: z.string().min(1, "L'heure de début est requise"),
  ending_hour: z.string().min(1, "L'heure de fin est requise"),
});

type EventFormData = z.infer<typeof eventFormSchema>;

interface EventEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEvent?: Event;
  sessionId: string;
  onSave: (
    data:
      | CreateEventRequest
      | UpdateEventRequest
      | (CreateEventRequest & { courseId: string })
      | CreateEventForLessonsRequest
  ) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EventEditor({
  open,
  onOpenChange,
  initialEvent,
  sessionId,
  onSave,
  onCancel,
  isLoading = false,
}: EventEditorProps) {
  const [isEditing] = useState(!!initialEvent);
  const [courseSelectOpen, setCourseSelectOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(undefined);
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [triggerGetLessons, { data: lessonsData, isLoading: lessonsLoading }] =
    useLazyGetLessonBySessionCourseIdSecretaryAccessQuery();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      begining_date: undefined,
      beginning_hour: "10:30:00",
      ending_hour: "10:30:00",
    },
  });

  const beginingDate = watch("begining_date");

  const {
    data: coursesData,
    isLoading: coursesLoading,
    refetch: refetchCourses,
  } = useGetCoursesBySessionQuery(
    { sessionId },
    {
      skip: !isEditing && !courseSelectOpen,
    }
  );

  useEffect(() => {
    if (initialEvent) {
      reset({
        title: initialEvent.title,
        description: initialEvent.description,
        begining_date: new Date(initialEvent.begining_date),
        beginning_hour: initialEvent.beginning_hour,
        ending_hour: initialEvent.ending_hour,
      });
      if (initialEvent.sessionCours) {
        setSelectedCourseId(initialEvent.sessionCours.id);
      }
    } else {
      reset({
        title: "",
        description: "",
        begining_date: undefined,
        beginning_hour: "",
        ending_hour: "",
      });
      setSelectedCourseId(undefined);
      setSelectedLessonIds([]);
    }
  }, [initialEvent, reset]);

  useEffect(() => {
    if (selectedCourseId) {
      triggerGetLessons(selectedCourseId);
    } else {
      setSelectedLessonIds([]);
    }
  }, [selectedCourseId, triggerGetLessons]);

  const onSubmit = (data: EventFormData) => {
    if (!selectedCourseId) {
      alert("Veuillez sélectionner une matière");
      return;
    }
    if (selectedLessonIds.length === 0) {
      alert("Veuillez sélectionner au moins une leçon");
      return;
    }
    const eventData = {
      title: data.title,
      description: data.description,
      begining_date: data.begining_date.toISOString(),
      beginning_hour: data.beginning_hour,
      ending_hour: data.ending_hour,
      ...(isEditing ? { id: initialEvent!.id } : {}),
    };

    if (!isEditing) {
      onSave({
        title: data.title,
        description: data.description,
        id_cible_lesson: selectedLessonIds,
        begining_date: data.begining_date.toISOString(),
        beginning_hour: data.beginning_hour,
        ending_hour: data.ending_hour,
      } as CreateEventForLessonsRequest);
    } else {
      onSave({ ...eventData, courseId: selectedCourseId! } as UpdateEventRequest);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier l'événement" : "Créer un nouvel événement"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">
              Titre de l'événement <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Entrez le titre de l'événement"
              className="mt-1"
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Entrez la description de l'événement"
              rows={4}
              className="mt-1"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Associated Course (for editing) */}
          {isEditing && initialEvent?.sessionCours && (
            <div>
              <Label>Matière associée</Label>
              <p className="mt-1 text-sm text-gray-700">{initialEvent.sessionCours.title}</p>
            </div>
          )}

          {/* Course Select */}
          <div>
            <Label htmlFor="course">
              Sélectionner une matière <span className="text-destructive">*</span>
            </Label>
            <Select
              onOpenChange={setCourseSelectOpen}
              onValueChange={(value) => setSelectedCourseId(value)}
              value={selectedCourseId}
              disabled={coursesLoading}
            >
              <SelectTrigger id="course" className="w-full mt-1">
                <SelectValue placeholder="Sélectionner une matière" />
              </SelectTrigger>
              <SelectContent>
                {coursesLoading ? (
                  <div className="p-4">
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ) : coursesData && coursesData.data.rows.length > 0 ? (
                  coursesData.data.rows.map((course: any) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">Aucune matière disponible</div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Lessons Select */}
          {selectedCourseId && (
            <div>
              <Label>
                Sélectionner les leçons <span className="text-destructive">*</span>
              </Label>
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                {lessonsLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ) : lessonsData && lessonsData.data.rows.length > 0 ? (
                  lessonsData.data.rows.map((lesson: any) => (
                    <div key={lesson.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lesson-${lesson.id}`}
                        checked={selectedLessonIds.includes(lesson.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedLessonIds((prev) => [...prev, lesson.id]);
                          } else {
                            setSelectedLessonIds((prev) => prev.filter((id) => id !== lesson.id));
                          }
                        }}
                      />
                      <Label htmlFor={`lesson-${lesson.id}`} className="text-sm font-normal">
                        {lesson.title}
                      </Label>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    Aucune leçon disponible pour cette matière
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Date */}
          <div>
            <Label>
              Date de l'événement <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal mt-1 ${
                    !beginingDate ? "text-muted-foreground" : ""
                  }`}
                  type="button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {beginingDate ? (
                    format(beginingDate, "PPP", { locale: fr })
                  ) : (
                    <span>Sélectionner la date de début</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={beginingDate}
                  onSelect={(date) => {
                    setValue("begining_date", date!, { shouldValidate: true });
                  }}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
            {errors.begining_date && (
              <p className="text-sm text-red-600 mt-1">{errors.begining_date.message}</p>
            )}
          </div>

          {/* Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="beginning_hour">
                Heure de début <span className="text-destructive">*</span>
              </Label>
              <Input
                type="time"
                id="beginning_hour"
                step="60"
                {...register("beginning_hour")}
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none mt-1"
                lang="fr-FR"
              />
              {errors.beginning_hour && (
                <p className="text-sm text-red-600 mt-1">{errors.beginning_hour.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="ending_hour">
                Heure de fin <span className="text-destructive">*</span>
              </Label>
              <Input
                type="time"
                id="ending_hour"
                step="60"
                {...register("ending_hour")}
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none mt-1"
                lang="fr-FR"
              />
              {errors.ending_hour && (
                <p className="text-sm text-red-600 mt-1">{errors.ending_hour.message}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={
                !isValid || isLoading || !selectedCourseId || selectedLessonIds.length === 0
              }
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isEditing ? "Mise à jour..." : "Création..."}
                </>
              ) : isEditing ? (
                "Enregistrer les modifications"
              ) : (
                "Créer un événement"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
