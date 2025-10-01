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
import { useListCoursesQuery } from "@/lib/apis/common/courses-api";
import { Loading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { XCircleIcon } from "lucide-react";

export function CourseTab() {
  const { data, isLoading, isError } = useListCoursesQuery();

  if (isLoading) {
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

  if (!data?.data.rows.length) {
    return (
      <EmptyState
        icon="BookIcon"
        title="Aucun cours disponible"
        description="Il n'y a actuellement aucun cours à afficher."
      />
    );
  }

  return (
    <Table>
      <TableCaption>Liste de tous les cours disponibles</TableCaption>
      <TableHeader className="border">
        <TableRow>
          <TableHead>Titre</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Créateur</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="border">
        {data.data.rows.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>
              {item.CreatedBy.firstName} {item.CreatedBy.lastName}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
