"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Home, MapPin, Calendar, IdCard } from "lucide-react";
import { useGetUserProfileQuery } from "@/lib/apis/users-api";
import { Loading } from "../shared/loading";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UpdateProfile } from "./update-profile";

type UserDataProps = {
  id: number;
  fs_name: string;
  ls_name: string;
  nick_name: string;
  email: string;
  phone?: string;
  avatar?: string | null;
  adresse_physique?: string | null;
  pays_residance?: string | null;
  ville_residance?: string | null;
  num_piece_identite?: string | null;
  createdAt: string;
  roles: {
    id: number;
    role: string;
    description: string;
    HasRoles: {
      id: number;
      UserId: number;
      RoleId: number;
      status: number;
      createdAt: string;
      updatedAt: string;
    };
  }[];
};
export function ProfilePage() {
  const { data, isLoading, isError } = useGetUserProfileQuery();
  const [userData, setUserData] = useState<UserDataProps | null>(null);

  // Vérifier et mettre à jour les données utilisateur quand elles sont chargées
  useEffect(() => {
    if (data) {
      // console.log("Structure complète des données:", JSON.stringify(data));
      setUserData(data.data);
    }
  }, [data]);

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading profile</div>;
  if (!userData) return <div>No profile data found</div>;
  return (
    <div>
      <div className="flex flex-col md:flex-row items-start gap-5 md:gap-20 p-6 rounded-xl border justify-center">
        <div className="flex flex-col items-center w-full md:w-fit">
          <Avatar className="w-40 h-40">
            <AvatarImage src={userData.avatar || ""} alt="Profile Image" />
            <AvatarFallback className="text-2xl font-bold">
              {userData.fs_name[0]}
              {userData.ls_name[0]}
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-sm font-semibold">
            {userData.fs_name || "Prénom"} {userData.ls_name || "Nom"}
          </h2>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-500">{userData.email || "Email non disponible"}</p>
            <UpdateProfile />
          </div>
        </div>

        <div className="flex flex-col gap-4 text-sm md:w-fit mx-auto md:mx-0">
          {/* Email Section */}
          <div>
            <h3 className="font-semibold">Adresse Electronique</h3>
            <p className="flex items-center gap-2 p-2 font-light">
              <Mail className="h-5 w-5 font-extralight" />
              Email : {userData.email || "Non spécifié"}
            </p>
            <p className="flex items-center gap-2 p-2 font-light">
              <Phone className="h-5 w-5 font-extralight" />
              Téléphone : {userData.phone || "Non spécifié"}
            </p>
          </div>

          {/* Address Section */}
          <div>
            <h3 className="font-semibold">Adresse</h3>
            <p className="flex items-center gap-2 p-2 font-light">
              <Home className="h-5 w-5 font-extralight" />
              Addresse : {userData.adresse_physique || "Non spécifiée"}
            </p>
            <p className="flex items-center gap-2 p-2 font-light">
              <MapPin className="h-5 w-5 font-extralight" />
              Ville : {userData.ville_residance || "Non spécifiée"}
            </p>
            <p className="flex items-center gap-2 p-2 font-light">
              <MapPin className="h-5 w-5 font-extralight" />
              Pays : {userData.pays_residance || "Non spécifié"}
            </p>
          </div>

          {/* Other Details Section */}
          <div>
            <h3 className="font-semibold">Autres Détails</h3>
            <p className="flex items-center gap-2 p-2 font-light">
              <IdCard className="h-5 w-5 font-extralight" />
              Pièce d'identité : {userData.num_piece_identite || "Non spécifiée"}
            </p>
            <p className="flex items-center gap-2 p-2 font-light">
              <Calendar className="h-5 w-5 font-extralight" />
              Ajouté le{" "}
              {userData.createdAt
                ? new Date(userData.createdAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Date inconnue"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
