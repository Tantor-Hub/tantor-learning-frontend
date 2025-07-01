"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateRoleMutation } from "@/lib/apis/admin/role-api";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

type RoleFormData = {
  role: string;
  description: string;
};

export function AddRole() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormData>();
  const [createRole, { isLoading: isLoadingCreateRole }] = useCreateRoleMutation();

  const onSubmit = async (data: RoleFormData) => {
    try {
      await createRole({
        role: data.role,
        description: data.description,
      }).unwrap();
      toast.success("Succès", { description: "Le rôle a été créé avec succès" });
      reset(); // Reset form after successful submission
    } catch (error) {
      toast.error("Erreur", { description: "Une erreur est survenue lors de la création du rôle" });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un rôle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau rôle</DialogTitle>
            <DialogDescription>
              Définissez un nouveau rôle pour les utilisateurs de l'application.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role">Rôle</Label>
              <Input
                id="role"
                placeholder="Admin"
                {...register("role", { required: "Le nom du rôle est requis" })}
              />
              {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Description du rôle"
                {...register("description", { required: "La description est requise" })}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoadingCreateRole}>
              {isLoadingCreateRole ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Ajouter un rôle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
