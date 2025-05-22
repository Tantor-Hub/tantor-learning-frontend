"use client";
import { Label } from "@/components/ui/label";
import { BadgeCheck, FilePenLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Home, MapPin, Calendar, IdCard } from "lucide-react";
import Image from "next/image";
import { useGetUserProfileQuery } from "@/lib/apis/users-api";

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
export default function Page() {
  const { data, isLoading, isError } = useGetUserProfileQuery();
  const [preview, setPreview] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserDataProps | null>(null);

  // Vérifier et mettre à jour les données utilisateur quand elles sont chargées
  useEffect(() => {
    if (data) {
      // console.log("Structure complète des données:", JSON.stringify(data));
      setUserData(data.data);
    }
  }, [data]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading profile</div>;
  if (!userData) return <div>No profile data found</div>;
  return (
    <div>
      <div className="flex flex-col md:flex-row items-start gap-5 md:gap-20 p-6 rounded-xl shadow bg-white border border-border justify-center">
        <div className="flex flex-col items-center w-full md:w-fit">
          <picture>
            <Label
              htmlFor="picture"
              className="w-40 h-40 rounded-full bg-[#CAC5C5] cursor-pointer relative overflow-hidden"
            >
              {preview && (
                <Image
                  src={preview}
                  fill
                  alt="preview"
                  className="absolute w-full h-full object-cover"
                />
              )}
            </Label>
            <Input
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </picture>

          <h2 className="mt-4 text-sm font-semibold">
            {userData.fs_name || "Prénom"} {userData.ls_name || "Nom"}
          </h2>
          <div className="flex gap-1.5">
            <p className="text-sm text-gray-500">{userData.email || "Email non disponible"}</p>
            <span className="text-blue-500">
              <BadgeCheck className="inline w-4 h-4" />
            </span>
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

          <div className="px-2">
            <Button size="sm" variant="outline">
              <FilePenLine />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
