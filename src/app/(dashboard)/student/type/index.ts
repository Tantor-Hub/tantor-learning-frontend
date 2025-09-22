import { ReactElement } from "react";

export interface StudentStatsType {
  title: string;
  icon: ReactElement;
  value: number | string;
  change: string;
  description: string;
}

export interface OngoingCourseTypes {
  type: ReactElement;
  title: string;
  subtitle: string;
  link: string;
}
