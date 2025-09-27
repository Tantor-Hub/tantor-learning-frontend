"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SurveyQuestionData } from "@/types/secretary/session-secretary";
import { Edit, Trash2, ArrowUp, ArrowDown, Type, CheckSquare } from "lucide-react";

interface QuestionItemProps {
  question: SurveyQuestionData;
  index: number;
  totalQuestions: number;
  onEdit: (question: SurveyQuestionData, index: number) => void;
  onDelete: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export function QuestionItem({
  question,
  index,
  totalQuestions,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: QuestionItemProps) {
  const getQuestionTypeIcon = () => {
    return question.type === "text" ? (
      <Type className="w-4 h-4 text-blue-600" />
    ) : (
      <CheckSquare className="w-4 h-4 text-green-600" />
    );
  };

  const getQuestionTypeLabel = () => {
    return question.type === "text" ? "Text Input" : "Multiple Choice";
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const getOptionsSummary = () => {
    if (question.type === "multiple_choice" && question.options) {
      const optionCount = question.options.length;
      const maxSelections = question.maxSelections || 1;
      const selectionType = maxSelections === 1 ? "single" : "multiple";
      return `${optionCount} options (${selectionType} selection)`;
    }
    return null;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex items-center space-x-2">
                {getQuestionTypeIcon()}
                <span className="text-sm font-medium text-gray-600">{getQuestionTypeLabel()}</span>
              </div>

              <Badge variant="outline" className="text-xs">
                #{index + 1}
              </Badge>

              {question.required && (
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              )}
            </div>

            <p className="text-sm text-gray-900 mb-2">{truncateText(question.question)}</p>

            {getOptionsSummary() && <p className="text-xs text-gray-500">{getOptionsSummary()}</p>}
          </div>

          <div className="flex items-center space-x-1 ml-4">
            {/* Reorder buttons */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              title="Move up"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMoveDown(index)}
              disabled={index === totalQuestions - 1}
              title="Move down"
            >
              <ArrowDown className="w-4 h-4" />
            </Button>

            {/* Edit button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(question, index)}
              title="Edit question"
            >
              <Edit className="w-4 h-4" />
            </Button>

            {/* Delete button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(index)}
              title="Delete question"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
