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
import { useCourseQuery } from "@/lib/apis/common/courses-api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AssignInstructorsModal } from "./assign-instructors-modal";
import { EditCourseModal } from "./edit-course-modal";

export function CourseTable() {
  const courses = useCourseQuery();

  if (courses.isLoading) {
    return (
      <Table>
        <TableCaption>Liste de tous les cours disponibles</TableCaption>
        <TableHeader className="border">
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Statut</TableHead>
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
                <Skeleton className="h-6 w-16" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  // console.log(JSON.stringify(courses.data));

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
    <Table>
      <TableCaption>Liste de tous les cours disponibles</TableCaption>
      <TableHeader className="border">
        <TableRow>
          <TableHead>Titre</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Statut</TableHead>
          {/* <TableHead>Assignés</TableHead> */}
          {/* <TableHead className="text-center">Actions</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody className="border">
        {courses.data.data.rows.map((course) => (
          <TableRow key={course.id}>
            <TableCell className="font-medium">{course.title}</TableCell>
            <TableCell>{course.description}</TableCell>
            <TableCell>
              <Badge variant={course.is_published ? "default" : "secondary"}>
                {course.is_published ? "Publié" : "Brouillon"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {/* {course.id_formateurs.map((instructor) => (
                  <Badge key={instructor.id} variant="outline" className="text-xs">
                    {instructor.firstName} {instructor.lastName}
                  </Badge>
                ))} */}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2 justify-center">
                {/* <EditCourseModal course={course} /> */}
                {/* <AssignInstructorsModal course={course} /> */}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
