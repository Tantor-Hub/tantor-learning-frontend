"use client";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useListSessionsByFormationIdQuery } from "@/lib/apis/public/public-api";
import { useApplyToTrainingMutation } from "@/lib/apis/student/training-api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ListSeance({
  title,
  description,
  id,
}: {
  title: string;
  description: string;
  id: string;
}) {
  const router = useRouter();
  const { data, isLoading } = useListSessionsByFormationIdQuery({ id: id });
  const [applySessionMutation] = useApplyToTrainingMutation();

  // État pour suivre quel bouton est en cours de chargement
  const [loadingSessionId, setLoadingSessionId] = useState<number | null>(null);

  if (isLoading) return null;

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
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="bg-transparent border border-[#0466C8] text-[#5C677D] hover:shadow-sm hover:shadow-blue-300 h-fit w-full">
            S'inscrire
            <ArrowRight />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[300px] pr-4">
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
          </ScrollArea>
        </DialogContent>
      </form>
    </Dialog>
  );
}
