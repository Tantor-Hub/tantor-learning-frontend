export const filters = [
  {
    label: "Statut",
    value: "all",
    options: [
      { value: "all", label: "Tous" },
      { value: "published", label: "Publié" },
      { value: "unpublished", label: "Non publié" },
    ],
  },
  // Add more filters if needed, e.g., by ponderation or category
  {
    label: "Pondération",
    value: "all",
    options: [
      { value: "all", label: "Toutes" },
      { value: "low", label: "Faible (<50)" },
      { value: "high", label: "Élevée (≥50)" },
    ],
  },
];

export const documentsData = []; // Placeholder if needed
