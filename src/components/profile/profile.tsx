"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Home, MapPin, Calendar, QrCode } from "lucide-react";
import { useGetUserProfileQuery, UserProfile } from "@/lib/apis/users-api";
import { Loading } from "../shared/loading";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UpdateProfile } from "./update-profile";
import { QrScanner } from "./qr-scanner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import { useJoinEventMutation } from "@/lib/apis/events";
import { toast } from "react-hot-toast";

export function ProfilePage() {
  const { data, isLoading, isError, refetch } = useGetUserProfileQuery();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const [joinEvent, { isLoading: isJoinEventLoading }] = useJoinEventMutation();

  // Vérifier et mettre à jour les données utilisateur quand elles sont chargées
  useEffect(() => {
    if (data) {
      setUserData(data.data);
    }
  }, [data]);

  if (isLoading) return <Loading />;
  if (isError) return <div>Erreur lors du chargement du profil</div>;
  if (!userData) return <div>Aucune donnée de profil trouvée</div>;
  return (
    <div>
      <div className="flex flex-col md:flex-row items-start gap-5 md:gap-20 p-6 rounded-xl border justify-center">
        <div className="flex flex-col items-center w-full md:w-fit">
          <Avatar className="w-40 h-40">
            <AvatarImage src={userData.avatar || ""} alt="Profile Image" className="object-cover" />
            <AvatarFallback className="text-2xl font-bold">
              {userData.firstName[0]}
              {userData.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-sm font-semibold">
            {userData.firstName || "Prénom"} {userData.lastName || "Nom"}
          </h2>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-500">{userData.email || "Email non disponible"}</p>
            <UpdateProfile
              address={userData?.address || ""}
              country={userData?.country || ""}
              phone={userData?.phone}
              city={userData?.city?.toString()}
              avatarURL={userData.avatar || ""}
              firstName={userData.firstName}
              lastName={userData.lastName}
              email={userData.email}
              onProfileUpdate={refetch}
            />
            {currentUser?.role === "student" && (
              <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-4">
                    <QrCode className="mr-2 h-4 w-4" />
                    Scanner un QR Code
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Scanner un QR Code</DialogTitle>
                    <DialogDescription>
                      Placez le QR code devant la caméra pour le scanner.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    {isQrDialogOpen && (
                      <QrScanner
                        key="qr-scanner"
                        onScan={async (result) => {
                          if (isJoinEventLoading) return; // Prevent multiple triggers
                          console.warn("QR Code scanned:", result);
                          const toastId = toast.loading("Enregistrement de la présence...");
                          setIsQrDialogOpen(false); // Turn off camera immediately after first scan
                          try {
                            const response = await joinEvent({ eventId: result }).unwrap();
                            // Succès - l'utilisateur a été ajouté
                            toast.success("Votre présence a été enregistrée", { id: toastId });
                          } catch (error: any) {
                            console.error("Error joining event:", error);

                            // Vérifier le code de statut HTTP
                            const status = error?.status || error?.data?.status;
                            const errorMessage = error?.data?.message || error?.message || "";

                            // Cas où l'utilisateur a déjà scanné
                            if (
                              status === 409 ||
                              status === 400 ||
                              errorMessage.toLowerCase().includes("déjà") ||
                              errorMessage.toLowerCase().includes("already") ||
                              errorMessage.toLowerCase().includes("existe")
                            ) {
                              toast.error(
                                "Vous avez déjà scanné ce QR code. Votre présence a déjà été enregistrée.",
                                { id: toastId }
                              );
                            } else {
                              // Autre erreur
                              toast.error(
                                "Erreur lors de l'enregistrement de la présence: " +
                                  (errorMessage || "Une erreur inattendue s'est produite"),
                                { id: toastId }
                              );
                            }
                          }
                        }}
                        onError={(error) => {
                          console.error("QR Scan error:", error);
                          toast.error("Erreur lors du scan: " + error);
                        }}
                      />
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
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
              Addresse : {userData.address || "Non spécifiée"}
            </p>
            <p className="flex items-center gap-2 p-2 font-light">
              <MapPin className="h-5 w-5 font-extralight" />
              Ville : {userData.city || "Non spécifiée"}
            </p>
            <p className="flex items-center gap-2 p-2 font-light">
              <MapPin className="h-5 w-5 font-extralight" />
              Pays : {userData.country || "Non spécifié"}
            </p>
          </div>

          {/* Other Details Section */}
          <div>
            <h3 className="font-semibold">Autres Détails</h3>
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
