export interface IOption {
  id: string;
  questionId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEvaluationQuestion {
  id: string;
  evaluationId: string;
  type: string;
  text: string;
  points: number;
  isImmediateResult: boolean;
  createdAt: string;
  updatedAt: string;
  options: IOption[];
}

export interface IEvaluationQuestionsResponse {
  status: number;
  message: string;
  data: IEvaluationQuestion[];
}
