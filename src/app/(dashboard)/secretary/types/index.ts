export interface Schedule {
  time: string;
  title: string;
  location: string;
}

export interface SecDocData {
  id: string;
  name: string;
  date: string;
  action: string;
}

export interface SecDocsData {
  waiting: SecDocData[];
  inProgress: SecDocData[];
  completed: SecDocData[];
}
