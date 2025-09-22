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

export const userData: UserData = {
  tableInfo: {
    allUsers: {
      title: "Tous les utilisateurs",
      description: "Liste de tous les utilisateurs enregistrés sur la plateforme",
    },
    students: {
      title: "Étudiants",
      description: "Tous les étudiants enregistrés sur la plateforme",
    },
    instructors: {
      title: "Formateurs",
      description: "Tous les formateurs enregistrés sur la plateforme",
    },
    secretaries: {
      title: "Secrétaires",
      description: "Tous les secrétaires enregistrés sur la plateforme",
    },
  },
};
