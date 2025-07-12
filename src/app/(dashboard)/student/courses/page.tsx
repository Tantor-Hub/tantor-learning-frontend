"use client";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { useGetMySessionsQuery } from "@/lib/apis/student/training-api";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Euro, GraduationCap, Play, ArrowRight, BookOpen } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Session {
  id: number;
  Session: {
    id: number;
    designation: string;
    duree: string;
    progression: number;
    type_formation: string;
    date_session_debut: string;
    date_session_fin: string;
    prix: number;
  };
  Formation: {
    id: number;
    titre: string;
    sous_titre: string;
  };
  is_started: number;
}

export default function Page() {
  const router = useRouter();
  const currentUser = useSelector(selectCurrentUser);
  const { data, isLoading } = useGetMySessionsQuery();

  if (isLoading) return <Loading />;

  const sessions: Session[] = data?.data?.list || [];

  if (sessions.length === 0) {
    return (
      <EmptyState
        icon="Calendar"
        title="Aucune session programmée"
        description="Rejoignez une session existante."
      />
    );
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getSessionStatus = (session: Session) => {
    const now = new Date();
    const startDate = new Date(session.Session.date_session_debut);
    const endDate = new Date(session.Session.date_session_fin);

    if (now < startDate) return { status: "À venir", color: "bg-blue-100 text-blue-800" };
    if (now > endDate) return { status: "Terminée", color: "bg-gray-100 text-gray-800" };
    return { status: "En cours", color: "bg-green-100 text-green-800" };
  };

  // Filtrer les sessions par statut
  const upcomingSessions = sessions.filter(
    (session) => getSessionStatus(session).status === "À venir"
  );
  const currentSessions = sessions.filter(
    (session) => getSessionStatus(session).status === "En cours"
  );
  const completedSessions = sessions.filter(
    (session) => getSessionStatus(session).status === "Terminée"
  );

  const renderSessionCard = (session: Session) => {
    const sessionStatus = getSessionStatus(session);

    return (
      <Card
        key={session.id}
        className="group transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 border"
        onClick={() => router.push(`/student/courses/${session.id}`)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={sessionStatus.color}>{sessionStatus.status}</Badge>
                <Badge variant="outline" className="text-xs">
                  {session.Session.type_formation}
                </Badge>
              </div>
              <CardTitle className="font-xl font-semibold line-clamp-2">
                {session.Session.designation}
              </CardTitle>
              <CardDescription className="text-sm mt-1 line-clamp-2">
                <span className="font-medium">Formation:</span>{" "}
                <span className="text-primary">{session.Formation.titre}</span>
              </CardDescription>
            </div>
            <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Session Period */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(session.Session.date_session_debut)} -{" "}
                {formatDate(session.Session.date_session_fin)}
              </span>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{session.Session.duree}</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Euro className="h-4 w-4" />
              <span className="font-medium">{session.Session.prix} €</span>
            </div>

            <Separator />

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Progression</span>
                <span className="font-medium">{session.Session.progression}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${session.Session.progression}%` }}
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <Button className="w-full group-hover:bg-blue-600 transition-colors" size="sm">
                <Play className="h-4 w-4 mr-2" />
                {session.is_started ? "Continuer" : "Commencer"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="heading-one">Bonjour {currentUser?.fs_name} ! 👋</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              La liste de vos sessions de formation
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="py-4 px-2.5 bg-white border font-semibold">
          <TabsTrigger value="all" className="p-3.5">
            Toutes ({sessions.length})
          </TabsTrigger>
          <TabsTrigger value="current" className="p-3.5">
            En cours ({currentSessions.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="p-3.5">
            Terminées ({completedSessions.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="p-3.5">
            À venir ({upcomingSessions.length})
          </TabsTrigger>
        </TabsList>

        {/* All Sessions */}
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map(renderSessionCard)}
          </div>
        </TabsContent>

        {/* Upcoming Sessions */}
        <TabsContent value="upcoming" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map(renderSessionCard)
            ) : (
              <EmptyState
                icon="Calendar"
                title="Aucune session à venir"
                description="Vous n'avez aucune session programmée pour le moment."
                className="col-span-full"
              />
            )}
          </div>
        </TabsContent>

        {/* Current Sessions */}
        <TabsContent value="current" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSessions.length > 0 ? (
              currentSessions.map(renderSessionCard)
            ) : (
              <EmptyState
                icon="Clock"
                title="Aucune session en cours"
                description="Vous n'avez aucune session active pour le moment."
                className="col-span-full"
              />
            )}
          </div>
        </TabsContent>

        {/* Completed Sessions */}
        <TabsContent value="completed" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedSessions.length > 0 ? (
              completedSessions.map(renderSessionCard)
            ) : (
              <EmptyState
                icon="BadgeCheck"
                title="Aucune session terminée"
                description="Vous n'avez encore terminé aucune session."
                className="col-span-full"
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
