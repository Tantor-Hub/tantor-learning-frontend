export interface IStudentAnswerOption {
  id: string;
  studentAnswerId: string;
  optionId: string;
  studentAnswer: {
    id: string;
    answerText: string | null;
    isCorrect: boolean;
  };
  option: {
    id: string;
    text: string;
    isCorrect: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IStudentAnswerOptionsResponse {
  status: number;
  message: string;
  data: IStudentAnswerOption[];
}

export interface IStudentAnswerOptionResponse {
  status: number;
  message: string;
  data: IStudentAnswerOption;
}
