// Types for User In Session API

export type UserInSessionStatus = "refusedpayment" | "notpaid" | "pending" | "in" | "out";

export interface TrainingSession {
  id: string;
  title: string;
  nb_places: number;
  available_places: number;
  begining_date: string;
  ending_date: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

export interface UserInSession {
  id: string;
  id_session: string;
  status: UserInSessionStatus;
  id_user: string;
  createdAt: string;
  updatedAt: string;
  trainingSession: TrainingSession;
  user: User;
}

export interface UserSessionStudentView {
  status: UserInSessionStatus;
  trainingSession: {
    id: string;
    title: string;
    begining_date: string;
    ending_date: string;
  };
  training: {
    title: string;
  };
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface CreateUserInSessionRequest {
  id_session: string;
  status?: UserInSessionStatus;
  id_user: string;
}

export interface UpdateUserInSessionRequest {
  id: string;
  id_session?: string;
  status?: UserInSessionStatus;
  id_user?: string;
}

export interface DeleteUserInSessionRequest {
  id: string;
}

export interface CreateFreeUserInSessionRequest {
  id_session: string;
}
