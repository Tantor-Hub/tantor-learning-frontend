export enum UserRole {
  INSTRUCTOR = "instructor",
  STUDENT = "student",
  ADMIN = "admin",
  SECRETARY = "secretary",
}

export interface IUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  avatar?: string | null;
  address?: string | null;
  country?: string | null;
  city?: string | null;
  num_piece_identite?: number | null;
  dateBirth?: string | null;
  role: UserRole;
  is_verified: boolean;
  createdAt?: string;
  updatedAt?: string;
}
