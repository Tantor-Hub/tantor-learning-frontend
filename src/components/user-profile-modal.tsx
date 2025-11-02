import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useGetUserProfileQuery } from "@/lib/apis/admin/user-api";

interface UserProfileModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileModal({ userId, isOpen, onClose }: UserProfileModalProps) {
  const { data, isLoading, error } = useGetUserProfileQuery(
    { userId: userId! },
    { skip: !userId || !isOpen }
  );

  const profile = data?.data;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profil de l'utilisateur</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">Erreur lors du chargement du profil</div>
        ) : profile ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={profile.avatar}
                  alt={`${profile.firstName} ${profile.lastName}`}
                />
                <AvatarFallback>
                  {profile.firstName?.[0]}
                  {profile.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">
                  {profile.firstName} {profile.lastName}
                </h3>
                <Badge variant="outline">{profile.role}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm">{profile.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Téléphone</label>
                <p className="text-sm">{profile.phone || "Non spécifié"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Adresse</label>
                <p className="text-sm">{profile.address || "Non spécifiée"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Ville</label>
                  <p className="text-sm">{profile.city || "Non spécifiée"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Pays</label>
                  <p className="text-sm">{profile.country || "Non spécifié"}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date de naissance</label>
                <p className="text-sm">
                  {profile.dateBirth
                    ? new Date(profile.dateBirth).toLocaleDateString("fr-FR")
                    : "Non spécifiée"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Créé le</label>
                  <p className="text-sm">
                    {new Date(profile.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Mis à jour le</label>
                  <p className="text-sm">
                    {new Date(profile.updatedAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
