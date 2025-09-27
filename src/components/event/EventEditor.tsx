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
import { Event, CreateEventRequest, UpdateEventRequest } from "@/types/event";

const eventFormSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    begining_date: z
      .date({
        required_error: "Start date is required",
      })
      .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
        message: "Please select a valid start date",
      }),
    ending_date: z
      .date({
        required_error: "End date is required",
      })
      .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
        message: "Please select a valid end date",
      }),
  })
  .refine(
    (data) => {
      if (!data.begining_date || !data.ending_date) return true;
      return data.ending_date >= data.begining_date;
    },
    {
      message: "End date must be after start date",
      path: ["ending_date"],
    }
  );

type EventFormData = z.infer<typeof eventFormSchema>;

interface EventEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEvent?: Event;
  sessionId: string;
  onSave: (data: CreateEventRequest | UpdateEventRequest) => void;
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
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      title: "",
      description: "",
      begining_date: undefined,
      ending_date: undefined,
    },
  });

  const beginingDate = watch("begining_date");
  const endingDate = watch("ending_date");

  useEffect(() => {
    if (initialEvent) {
      reset({
        title: initialEvent.title,
        description: initialEvent.description,
        begining_date: new Date(initialEvent.begining_date),
        ending_date: initialEvent.ending_date ? new Date(initialEvent.ending_date) : undefined,
      });
    } else {
      reset({
        title: "",
        description: "",
        begining_date: undefined,
        ending_date: undefined,
      });
    }
  }, [initialEvent, reset]);

  const onSubmit = (data: EventFormData) => {
    const eventData = {
      ...data,
      begining_date: data.begining_date.toISOString(),
      ending_date: data.ending_date.toISOString(),
      ...(isEditing ? { id: initialEvent!.id } : { id_cible_session: [sessionId] }),
    };

    onSave(eventData as CreateEventRequest | UpdateEventRequest);
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
          <DialogTitle>{isEditing ? "Edit Event" : "Create New Event"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter event title"
              className="mt-1"
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter event description"
              rows={4}
              className="mt-1"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal mt-1 ${
                      !beginingDate && "text-muted-foreground"
                    }`}
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {beginingDate ? (
                      format(beginingDate, "PPP", { locale: fr })
                    ) : (
                      <span>Select start date</span>
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
                  />
                </PopoverContent>
              </Popover>
              {errors.begining_date && (
                <p className="text-sm text-red-600 mt-1">{errors.begining_date.message}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal mt-1 ${
                      !endingDate && "text-muted-foreground"
                    }`}
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endingDate ? (
                      format(endingDate, "PPP", { locale: fr })
                    ) : (
                      <span>Select end date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endingDate}
                    onSelect={(date) => {
                      setValue("ending_date", date!, { shouldValidate: true });
                    }}
                    initialFocus
                    disabled={(date) => {
                      const today = new Date(new Date().setHours(0, 0, 0, 0));
                      if (date < today) return true;
                      if (beginingDate && date < beginingDate) return true;
                      return false;
                    }}
                  />
                </PopoverContent>
              </Popover>
              {errors.ending_date && (
                <p className="text-sm text-red-600 mt-1">{errors.ending_date.message}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isLoading}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Event"
              ) : (
                "Create Event"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
