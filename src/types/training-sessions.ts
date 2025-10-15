// Types for Training Sessions API

export interface Training {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  trainingtype: string;
  prix: string;
}

export interface TrainingSession {
  id: string;
  id_trainings: string;
  title: string;
  nb_places: number;
  available_places: number;
  required_document_before: string[];
  required_document_during: string[];
  required_document_after: string[];
  payment_method: string[];
  cpf_link: string;
  survey: string | null;
  regulation_text: string;
  begining_date: string;
  ending_date: string;
  createdAt: string;
  updatedAt: string;
  trainings: Training;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
