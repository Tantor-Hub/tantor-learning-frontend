import { DefaultSession, DefaultUser } from "next-auth";
import { ROLES } from "./auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      firstName: string;
      lastName?: string;
      nick_name?: string;
      phone?: string;
      avatar?: string;
      role: ROLES;
      auth_token?: string;
      refresh_token?: string;
      adresse_physique?: string;
      pays_residance?: string;
      ville_residance?: string;
      date_of_birth?: string;
      num_piece_identite?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: number;
    firstName: string;
    lastName?: string;
    nick_name?: string;
    phone?: string;
    avatar?: string;
    role: ROLES;
    auth_token?: string;
    refresh_token?: string;
    adresse_physique?: string;
    pays_residance?: string;
    ville_residance?: string;
    date_of_birth?: string;
    num_piece_identite?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    firstName: string;
    lastName?: string;
    nick_name?: string;
    phone?: string;
    avatar?: string;
    role: ROLES;
    auth_token?: string;
    refresh_token?: string;
    adresse_physique?: string;
    pays_residance?: string;
    ville_residance?: string;
    date_of_birth?: string;
    num_piece_identite?: string;
  }
}
