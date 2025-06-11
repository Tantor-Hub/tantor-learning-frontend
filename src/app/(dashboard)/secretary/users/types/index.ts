export interface UserData {
  allUsers: UserType[];
  students: UserType[];
  instructors: UserType[];

  tableInfo: {
    allUsers: TableInfo;
    students: TableInfo;
    instructors: TableInfo;
  };
}

interface UserType {
  id: string;
  nom: string;
  email: string;
  role: string;
  status: string;
  lastUpdate: string;
}

interface TableInfo {
  title: string;
  description: string;
}
