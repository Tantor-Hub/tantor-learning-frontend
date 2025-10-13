export interface IStudentAnswer {
  id: string;
  questionId: string;
  studentId: string;
  evaluationId: string;
  answerText: string;
  isCorrect: boolean;
  question: {
    id: string;
    text: string;
    type: string;
    points: number;
  };
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  evaluation: {
    id: string;
    title: string;
  };
  selectedOptions: any[]; // Assuming this can be an array of selected options
  createdAt: string;
  updatedAt: string;
}

export interface IStudentAnswersResponse {
  status: number;
  message: string;
  data: IStudentAnswer[];
}
