export interface IListPlanning {
  status: number;
  message: string;
  data: Array<{
    id: string;
    title: string;
    description: string;
    id_cible_training: string | null;
    id_cible_session: string | null;
    id_cible_cours: string;
    id_cible_lesson: string | null;
    id_cible_user: string | null;
    createdBy: string;
    begining_date: string;
    beginning_hour: string;
    ending_hour: string;
    createdAt: string;
    updatedAt: string;
    trainings: any[];
    trainingSession: any | null;
    sessionCours: {
      id: string;
      title: string;
    };
    lesson: any | null;
    users: any[];
    creator: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
}
