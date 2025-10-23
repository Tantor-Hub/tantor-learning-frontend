interface Formateur {
  id: string;
  firstName: string;
  lastName: string;
}

interface CreatedBy {
  id: string;
  firstName: string;
  lastName: string;
}

interface TrainingSession {
  id: string;
  title: string;
  nb_places: number;
  available_places: number;
  begining_date: string;
  ending_date: string;
}

interface SessionCourse {
  id: string;
  title: string;
  description: string;
  is_published: boolean;
  formateurs: Formateur[];
  id_session: string;
  ponderation: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  CreatedBy: CreatedBy;
  trainingSession: TrainingSession;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export type SessionCourseResponse = ApiResponse<SessionCourse>;
