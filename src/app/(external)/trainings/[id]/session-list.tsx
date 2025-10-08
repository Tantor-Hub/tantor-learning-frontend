"use client";

import { useMemo } from "react";
import { ArrowRight, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { useRouter } from "next/navigation";
import { useListStudentSessionsByTrainingIdQuery } from "@/lib/apis/public/public-api";
import SessionListSkeleton from "./session-list-skeleton";

interface SessionListProps {
  trainingId: string;
}

export default function SessionList({ trainingId }: SessionListProps) {
  const router = useRouter();
  const { data, isFetching, isLoading, error } = useListStudentSessionsByTrainingIdQuery({
    id: trainingId,
  });

  const sessions: any[] = useMemo(() => {
    const raw = data?.data;
    if (Array.isArray(raw)) return raw as any[];
    return (raw?.list as any[]) || [];
  }, [data]);

  const trainingInfo = sessions?.[0]?.trainings;

  if (isLoading || isFetching) {
    return <SessionListSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Formation</h1>
          <p className="text-muted-foreground">
            Impossible de charger les sessions pour le moment.
          </p>
        </div>
        <EmptyState
          title="Erreur de chargement"
          description="Veuillez réessayer plus tard."
          icon="Calendar"
        />
      </div>
    );
  }

  if (!isLoading && !isFetching && sessions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {trainingInfo?.title ?? "Formation"}
          </h1>
          {trainingInfo?.subtitle ? (
            <p className="text-muted-foreground">{trainingInfo.subtitle}</p>
          ) : null}
          {trainingInfo?.description ? (
            <p className="text-muted-foreground">{trainingInfo.description}</p>
          ) : null}
        </div>
        <EmptyState
          title="Aucune session disponible"
          description="Il n'y a actuellement aucune session programmée pour cette formation."
          icon="Calendar"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{trainingInfo?.title}</h1>
        <p className="text-muted-foreground">{trainingInfo?.subtitle}</p>
        <p className="text-muted-foreground">{trainingInfo?.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session: any) => (
          <Card key={session.id} className="border hover:cursor-pointer hover:shadow-2xl">
            <CardHeader className="pb-3">
              <h3 className="font-semibold text-lg">{session.title}</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>
                  {new Date(session.begining_date).toLocaleDateString("fr-FR")} {" - "}
                  {new Date(session.ending_date).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{session.nb_places} places totales</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{session.available_places} places disponibles</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => router.push(`/trainings/${trainingId}/${session.id}`)}
                className="w-full gap-2"
              >
                S'inscrire
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
