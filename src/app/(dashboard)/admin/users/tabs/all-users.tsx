import { useListUserByRoleQuery } from "@/lib/apis/users-api";
import { useChangeUserRoleMutation } from "@/lib/apis/users-api";
import { useToggleVerificationMutation } from "@/lib/apis/admin/user-api";
import { UserRole } from "@/types/user";
import { useState } from "react";
import UserProfileModal from "@/components/user-profile-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loading } from "@/components/shared/loading";
import { Skeleton } from "@/components/ui/skeleton";

interface AllUsersTabProps {
  title: string;
  description: string;
}

export default function AllUsersTab({ title, description }: AllUsersTabProps) {
  const { data: apiData, isLoading, isError, refetch } = useListUserByRoleQuery({ role: "all" });
  const [changeUserRole, { isLoading: isChangingRole }] = useChangeUserRoleMutation();
  const [toggleVerification, { isLoading: isToggling }] = useToggleVerificationMutation();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-white border flex flex-col rounded-md gap-10 p-5 md:p-10">
        <div className="flex flex-col gap-2.5">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader className="border">
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border">
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="flex items-center justify-center">
                      <Skeleton className="h-6 w-6" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-160px)]">
        <div className="flex flex-col items-center gap-4 p-4 max-w-md text-center">
          <p className="text-destructive">
            {"Impossible de charger les utilisateurs. Veuillez réessayer plus tard."}
          </p>
          <Button onClick={() => refetch()} variant="outline" size="lg">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  const allUsers = apiData?.data ?? [];

  const handleRoleChange = async (email: string, newRole: UserRole) => {
    try {
      await changeUserRole({ email, role: newRole }).unwrap();
      refetch();
      setEditingUserId(null);
      alert("Rôle mis à jour avec succès");
    } catch (error) {
      alert("Erreur lors de la mise à jour du rôle");
    }
  };

  const handleToggleVerification = async (userId: string) => {
    try {
      await toggleVerification({ userId }).unwrap();
      refetch();
      alert("Statut mis à jour avec succès");
    } catch (error) {
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const handleViewProfile = (userId: string) => {
    setSelectedUserId(userId);
    setIsProfileModalOpen(true);
  };

  return (
    <div className="bg-white border flex flex-col rounded-md gap-10 p-5 md:p-10">
      <div className="flex flex-col gap-2.5">
        <h3 className="text-[#0466C8] text-xl font-semibold">{title}</h3>
        <p className="text-[#33415C] font-medium">{description}</p>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          {allUsers.length > 0 ? (
            <Table>
              <TableCaption>Liste de tous les utilisateurs</TableCaption>
              <TableHeader className="border">
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border">
                {allUsers.map((user) => {
                  const isEditing = editingUserId === user.id.toString();
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.firstName || "Inconnu"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {isEditing ? (
                          <select
                            defaultValue={user.role}
                            onChange={(e) => {
                              const newRole = e.target.value as UserRole;
                              if (newRole !== user.role) {
                                handleRoleChange(user.email, newRole);
                              } else {
                                setEditingUserId(null);
                              }
                            }}
                            className="border rounded px-2 py-1 text-sm"
                            autoFocus
                            onBlur={() => setEditingUserId(null)}
                          >
                            {Object.values(UserRole).map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                            onClick={() => setEditingUserId(user.id.toString())}
                          >
                            {user.role}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_verified ? "default" : "destructive"}>
                          {user.is_verified ? "Active" : "Suspendu"}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <Ellipsis className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleToggleVerification(user.id.toString())}
                            >
                              {user.is_verified ? "Suspendre le compte" : "Restaurer le compte"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewProfile(user.id.toString())}>
                              Voir le profil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-gray-500">Aucun utilisateur trouvé</div>
          )}
        </div>
      </div>
      <UserProfileModal
        userId={selectedUserId}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedUserId(null);
        }}
      />
    </div>
  );
}
