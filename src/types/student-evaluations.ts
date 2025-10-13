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
