"use client";
import { useRouter } from "next/navigation";
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
import { useGetMySessionsQuery } from "@/lib/apis/student/training-api";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";

export default function Page() {
  const router = useRouter();
  const currentUser = useSelector(selectCurrentUser);
  const { data, isLoading } = useGetMySessionsQuery();
  if (isLoading) return <Loading />;
  console.log(JSON.stringify(data));
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
      <p className="text-primary text-xl font-semibold mb-4">
        {currentUser?.fs_name} ! Voici vos sessions inscrites :
      </p>
      <div className="min-w-[1000px]">
        <Table>
          <TableCaption>Liste complète de mes sessions inscrites</TableCaption>
          <TableHeader className="border">
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Formation</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Prix</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="border">
            {data?.data.list?.map((session) => (
              <TableRow
                key={session.id}
                onClick={() => router.push(`/student/courses/${session.id}`)}
                className="hover:cursor-pointer"
              >
                <TableCell className="font-medium">{session.date_session_debut}</TableCell>
                <TableCell className="text-muted-foreground">
                  {session.designation}
                  {session.Formation.titre}
                </TableCell>
                <TableCell className="text-muted-foreground">{session.duree}</TableCell>
                <TableCell className="text-muted-foreground">{session.prix} €</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
