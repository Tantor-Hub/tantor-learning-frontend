import { BookOpen, ListCheck, Percent, User, UserPlus } from "lucide-react";
import { Instructor, Session } from "../types";
import { sign } from "crypto";

export const instructorStats = [
  {
    title: "Etudiants",
    icon: <User size={20} />,
    value: 128,
    change: "↗ +12%",
    description: "par rapport au moi dernier",
  },
  {
    title: "Matières actives",
    icon: <BookOpen size={20} />,
    value: 5,
    change: "↗ +1",
    description: "aujourd'hui",
  },
  {
    title: "Evaluations à corriger",
    icon: <ListCheck size={20} />,
    value: "18",
    change: "↓ -5 en retard",
    description: "à évaluer",
  },
  {
    title: "Taux de réussite",
    icon: <Percent size={20} />,
    value: "82%",
    change: "↗ +3%",
    description: "par rapport au dernier semestre",
  },
  {
    title: "Réclammation élèves",
    icon: <UserPlus size={20} />,
    value: 32,
    change: "↗ +3%",
    description: "",
  },
];

export const instructors: Instructor[] = Array(5).fill({
  id: "1",
  name: "Thomas Dubois",
  specialty: "Développement web avancé",
  attendancePercentage: 63,
  attendanceScore: 48,
});

export const sessions: Session[] = [
  {
    id: "1",
    day: "Aujourd'hui",
    timeStart: "09:20",
    timeEnd: "11:00",
    title: "Gestion juridique fiscale et juridique",
    room: "Salle R204",
  },
  {
    id: "2",
    day: "Aujourd'hui",
    timeStart: "14:00",
    timeEnd: "16:00",
    title: "Management et controle de gestion",
    room: "Salle R204",
  },
  {
    id: "3",
    day: "Demain",
    timeStart: "10:00",
    timeEnd: "12:30",
    title: "Finance",
    room: "Salle R204",
  },
  {
    id: "4",
    day: "Jeudi",
    timeStart: "14:00",
    timeEnd: "16:00",
    title: "Comptabilite et Audit",
    room: "Salle R204",
  },
  {
    id: "5",
    day: "Vendredi",
    timeStart: "14:00",
    timeEnd: "16:00",
    title: "Comptabilite et Audit",
    room: "Salle R204",
  },
];

const documentFilter = [
  { label: "Date", value: "10/04/2025" },
  { label: "Type", value: "Avant la formation" },
  { label: "Formations", value: "Comptabilité et Finance (DCG, DSCG)" },
];

const documentsData = [
  {
    title: "Les modalites d’evaluation",
    type: "A lire",
    signature: true,
    date: "12/04/2025",
    category: "fiche",
  },
  {
    title: "Contrat",
    type: "A lire",
    signature: true,
    date: "12/04/2025",
    category: "fiche",
  },
  {
    title: "Fiche de paye",
    type: "A lire",
    signature: true,
    date: "12/04/2025",
    category: "fiche",
  },
  {
    title: "Contrat de formation",
    type: "A lire",
    signature: true,
    date: "12/04/2025",
    category: "fiche",
  },
  {
    title: "Convention de formation",
    type: "A completer",
    signature: true,
    date: "12/04/2025",
    category: "fiche",
  },
];

export { documentFilter, documentsData };
