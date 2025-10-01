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
  identityNumber?: number | null;
  dateBirth?: Date | null;
  role: UserRole;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
