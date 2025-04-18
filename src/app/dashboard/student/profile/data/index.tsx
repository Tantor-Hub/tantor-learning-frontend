import { UserProfile } from "../types";

import { Mail, Phone, Home, MapPin, Calendar, IdCard } from "lucide-react";

export const userProfileData: UserProfile = {
  username: "User004",
  email: "user004@gmail.com",
  verified: true,
  sections: [
    {
      title: "Adresse Electronique",
      fields: [
        {
          label: "Email : ",
          value: "user004@gmail.com",
          icon: <Mail className="h-5 w-5 font-extralight" />,
        },
        {
          label: "Téléphone : ",
          value: "+2570789470000",
          icon: <Phone className="h-5 w-5 font-extralight" />,
        },
      ],
    },
    {
      title: "Adresse",
      fields: [
        {
          label: "Addresse : ",
          value: "KG 48 st",
          icon: <Home className="h-5 w-5 font-extralight" />,
        },
        {
          label: "Cité de : ",
          value: "Paris",
          icon: <MapPin className="h-5 w-5 font-extralight" />,
        },
      ],
    },
    {
      title: "Autres Détails",
      fields: [
        {
          label: "Date de naissance ",
          value: "2002-04-05",
          icon: <Calendar className="h-5 w-5 font-extralight" />,
        },
        {
          label: "Pièce d'identité ",
          value: "1199080128731005",
          icon: <IdCard className="h-5 w-5 font-extralight" />,
        },
        {
          label: "Ajouté le ",
          value: "2024-06-29",
          icon: <Calendar className="h-5 w-5 font-extralight" />,
        },
      ],
    },
  ],
};
