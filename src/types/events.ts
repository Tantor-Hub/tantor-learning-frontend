export interface TrainingSession {
  id: string;
  title: string;
}

export interface SessionCours {
  id: string;
  title: string;
  id_session: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  id_cible_session: string[];
  begining_date: string;
  beginning_hour: string;
  ending_hour: string;
  ending_date?: string;
  trainingSessions?: TrainingSession[];
  sessionCours?: SessionCours;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  id_cible_session: string[];
  begining_date: string;
  beginning_hour: string;
  ending_hour: string;
  ending_date?: string;
}

export interface UpdateEventRequest {
  id: string;
  title?: string;
  description?: string;
  begining_date?: string;
  beginning_hour?: string;
  ending_hour?: string;
  ending_date?: string;
  courseId?: string;
}

export interface EventListResponse {
  status: number;
  message: string;
  data: Event[];
}

export interface EventResponse {
  status: number;
  message: string;
  data: Event;
}
