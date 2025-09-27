export interface TrainingSession {
  id: string;
  title: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  id_cible_session: string[];
  begining_date: string;
  ending_date?: string;
  trainingSessions?: TrainingSession[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  id_cible_session: string[];
  begining_date: string;
  ending_date: string;
}

export interface UpdateEventRequest {
  id: string;
  title?: string;
  description?: string;
  begining_date?: string;
  ending_date?: string;
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
