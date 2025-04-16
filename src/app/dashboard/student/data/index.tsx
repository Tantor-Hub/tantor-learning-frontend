import { BookOpen, Camera, ClipboardList, ListCheck, Percent, UserPlus } from "lucide-react";

export const studentStats = [
  {
    title: "Cours Inscrits",
    icon: <BookOpen size={20} />,
    value: 5,
    change: "↗ 2 en cours",
    description: "aujourd’hui",
  },
  {
    title: "Devoirs à rendre",
    icon: <ClipboardList size={20} />,
    value: 3,
    change: "↗ 1 pour demain",
    description: "à compléter",
  },
  {
    title: "Moyenne générale",
    icon: <ListCheck size={20} />,
    value: "15.3/20",
    change: "↓ 0.5",
    description: "depuis le dernier semestre",
  },
  {
    title: "Pourcentage",
    icon: <Percent size={20} />,
    value: "78.9%",
    change: "↗ +3%",
    description: "par rapport au dernier semestre",
  },
  {
    title: "Messages non lus",
    icon: <UserPlus size={20} />,
    value: 4,
    change: "↗ +3%",
    description: "à lire",
  },
];

export const ongoingCourse = {
  type: <Camera size={20} />,
  title: "Cours en direct : Gestion juridique fiscale et juridique ",
  subtitle: "Pierre Durant . Commence a 14:00. 12 participants",
  link: "#",
};
