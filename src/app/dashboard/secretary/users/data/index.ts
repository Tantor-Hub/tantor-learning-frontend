import { UserData } from "../types";

export const userData: UserData = {
  allUsers: Array(5).fill({
    id: "user1",
    nom: "Birusha",
    email: "birusha@example.com",
    role: "Étudiant",
    status: "Archivé",
    lastUpdate: "il y a 3 mois",
  }),
  students: Array(5).fill({
    id: "student1",
    nom: "Semjo",
    email: "semjomagene@example.com",
    role: "Étudiant",
    status: "Archivé",
    lastUpdate: "il y a 1 mois",
  }),
  instructors: Array(5).fill({
    id: "formateur1",
    nom: "Jéthron",
    email: "jethron@example.com",
    role: "Formateur",
    status: "Archivé",
    lastUpdate: "il y a 2 mois",
  }),

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
  },
};
