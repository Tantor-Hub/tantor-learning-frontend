import { IUser, UserRole } from "./user";

export interface CatalogueFormation {
  id: string;
  type: UserRole;
  title: string;
  description: string;
  piece_jointe: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateCatalogueFormationRequest {
  type: IUser;
  title: string;
  description: string;
  piece_jointe: string;
}

export interface UpdateCatalogueFormationRequest {
  type?: UserRole;
  title?: string;
  description?: string;
  piece_jointe?: string;
}
