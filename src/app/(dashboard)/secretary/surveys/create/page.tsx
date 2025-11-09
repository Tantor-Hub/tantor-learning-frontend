"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus, Save, AlertCircle } from "lucide-react";
import {
  useListSessionQuery,
  useCreateSurveyQuestionMutation,
} from "@/lib/apis/secretary/session-secretary-api";
import { createSurveySchema, CreateSurveyFormData } from "@/lib/validations/survey";
import { SurveyQuestionData } from "@/types/secretary/session-secretary";
import { QuestionEditor } from "@/components/survey/QuestionEditor";
import { QuestionItem } from "@/components/survey/QuestionItem";

export default function CreateSurveyPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<SurveyQuestionData[]>([]);
  const [questionEditorOpen, setQuestionEditorOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<{
    question: SurveyQuestionData;
    index: number;
  } | null>(null);

  const {
    data: sessionsData,
    isLoading: sessionsLoading,
    error: sessionsError,
  } = useListSessionQuery();
  const [createSurvey, { isLoading: creating }] = useCreateSurveyQuestionMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateSurveyFormData>({
    resolver: zodResolver(createSurveySchema),
    defaultValues: {
      title: "",
      id_session: "",
      categories: "before",
      questions: [],
    },
  });

  const selectedSession = watch("id_session");
  const selectedCategory = watch("categories");

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setQuestionEditorOpen(true);
  };

  const handleEditQuestion = (question: SurveyQuestionData, index: number) => {
    setEditingQuestion({ question, index });
    setQuestionEditorOpen(true);
  };

  const handleSaveQuestion = (question: SurveyQuestionData) => {
    if (editingQuestion) {
      // Update existing question
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestion.index] = question;
      setQuestions(updatedQuestions);
    } else {
      // Add new question
      const newQuestion = {
        ...question,
        id: uuidv4(),
        order: questions.length + 1,
      };
      setQuestions([...questions, newQuestion]);
    }
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    // Reorder questions
    const reorderedQuestions = updatedQuestions.map((q, i) => ({
      ...q,
      order: i + 1,
    }));
    setQuestions(reorderedQuestions);
  };

  const handleMoveQuestion = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < questions.length) {
      const updatedQuestions = [...questions];
      [updatedQuestions[index], updatedQuestions[newIndex]] = [
        updatedQuestions[newIndex],
        updatedQuestions[index],
      ];

      // Reorder questions
      const reorderedQuestions = updatedQuestions.map((q, i) => ({
        ...q,
        order: i + 1,
      }));
      setQuestions(reorderedQuestions);
    }
  };

  const onSubmit = async (data: CreateSurveyFormData) => {
    try {
      const surveyData = {
        ...data,
        questions: questions.map((q, index) => ({
          ...q,
          order: index + 1,
        })),
      };

      // Validate required fields before submission
      if (!surveyData.title || surveyData.title.trim().length < 3) {
        toast.error("Survey title must be at least 3 characters long");
        return;
      }

      if (!surveyData.id_session) {
        toast.error("Please select a training session");
        return;
      }

      if (!surveyData.categories) {
        toast.error("Please select a category (before/during/after)");
        return;
      }

      if (!surveyData.questions || surveyData.questions.length === 0) {
        toast.error("Please add at least one question to the survey");
        return;
      }

      // Validate each question
      for (let i = 0; i < surveyData.questions.length; i++) {
        const question = surveyData.questions[i];
        if (!question.question || question.question.trim().length < 5) {
          toast.error(`Question ${i + 1}: Question text must be at least 5 characters long`);
          return;
        }
        if (
          question.type === "multiple_choice" &&
          (!question.options || question.options.length < 2)
        ) {
          toast.error(`Question ${i + 1}: Multiple choice questions need at least 2 options`);
          return;
        }
      }

      const result = await createSurvey(surveyData).unwrap();

      toast.success("Survey created successfully!");
      router.push("/secretary/surveys");
    } catch (error: any) {
      console.error("Error creating survey:", error);

      // Show detailed error information
      if (error?.data?.message) {
        toast.error(`Error: ${error.data.message}`);
      } else if (error?.data?.error) {
        toast.error(`Error: ${error.data.error}`);
      } else if (error?.status === 404) {
        toast.error("API endpoint not found. Please check the server configuration.");
      } else if (error?.status === 400) {
        toast.error("Invalid data provided. Please check all required fields.");
      } else if (error?.status === 401) {
        toast.error("Authentication required. Please log in again.");
      } else if (error?.status === 403) {
        toast.error("Access denied. You do not have permission to create surveys.");
      } else {
        toast.error(`Failed to create survey: ${error?.message || "Unknown error"}`);
      }
    }
  };

  const handleCancel = () => {
    router.push("/secretary/surveys");
  };

  const isFormValid = isValid && questions.length > 0 && selectedSession;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Survey</h1>
          <p className="text-gray-600">
            Create a new survey for training sessions with custom questions
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Survey Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Survey Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">Survey Title *</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Enter survey title"
                  className="mt-1"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Training Session */}
              <div>
                <Label htmlFor="session">Training Session *</Label>
                {sessionsLoading ? (
                  <Skeleton className="h-10 w-full mt-1" />
                ) : sessionsError ? (
                  <div className="flex items-center space-x-2 mt-1 p-3 bg-red-50 border border-red-200 rounded-md">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600">Failed to load sessions</span>
                  </div>
                ) : (
                  <Select
                    value={selectedSession}
                    onValueChange={(value) => setValue("id_session", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a training session" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessionsData?.data?.rows?.map((session) => (
                        <SelectItem key={session.id} value={session.id}>
                          {session.trainingSession?.title || session.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.id_session && (
                  <p className="text-sm text-red-600 mt-1">{errors.id_session.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <Label>Category *</Label>
                <RadioGroup
                  value={selectedCategory}
                  onValueChange={(value) =>
                    setValue("categories", value as "before" | "during" | "after")
                  }
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="before" id="before" />
                    <Label htmlFor="before">Before Training</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="during" id="during" />
                    <Label htmlFor="during">During Training</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="after" id="after" />
                    <Label htmlFor="after">After Training</Label>
                  </div>
                </RadioGroup>
                {errors.categories && (
                  <p className="text-sm text-red-600 mt-1">{errors.categories.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Questions Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Survey Questions</CardTitle>
                <Button
                  type="button"
                  onClick={handleAddQuestion}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Plus className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No questions added yet</h3>
                  <p className="text-gray-500 mb-4">
                    Click "Add Question" to start building your survey
                  </p>
                  <Button type="button" onClick={handleAddQuestion} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Question
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <QuestionItem
                      key={question.id}
                      question={question}
                      index={index}
                      totalQuestions={questions.length}
                      onEdit={handleEditQuestion}
                      onDelete={handleDeleteQuestion}
                      onMoveUp={(idx) => handleMoveQuestion(idx, "up")}
                      onMoveDown={(idx) => handleMoveQuestion(idx, "down")}
                    />
                  ))}
                </div>
              )}

              {questions.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>{questions.length}</strong> question{questions.length !== 1 ? "s" : ""}{" "}
                    added
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Debug Information */}
          {process.env.NODE_ENV === "development" && (
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-sm">Debug Information</CardTitle>
              </CardHeader>
              <CardContent className="text-xs">
                <div className="space-y-2">
                  <p>
                    <strong>Form Valid:</strong> {isValid ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Selected Session:</strong> {selectedSession || "None"}
                  </p>
                  <p>
                    <strong>Selected Category:</strong> {selectedCategory || "None"}
                  </p>
                  <p>
                    <strong>Questions Count:</strong> {questions.length}
                  </p>
                  <p>
                    <strong>Required Fields:</strong>
                  </p>
                  <ul className="ml-4 list-disc">
                    <li>Title (min 3 characters)</li>
                    <li>Training Session (must be selected)</li>
                    <li>Category (before/during/after)</li>
                    <li>At least 1 question</li>
                    <li>Each question: text (min 5 chars), type, required flag</li>
                    <li>Multiple choice: min 2 options</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || creating || sessionsLoading}
              className="flex items-center space-x-2"
            >
              {creating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Create Survey</span>
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Question Editor Modal */}
        <QuestionEditor
          open={questionEditorOpen}
          onOpenChange={setQuestionEditorOpen}
          initialQuestion={editingQuestion?.question}
          onSave={handleSaveQuestion}
          onCancel={() => setEditingQuestion(null)}
          index={editingQuestion?.index}
        />
      </div>
    </div>
  );
}
