export const filters = [
  { label: "Date", value: "Aujourd'hui" },
  { label: "Cours", value: "Tous les cours" },
  { label: "Formations", value: "Comptabilité et Finance (DCG, DSCG)" },
  { label: "Durée", value: "Courte (< 15h)" },
  { label: "Etats", value: "à venir" },
  { label: "Note", value: "0-20" },
];

export const sessionCourses = [
  {
    status: "En direct",
    subject: "Cours en direct : Gestion fiscale et juridique",
    category: "Comptabilité et Finance",
    teacher: "Pierre Durant",
    attendees: 18,
    dateLabel: "En direct",
  },
  {
    status: "Dans 2h",
    subject: "Finance",
    category: "Comptabilité et Finance",
    teacher: "Marie Leroy",
    attendees: 14,
    dateLabel: "Dans 2h",
  },
  {
    status: "Demain",
    subject: "Cours en direct : Gestion fiscale et juridique",
    category: "Comptabilité et Finance",
    teacher: "Pierre Durant",
    attendees: 20,
    dateLabel: "Demain",
  },
  {
    status: "Lundi",
    subject: "Cours en direct : Gestion fiscale et juridique",
    category: "Comptabilité et Finance",
    teacher: "Pierre Durant",
    attendees: 32,
    dateLabel: "Lundi",
  },
  {
    status: "Lundi",
    subject: "Cours en direct : Gestion fiscale et juridique",
    category: "Comptabilité et Finance",
    teacher: "Pierre Durant",
    attendees: 23,
    dateLabel: "Lundi",
  },
];

export const documentsData = {
  all: [
    {
      title: "Tous les documents",
      name: "Cours d’introduction au management",
      type: "PDF",
      size: "2.6MB",
      date: "12/04/2025",
      category: "Cours",
    },
    {
      title: "Partagés avec moi",
      name: "TPI - Recherche sur l’impact du mgt1",
      type: "DOCX",
      size: "1.8MB",
      date: "15/04/2025",
      category: "TPI",
    },
    {
      title: "Récents",
      name: "Presentation Base des donnees.pptx",
      type: "PPTX",
      size: "9.8MB",
      date: "15/04/2025",
      category: "Présentation",
    },
  ],
  shared: [{ title: "Partagés avec moi" }],
  recent: [{ title: "Récents" }],
};

export const coursesData = {
  actifs: [
    {
      title: "Finance",
      professor: "Prof. Pierre Durand",
      nextSession: {
        day: "Aujourd’hui",
        time: "14:00",
      },
      averageProgress: 45,
    },
    {
      title: "Gestion juridique fiscale et sociale",
      professor: "Prof. Marie Leroy",
      nextSession: {
        day: "Demain",
        time: "12:30",
      },
      averageProgress: 60,
    },
    {
      title: "Management et contrôle de gestion",
      professor: "Prof. Jeanne Dupont",
      nextSession: {
        day: "Demain",
        time: "18:00",
      },
      averageProgress: 50,
    },
  ],
  avenir: [],
  termines: [],
};
