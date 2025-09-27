"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SurveyQuestionData, QuestionOption } from "@/types/secretary/session-secretary";
import { Plus, Trash2, ArrowUp, ArrowDown, X } from "lucide-react";

const optionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Option text cannot be empty"),
});

const questionFormSchema = z
  .object({
    type: z.enum(["multiple_choice", "text"]),
    question: z.string().min(5, "Question must be at least 5 characters"),
    required: z.boolean(),
    options: z.array(optionSchema).optional(),
    maxSelections: z.number().min(1).optional(),
  })
  .refine(
    (data) => {
      if (data.type === "multiple_choice") {
        return data.options && data.options.length >= 2;
      }
      return true;
    },
    {
      message: "Multiple choice questions need at least 2 options",
      path: ["options"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "multiple_choice" && data.options && data.maxSelections) {
        return data.maxSelections <= data.options.length;
      }
      return true;
    },
    {
      message: "Max selections cannot exceed options count",
      path: ["maxSelections"],
    }
  );

type QuestionFormData = z.infer<typeof questionFormSchema>;

interface QuestionEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialQuestion?: SurveyQuestionData;
  onSave: (question: SurveyQuestionData) => void;
  onCancel: () => void;
  index?: number;
}

export function QuestionEditor({
  open,
  onOpenChange,
  initialQuestion,
  onSave,
  onCancel,
  index,
}: QuestionEditorProps) {
  const [isEditing] = useState(!!initialQuestion);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      type: "text",
      question: "",
      required: true,
      options: [
        { id: uuidv4(), text: "" },
        { id: uuidv4(), text: "" },
      ],
      maxSelections: 1,
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "options",
  });

  const questionType = watch("type");

  useEffect(() => {
    if (initialQuestion) {
      reset({
        type: initialQuestion.type,
        question: initialQuestion.question,
        required: initialQuestion.required,
        options: initialQuestion.options || [
          { id: uuidv4(), text: "" },
          { id: uuidv4(), text: "" },
        ],
        maxSelections: initialQuestion.maxSelections || 1,
      });
    } else {
      reset({
        type: "text",
        question: "",
        required: true,
        options: [
          { id: uuidv4(), text: "" },
          { id: uuidv4(), text: "" },
        ],
        maxSelections: 1,
      });
    }
  }, [initialQuestion, reset]);

  const onSubmit = (data: QuestionFormData) => {
    const question: SurveyQuestionData = {
      id: initialQuestion?.id || uuidv4(),
      type: data.type,
      question: data.question,
      required: data.required,
      order: index !== undefined ? index + 1 : 1,
      ...(data.type === "multiple_choice" && {
        options: data.options,
        maxSelections: data.maxSelections,
      }),
    };

    onSave(question);
    onOpenChange(false);
  };

  const handleCancel = () => {
    reset();
    onCancel();
    onOpenChange(false);
  };

  const addOption = () => {
    append({ id: uuidv4(), text: "" });
  };

  const removeOption = (index: number) => {
    if (fields.length > 2) {
      remove(index);
    }
  };

  const moveOption = (fromIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex >= 0 && toIndex < fields.length) {
      move(fromIndex, toIndex);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Question" : "Add New Question"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Question Type */}
          <div>
            <Label htmlFor="type">Question Type *</Label>
            <Select
              value={questionType}
              onValueChange={(value: "multiple_choice" | "text") => {
                setValue("type", value);
                if (value === "text") {
                  setValue("options", undefined);
                  setValue("maxSelections", undefined);
                } else {
                  setValue("options", [
                    { id: uuidv4(), text: "" },
                    { id: uuidv4(), text: "" },
                  ]);
                  setValue("maxSelections", 1);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Input (Open-ended)</SelectItem>
                <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>}
          </div>

          {/* Question Text */}
          <div>
            <Label htmlFor="question">Question Text *</Label>
            <Textarea
              id="question"
              {...register("question")}
              placeholder="Enter your question..."
              rows={3}
              className="mt-1"
            />
            {errors.question && (
              <p className="text-sm text-red-600 mt-1">{errors.question.message}</p>
            )}
          </div>

          {/* Required Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox id="required" {...register("required")} />
            <Label htmlFor="required">Required question</Label>
          </div>

          {/* Multiple Choice Options */}
          {questionType === "multiple_choice" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Answer Options *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addOption}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <div className="flex flex-col space-y-1 flex-1">
                      <Input
                        {...register(`options.${index}.text` as const)}
                        placeholder={`Option ${index + 1}`}
                      />
                      {errors.options?.[index]?.text && (
                        <p className="text-sm text-red-600">
                          {errors.options[index]?.text?.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveOption(index, "up")}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveOption(index, "down")}
                        disabled={index === fields.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(index)}
                        disabled={fields.length <= 2}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {errors.options && <p className="text-sm text-red-600">{errors.options.message}</p>}

              {/* Max Selections */}
              <div>
                <Label htmlFor="maxSelections">Maximum Selections</Label>
                <Input
                  id="maxSelections"
                  type="number"
                  min="1"
                  max={fields.length}
                  {...register("maxSelections", { valueAsNumber: true })}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  How many options can be selected? (1 = single choice, {fields.length} = multiple
                  choice)
                </p>
                {errors.maxSelections && (
                  <p className="text-sm text-red-600 mt-1">{errors.maxSelections.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              {isEditing ? "Update Question" : "Add Question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
