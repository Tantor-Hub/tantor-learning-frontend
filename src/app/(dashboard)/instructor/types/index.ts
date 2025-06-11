type Session = {
  id: string;
  day: string;
  timeStart: string;
  timeEnd: string;
  title: string;
  room: string;
};

type Instructor = {
  id: string;
  name: string;
  specialty: string;
  attendancePercentage: number;
  attendanceScore: number;
};

export type { Session, Instructor };
