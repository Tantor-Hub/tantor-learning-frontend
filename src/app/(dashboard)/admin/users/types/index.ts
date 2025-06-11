export interface UserData {
  tableInfo: {
    allUsers: TableInfo;
    students: TableInfo;
    instructors: TableInfo;
    secretaries: TableInfo;
  };
}

interface TableInfo {
  title: string;
  description: string;
}
