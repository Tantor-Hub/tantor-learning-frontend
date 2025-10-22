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
import { EmptyState } from "@/components/shared/empty-state";
import { useCourseQuery } from "@/lib/apis/common/courses-api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function formatDateRange(session: any) {
  if (!session) return "-";
  try {
    const begin = session.begining_date
      ? new Date(session.begining_date).toLocaleDateString()
      : null;
    const end = session.ending_date ? new Date(session.ending_date).toLocaleDateString() : null;
    return `${session.title}${begin && end ? ` — ${begin} → ${end}` : ""}`;
  } catch {
    return session.title || "-";
  }
}

export function CourseTable() {
  const courses = useCourseQuery();

  if (courses.isLoading) {
    return (
      <div className="overflow-x-auto">
        <Table className="w-full min-w-[1200px]">
          <TableCaption>Liste de toutes les matières disponibles</TableCaption>
          <TableHeader className="border">
            <TableRow>
              <TableHead className="whitespace-nowrap">Titre</TableHead>
              <TableHead className="whitespace-nowrap">Description</TableHead>
              <TableHead className="whitespace-nowrap">Session</TableHead>
              <TableHead className="whitespace-nowrap">Formateurs</TableHead>
              <TableHead className="whitespace-nowrap">Pondération</TableHead>
              <TableHead className="whitespace-nowrap">Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="border">
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!courses.data?.data.rows) {
    return (
      <EmptyState
        icon="BookIcon"
        title="Aucun cours disponible"
        description="Il n'y a actuellement aucun cours à afficher."
      />
    );
  }

  return (
    <div className="">
      <Table className="w-full">
        <TableCaption>Liste de toutes les matières disponibles</TableCaption>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="whitespace-nowrap">Titre</TableHead>
            {/* <TableHead className="whitespace-nowrap">Description</TableHead> */}
            <TableHead className="whitespace-nowrap">Session</TableHead>
            <TableHead className="whitespace-nowrap">Formateurs</TableHead>
            <TableHead className="whitespace-nowrap">Pondération</TableHead>
            <TableHead className="whitespace-nowrap">Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border">
          {courses.data.data.rows.map((course: any) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium whitespace-nowrap">{course.title}</TableCell>
              {/* <TableCell className="max-w-md">{course.description}</TableCell> */}
              <TableCell className="whitespace-nowrap">
                {formatDateRange(course.trainingSession)}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {course.formateurs && course.formateurs.length > 0
                  ? course.formateurs.map((f: any) => `${f.firstName} ${f.lastName}`).join(", ")
                  : "-"}
              </TableCell>
              <TableCell className="whitespace-nowrap">{course.ponderation ?? "-"}</TableCell>
              <TableCell>
                <Badge variant={course.is_published ? "default" : "secondary"}>
                  {course.is_published ? "Publié" : "Brouillon"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
