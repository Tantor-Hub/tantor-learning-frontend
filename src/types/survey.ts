export interface QuestionOption {
  id: string;
  text: string;
}

export interface SurveyQuestion {
  id: string; // Generate with uuid.v4()
  type: "multiple_choice" | "text";
  question: string;
  options?: QuestionOption[]; // For multiple_choice, min 2
  required: boolean;
  order: number; // 1-based index
  maxSelections?: number; // 1 for single, >1 for multiple (multiple_choice only)
}

export interface CreateSurvey {
  title: string;
  id_session: string;
  questions: SurveyQuestion[];
  categories: "before" | "during" | "after";
}

export interface TrainingSession {
  id: string;
  title: string;
  // Other session fields as needed
}

export interface SurveyResponse {
  id: string;
  title: string;
  id_session: string;
  categories: "before" | "during" | "after";
  questions: SurveyQuestion[];
  created_at: string;
  updated_at: string;
}
