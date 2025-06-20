import { BookOpen, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { documentsData } from "../../../student/courses/data";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/shared/empty-state";

export function SeanceTable() {
  return (
    <EmptyState
      icon="Database"
      title="Pas des données"
      description="Il n'y a pas des données pour maintenant"
    />
  );
  return (
    <Table>
      <TableHeader>
        <TableRow className="grid grid-cols-7 text-sm font-medium text-gray-500 px-4 py-2 rounded-t-lg bg-gray-100 mb-1">
          <TableHead className="col-span-2">Noms</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Signature</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Catégorie</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documentsData["all"].length <= 1 ? (
          <p className="text-center text-gray-500 mt-4">Aucun document</p>
        ) : (
          documentsData["all"].map((doc, i) => (
            <TableRow
              key={i}
              className="grid grid-cols-7 items-center px-4 py-3 border-b text-sm text-gray-800 hover:bg-gray-50 transition shadow-sm bg-white mb-1"
            >
              <TableCell className="col-span-2">{doc.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{doc.type}</Badge>
              </TableCell>
              <TableCell>
                {" "}
                <Checkbox id="terms" />
              </TableCell>
              <TableCell>{"date" in doc ? doc.date : "-"}</TableCell>
              <TableCell>{"category" in doc ? doc.category : "-"}</TableCell>
              <TableCell className="flex items-center gap-3 text-blue-600">
                <BookOpen size={16} />
                <Download size={16} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
