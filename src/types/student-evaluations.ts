export enum StudentevaluationType {
  EXERCISE = "exercise",
  HOMEWORK = "homework",
  TEST = "test",
  QUIZ = "quiz",
  EXAMEN = "examen",
}

export interface IStudentEvaluation {
  id?: string;
  title: string;
  description: string;
  type: StudentevaluationType;
  points: number;
  sessionCoursId: string;
  lessonId: string[];
  submittiondate: string;
  beginningTime?: string;
  endingTime?: string;
  ispublish: boolean;
  isImmediateResult: boolean;
  createdBy?: string[];
  lecturer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  questions?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ISessionCours {
  id: string;
  title: string;
  description: string;
}

export interface ILesson {
  id: string;
  title: string;
  description: string;
}

export interface IStudentEvaluationsResponse {
  evaluations: IStudentEvaluation[];
  total: number;
  sessionCours: ISessionCours;
}

export interface IStudentEvaluationsApiResponse {
  status: number;
  message: string;
  data: IStudentEvaluationsResponse;
}

export interface IStudentsByEvaluationIdApiResponse {
  status: number;
  message: string;
  data: {
    evaluation: {
      id: string;
      title: string;
      description: string;
      type: string;
      points: number;
      ispublish: boolean;
      markingStatus: string;
      sessionCoursId: string;
      sessionCours: {
        id: string;
        title: string;
        description: string;
      };
      creator: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
      lessons: Array<{
        id: string;
        title: string;
        description: string;
        ispublish: boolean;
      }>;
    };
    students: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar: string | null;
      totalAnswers: number;
      markedAnswers: number;
      markedPercentage: number;
    }>;
    totalStudents: number;
  };
}

export interface ISelectedOption {
  id: string;
  optionId: string;
  questionId: string;
  isCorrect: boolean;
  points: number;
  option: {
    id: string;
    text: string;
    isCorrect: boolean;
  };
}

export interface IStudentAnswer {
  id: string;
  questionId: string;
  studentId: string;
  evaluationId: string;
  answerText: string | null;
  isCorrect: boolean;
  points: number;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
  };
  question: {
    id: string;
    type: string;
    text: string;
    points: number;
    options?: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
    }>;
  };
  selectedOptions?: ISelectedOption[];
}

export interface IStudentAnswersResponse {
  evaluation: {
    id: string;
    title: string;
    description: string;
    type: string;
    points: number;
    ispublish: boolean;
    markingStatus: string;
    sessionCours: {
      id: string;
      title: string;
      description: string;
    };
    questions: Array<{
      id: string;
      type: string;
      text: string;
      points: number;
    }>;
  };
  answers: IStudentAnswer[];
  totalAnswers: number;
}

export interface IStudentAnswersApiResponse {
  status: number;
  message: string;
  data: IStudentAnswersResponse;
}

export interface IStudentStatisticsData {
  sessionId: string;
  averagePoints: number;
  percentage: number;
  totalPointsEarned: number;
  totalPossiblePoints: number;
  futureHomeworkCount: number;
  sessionCoursCount: number;
  evaluationCount: number;
}

export interface IStudentStatisticsApiResponse {
  status: number;
  message: string;
  data: IStudentStatisticsData;
}
