import { StudentDocsData } from "../types";

export const studentFilter = [
  { label: "Date", value: "10/04/2025" },
  { label: "Type", value: "tous" },
  { label: "Status", value: "actifs" },
];

const studentData: StudentDocsData = {
  all: [
    {
      id: "Droit Pénal",
      name: "François Dupont",
      email: "jean.dupont@mail.com",
      course: "Droit Pénal",
      progress: 56,
      action: "Traitement",
      lastConnection: "Mer Jun 21",
      city: "Paris",
    },
    {
      id: "Droit Pénal",
      name: "Camille Martin",
      email: "anne.martin@mail.com",
      course: "Droit Pénal",
      progress: 83,
      action: "Actif",
      lastConnection: "Mar Jun 20",
      city: "Paris",
    },
    {
      id: "Droit Pénal",
      name: "Sophia Bernard",
      email: "sophie.bernard@mail.com",
      course: "Droit Pénal",
      progress: 100,
      action: "Terminé",
      lastConnection: "Lun Jun 19",
      city: "Paris",
    },
    {
      id: "Droit Pénal",
      name: "Antoine Durand",
      email: "jean.dupont@mail.com",
      course: "Droit Pénal",
      progress: 67,
      action: "Traitement",
      lastConnection: "Mer Jun 21",
      city: "Paris",
    },
    {
      id: "Droit Pénal",
      name: "Elise Moreau",
      email: "anne.martin@mail.com",
      course: "Droit Pénal",
      progress: 83,
      action: "Actif",
      lastConnection: "Mar Jun 20",
      city: "Paris",
    },
    {
      id: "Droit Pénal",
      name: "Thomas Petit",
      email: "sophie.bernard@mail.com",
      course: "Droit Pénal",
      progress: 67,
      action: "Bésoin d'aide",
      lastConnection: "Lun Jun 19",
      city: "Paris",
    },
    {
      id: "Droit Pénal",
      name: "Philippe Lambert",
      email: "jean.dupont@mail.com",
      course: "Droit Pénal",
      progress: 67,
      action: "Actif",
      lastConnection: "Mer Jun 21",
      city: "Paris",
    },
  ],
  inProgress: [],
  completed: [],
  needHelp: [],
};

// Categorize based on action
studentData.inProgress = studentData.all.filter(
  (s) => s.action === "Actif" || s.action === "Traitement"
);
studentData.completed = studentData.all.filter((s) => s.action === "Terminé");
studentData.needHelp = studentData.all.filter((s) => s.action === "Bésoin d'aide");

export default studentData;
