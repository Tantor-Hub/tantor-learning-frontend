"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableCaption } from "@/components/ui/table";
import { Loading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { XCircleIcon } from "lucide-react";
import { useListRoleQuery } from "@/lib/apis/admin/role-api";

export function RoleTab() {
  const { data: roles, isLoading: isLoadingRole, isError } = useListRoleQuery();
  if (isLoadingRole) {
    return <Loading />;
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="border-red-500 bg-red-50">
        <XCircleIcon className="h-4 w-4 text-red-500" />
        <AlertTitle>Connexion échouée</AlertTitle>
        <AlertDescription>
          Impossible de se connecter au serveur. Veuillez :
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Vérifier votre connexion internet</li>
            <li>Réessayer dans quelques instants</li>
            <li>Contacter le support si le problème persiste</li>
          </ul>
        </AlertDescription>
      </Alert>
    );
  }

  if (!roles?.data.rows.length) {
    return (
      <EmptyState
        icon="ShieldUser"
        title="Aucune rôle disponible"
        description="Il n'y a actuellement aucune rôle à afficher."
      />
    );
  }

  return (
    <Table>
      <TableCaption>Liste de tous les rôles disponibles</TableCaption>
      <TableHeader className="border">
        <TableRow>
          <TableHead>Rôle</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="border">
        {roles.data.rows.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.role}</TableCell>
            <TableCell>{item.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
