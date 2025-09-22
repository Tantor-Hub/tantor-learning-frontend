import { Users, Calendar, CheckSquare, MessageSquare, AlertOctagon } from "lucide-react";

export const SecretaryStats = [
  {
    title: "Dossier en attente",
    icon: <Users size={20} />,
    value: 24,
    change: "↗ +12%",
    description: "À traiter aujourd'hui",
  },
  {
    title: "Rendez-vous aujourd'hui",
    icon: <Calendar size={20} />,
    value: 5,
    change: "↗ +4",
    description: "aujourd'hui",
  },
  {
    title: "Taches a faire",
    icon: <CheckSquare size={20} />,
    value: 18,
    change: "↓ 3 prioritaires",
    description: "a evaluer",
  },
  {
    title: "Message non lus",
    icon: <MessageSquare size={20} />,
    value: 12,
    change: "↗ +3%",
    description: "depuis hier",
  },
  {
    title: "Reclamations",
    icon: <AlertOctagon size={20} />,
    value: 32,
    change: "↗ +3%",
    description: "ce mois",
  },
];

export const secSchedule = [
  {
    time: "09:20-11:00",
    title: "Reunion equipe pedagogique",
    location: "Salle B204",
  },
  {
    time: "11:00-12:00",
    title: "Inscription nouvel etudiant",
    location: "Bureau d'acceuil",
  },
  {
    time: "14:00-14:30",
    title: "Appe telephonique",
    location: "En ligne",
  },
  {
    time: "15:00-15:20",
    title: "Permanence etudiants",
    location: "En ligne",
  },
  {
    time: "16:00-17:00",
    title: "Preparation dossiers examens",
    location: "En ligne",
  },
];

const secDocsData = {
  waiting: [
    {
      name: "Lucas Martin",
      id: "ETU-2025-0458",
      date: "12/04/2025",
      action: "Inscription",
    },
    {
      name: "Sarah Benyahia",
      id: "ETU-2025-0459",
      date: "13/04/2025",
      action: "Inscription",
    },
    {
      name: "Omar Diallo",
      id: "ETU-2025-0460",
      date: "14/04/2025",
      action: "Inscription",
    },
    {
      name: "Claire Dupont",
      id: "ETU-2025-0461",
      date: "15/04/2025",
      action: "Inscription",
    },
    {
      name: "Yanis Traoré",
      id: "ETU-2025-0462",
      date: "16/04/2025",
      action: "Inscription",
    },
  ],
  inProgress: [
    {
      name: "Lucas Martin",
      id: "ETU-2025-0458",
      date: "12/04/2025",
      action: "Traitement",
    },
    {
      name: "Sarah Benyahia",
      id: "ETU-2025-0459",
      date: "13/04/2025",
      action: "Traitement",
    },
    {
      name: "Omar Diallo",
      id: "ETU-2025-0460",
      date: "14/04/2025",
      action: "Traitement",
    },
  ],
  completed: [
    {
      name: "Claire Dupont",
      id: "ETU-2025-0461",
      date: "15/04/2025",
      action: "Archiver",
    },
    {
      name: "Yanis Traoré",
      id: "ETU-2025-0462",
      date: "16/04/2025",
      action: "Archiver",
    },
    {
      name: "Lucas Martin",
      id: "ETU-2025-0458",
      date: "17/04/2025",
      action: "Archiver",
    },
    {
      name: "Sarah Benyahia",
      id: "ETU-2025-0459",
      date: "18/04/2025",
      action: "Archiver",
    },
  ],
};

export default secDocsData;
