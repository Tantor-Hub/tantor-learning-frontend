"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/shared/loading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Loader2, ArrowRight } from "lucide-react";
import { useListSessionsByFormationIdQuery } from "@/lib/apis/public/public-api";
import { useApplyToTrainingMutation } from "@/lib/apis/student/training-api";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const trainingId = params.id as string;

  useEffect(() => {
    // router.push("/trainings/id/questions");
  }, [router]);

  const { data, isLoading } = useListSessionsByFormationIdQuery({ id: trainingId });
  const [applySessionMutation] = useApplyToTrainingMutation();

  // État pour suivre quel bouton est en cours de chargement
  const [loadingSessionId, setLoadingSessionId] = useState<number | null>(null);

  if (isLoading) return <Loading />;

  const handleApplySessionMutation = async (sessionId: number) => {
    try {
      setLoadingSessionId(sessionId); // Marquer ce bouton comme en chargement
      // await applySessionMutation({ id_session: sessionId }).unwrap();
      router.push(`/trainings/${sessionId}/questions`);
      toast.success("Candidature enregistrée");
    } catch (error: any) {
      if (error.status === 401) {
        toast.error("Erreur de candidature");
        router.push("/signin");
        return;
      }
      toast(
        "Vous vous êtes déjà inscrit à cette session de formation; vous ne pouvez le faire deux fois."
      );
    } finally {
      setLoadingSessionId(null); // Réinitialiser l'état de chargement
    }
  };
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{"title"}</CardTitle>
          <CardDescription>{"description"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 py-2">
            {data?.data.length === 0 ? (
              <EmptyState
                title="Aucune session disponible"
                description="Il n'y a actuellement aucune session programmée pour cette formation. Veuillez vérifier ultérieurement ou nous contacter pour plus d'informations."
                icon="Calendar"
              />
            ) : (
              data?.data.list.map((item) => (
                <div
                  key={item.uuid}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{item.designation}</h3>
                      <div className="text-sm text-gray-500 mt-1">
                        <p>Durée: {item.duree}</p>
                        <p>
                          Du {new Date(item.date_session_debut).toLocaleDateString("fr-FR")}
                          {" au "}
                          {new Date(item.date_session_fin).toLocaleDateString("fr-FR")}
                        </p>
                        <p>Prix: {item.prix} €</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleApplySessionMutation(item.id)}
                      disabled={loadingSessionId !== null} // Désactiver tous les boutons pendant le chargement
                      className="ml-4"
                    >
                      {loadingSessionId === item.id ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          S'inscrire
                          <ArrowRight />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
