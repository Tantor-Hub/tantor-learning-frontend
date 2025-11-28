export interface TrainingSession {
  id: string;
  title: string;
}

export interface SessionCours {
  id: string;
  title: string;
  id_session: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  id_cible_session: string[];
  begining_date: string;
  beginning_hour: string;
  ending_hour: string;
  ending_date?: string;
  trainingSessions?: TrainingSession[];
  sessionCours?: SessionCours;
  createdAt?: string;
  updatedAt?: string;
  participantCount?: number;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  id_cible_session: string[];
  begining_date: string;
  beginning_hour: string;
  ending_hour: string;
  ending_date?: string;
}

export interface CreateEventForLessonsRequest {
  title: string;
  description: string;
  id_cible_lesson: string[];
  begining_date: string;
  beginning_hour: string;
  ending_hour: string;
}

export interface UpdateEventRequest {
  id: string;
  title?: string;
  description?: string;
  begining_date?: string;
  beginning_hour?: string;
  ending_hour?: string;
  ending_date?: string;
  courseId?: string;
}

export interface EventListResponse {
  status: number;
  message: string;
  data: Event[];
}

export interface EventResponse {
  status: number;
  message: string;
  data: Event;
}

export interface StudentAttendance {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  sessionCoursTitle: string;
  progression: number;
  progressionStatus: string;
  eventsAttended: number;
  totalEvents: number;
  eventDates: string[];
}

export interface StudentsAttendanceResponse {
  status: number;
  data: {
    length: number;
    rows: StudentAttendance[];
  };
  message: string;
}

export interface ParticipationStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  userInSessionId: string;
  status: string;
  participated: boolean;
}

export interface ParticipationInfo {
  students: ParticipationStudent[];
  totalInSession: number;
  participantsCount: number;
}

export interface EventDetailsResponse {
  status: number;
  message: string;
  data: {
    id: string;
    title: string;
    description: string;
    sessionId: string;
    participationInfo: ParticipationInfo;
  };
}
