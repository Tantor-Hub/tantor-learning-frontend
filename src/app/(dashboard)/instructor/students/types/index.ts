type Student = {
  id: string;
  name: string;
  email: string;
  course: string;
  progress: number;
  action: "Actif" | "Traitement" | "Terminé" | "Bésoin d'aide";
  lastConnection: string;
  city: string;
};

export type StudentDocsData = {
  all: Student[];
  inProgress: Student[];
  completed: Student[];
  needHelp: Student[];
};
