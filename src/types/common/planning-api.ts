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
    id_cible_lesson: string[] | null; // Changed from string | null to string[] | null
    id_cible_user: string | null;
    createdBy: string | null; // Can be null
    begining_date: string;
    beginning_hour: string;
    ending_hour: string;
    qrcode: string; // Added missing field
    createdAt: string;
    updatedAt: string;
    trainings: any[];
    trainingSession: any | null;
    sessionCours: {
      id: string;
      title: string;
    };
    lesson: any | null;
    lessons: Array<{
      // Added missing field
      id: string;
      title: string;
    }>;
    users: any[];
    creator: {
      // Can be null
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
    sessionId: string; // Added missing field
    participationInfo: {
      // Added missing field
      students: Array<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        avatar: string;
        userInSessionId: string;
        status: string;
        participated: boolean;
      }>;
      totalInSession: number;
      participantsCount: number;
      absentCount: number;
    };
  }>;
}
