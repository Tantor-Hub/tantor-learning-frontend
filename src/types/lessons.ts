export interface Lesson {
  id: string;
  title: string;
  description: string;
  id_cours: string;
  ispublish?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LessonsResponse {
  length: number;
  rows: Lesson[];
}

export interface StudentLesson {
  id: string;
  title: string;
  description: string;
}

export interface StudentLessonsResponse {
  length: number;
  rows: StudentLesson[];
}

export interface ApiResponse<T> {
  status: number;
  message?: string;
  data: T;
}

export interface CreateLessonRequest {
  title: string;
  description: string;
  id_cours: string;
  ispublish: boolean;
}

export interface UpdateLessonRequest {
  id: string;
  title?: string;
  description?: string;
  ispublish?: boolean;
}

export interface DeleteLessonRequest {
  id: string;
}
