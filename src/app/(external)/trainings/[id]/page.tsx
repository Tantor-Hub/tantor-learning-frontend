"use client";
import { useRouter, useParams } from "next/navigation";
import { ArrowRight, Users, ArrowLeft, Calendar, Clock } from "lucide-react";
import { Loading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { useListSessionsByFormationIdQuery } from "@/lib/apis/public/public-api";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const trainingId = params.id as string;
  const { data, isLoading } = useListSessionsByFormationIdQuery({ id: trainingId });

  if (isLoading) return <Loading />;

  const formation = data?.data.list[0]?.Formation;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 space-y-8">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="border-primary text-primary"
        size="lg"
      >
        <ArrowLeft />
        Retour aux formations
      </Button>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{formation?.titre}</h1>
        <p className="text-muted-foreground">{formation?.sous_titre}</p>
        <p className="text-muted-foreground">{formation?.description}</p>
      </div>

      {data?.data.length === 0 ? (
        <EmptyState
          title="Aucune session disponible"
          description="Il n'y a actuellement aucune session programmée pour cette formation."
          icon="Calendar"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.data.list.map((session) => (
            <Card key={session.id} className="border hover:cursor-pointer hover:shadow-2xl">
              <CardHeader className="pb-3">
                <h3 className="font-semibold text-lg">{session.designation}</h3>
                <p className="text-sm text-muted-foreground">
                  {session.description || "Aucune description disponible"}
                </p>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {new Date(session.date_session_debut).toLocaleDateString("fr-FR")}
                    {" - "}
                    {new Date(session.date_session_fin).toLocaleDateString("fr-FR")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{session.duree}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>
                    Places:{" "}
                    <Badge variant="outline">
                      {session.nb_places_disponible}/{session.nb_places}
                    </Badge>
                  </span>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  disabled={session.nb_places === session.nb_places_disponible}
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
      )}
    </div>
  );
}
