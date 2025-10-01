import { BookOpen, Download } from "lucide-react";
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
import { EmptyState } from "@/components/shared/empty-state";
import { useListCourseBySessionIdQuery } from "@/lib/apis/secretary/training-secretary-api";
import { Loading } from "@/components/shared/loading";
import { AddCourseSession } from "./add-course-session";

export function CourseSessionId({ id_session }: { id_session: string }) {
  const { data: coursesBySessionId, isLoading: isLoadingCoursesBySessionId } =
    useListCourseBySessionIdQuery({ id_session: id_session });

  if (isLoadingCoursesBySessionId) return <Loading />;

  // Check if there's no data or empty data
  if (!coursesBySessionId?.data?.rows || coursesBySessionId.data.rows.length === 0) {
    return (
      <EmptyState
        icon="Database"
        title="Pas de données"
        description="Il n'y a pas de données disponibles pour cette session"
      />
    );
  }

  return (
    <Table>
      <TableCaption>Liste des cours pour cette session</TableCaption>
      <TableHeader className="border">
        <TableRow>
          <TableHead>Titre</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Créateur</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Catégorie</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="border">
        {coursesBySessionId.data.rows.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.Title?.title || "N/A"}</TableCell>
            <TableCell>{item.Title?.description || "Aucune description"}</TableCell>
            <TableCell>
              {item.CreatedBy?.firstName} {item.CreatedBy?.lastName}
            </TableCell>
            <TableCell>
              <Badge variant={item.is_published ? "default" : "secondary"}>
                {item.is_published ? "Publié" : "Non publié"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline">Catégorie {item.id_category}</Badge>
            </TableCell>
            <TableCell className="text-center">
              <AddCourseSession courseId={Number(item.id)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
