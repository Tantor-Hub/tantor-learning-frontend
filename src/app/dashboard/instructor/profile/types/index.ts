import { ReactElement } from "react";

export interface ProfileField {
  label: string;
  value: string;
  icon: ReactElement;
}

export interface UserProfile {
  username: string;
  email: string;
  verified: boolean;
  avatarUrl?: string;
  sections: {
    title: string;
    fields: ProfileField[];
  }[];
}
