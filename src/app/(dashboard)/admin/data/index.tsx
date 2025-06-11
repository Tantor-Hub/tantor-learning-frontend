import { BookOpen, CheckCircle, GraduationCap, UserCircle, Users } from "lucide-react";

export const adminStats = [
  {
    title: "Utilisateurs totaux",
    icon: <Users size={20} />,
    value: "1,248",
    change: "↗ +3%",
    description: "par rapport au mois dernier",
  },
  {
    title: "Cours actifs",
    icon: <BookOpen size={20} />,
    value: "64",
    change: "↗ +14%",
    description: "nouveaux ce mois-ci",
  },
  {
    title: "Taux de complétion",
    icon: <CheckCircle size={20} />,
    value: "78%",
    change: "↗ +10%",
    description: "par rapport au trimestre précédent",
  },
  {
    title: "Formateurs actifs",
    icon: <UserCircle size={20} />,
    value: "32",
    change: "↗ +5%",
    description: "en ligne",
  },
  {
    title: "Étudiants actifs",
    icon: <GraduationCap size={20} />,
    value: "45",
    change: "↗ +2%",
    description: "en ligne",
  },
];

export const newUser = [
  {
    id: 1,
    name: "Sophie Martin",
    timestamp: "il y a 2 heures",
    role: "Étudiant",
    avatar: null,
  },
  {
    id: 2,
    name: "Thomas Dubois",
    timestamp: "il y a 5 heures",
    role: "Formateur",
    avatar: null,
  },
  {
    id: 3,
    name: "Emma Petit",
    timestamp: "il y a 3 heures",
    role: "Étudiant",
    avatar: null,
  },
  {
    id: 4,
    name: "Lucas Bernard",
    timestamp: "il y a 5 heures",
    role: "Étudiant",
    avatar: null,
  },
];
