"use client";
import { useRouter } from "next/navigation";
import { useGetAllTrainingsQuery } from "@/lib/apis/public/public-api";
import { Loading } from "@/components/shared/loading";
import {
  Table,
  TableHead,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";

export default function Page() {
  const router = useRouter();
  const { data, isLoading } = useGetAllTrainingsQuery();
  if (isLoading) return <Loading />;

  if (!data?.data.list) {
    return (
      <EmptyState
        icon="Calendar"
        title="Pas de séance programmée"
        description="Rejoignez une séance existante ou créez-en une nouvelle."
      />
    );
  }
  return (
    <div className="border rounded-lg p-4 overflow-y-scroll">
      <p className="text-primary text-xl font-semibold mb-4">Liste des Séances</p>
      <div className="min-w-[1000px]">
        <Table>
          <TableCaption>Liste complète de mes séances</TableCaption>
          <TableHeader className="border">
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Formation</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Prix</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="border">
            {data?.data.list.map((item) => (
              <TableRow
                key={item.id}
                onClick={() => router.push(`/student/courses/${item.id}`)}
                className="hover:cursor-pointer"
              >
                <TableCell className="font-medium">{item.designation}</TableCell>
                <TableCell className="text-muted-foreground">{item.Formation.titre}</TableCell>
                <TableCell className="text-muted-foreground">{item.duree}</TableCell>
                <TableCell className="text-muted-foreground">{item.prix} €</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
