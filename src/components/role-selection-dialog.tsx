"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Role {
  role: string;
}

interface RoleSelectionDialogProps {
  roles: Role[];
  isOpen: boolean;
  onClose: () => void;
}

export function RoleSelectionDialog({ roles, isOpen, onClose }: RoleSelectionDialogProps) {
  const router = useRouter();

  const handleRoleSelect = (role: string) => {
    const dashboardPath = getDashboardPath(role);
    if (dashboardPath) {
      onClose();
      router.replace(dashboardPath);
    }
  };

  const getDashboardPath = (role: string): string | null => {
    switch (role) {
      case "Admin":
        return "/admin";
      case "Étudiants":
        return "/student";
      case "Secrétariat & Administratif":
        return "/secretary";
      case "Formateurs":
        return "/instructor";
      default:
        return null;
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">Sélectionner votre rôle</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Vous avez plusieurs rôles assignés. Veuillez choisir le rôle avec lequel vous souhaitez
            vous connecter.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-2 mt-4">
          {roles.map((roleObj, index) => (
            <Button
              key={index}
              variant="outline"
              size="lg"
              onClick={() => {
                handleRoleSelect(roleObj.role);
                toast.success("Connexion réussie!", {
                  description:
                    "Vous êtes connecté, vous allez être redirigé vers votre tableau de bord",
                });
              }}
              className="justify-center"
            >
              {roleObj.role.toUpperCase()}
            </Button>
          ))}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook to manage role selection logic
export function useRoleSelection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleUserRoles = (roles: Role[]) => {
    if (roles?.length === 1) {
      // Single role - redirect directly
      const dashboardPath = getDashboardPath(roles[0].role);
      if (dashboardPath) {
        router.replace(dashboardPath);
      }
    } else if (roles?.length > 1) {
      // Multiple roles - show selection dialog
      setIsDialogOpen(true);
    }
  };

  const getDashboardPath = (role: string): string | null => {
    switch (role) {
      case "Admin":
        return "/admin";
      case "Étudiants":
        return "/student";
      case "Secrétariat & Administratif":
        return "/secretary";
      default:
        return null;
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    handleUserRoles,
  };
}
