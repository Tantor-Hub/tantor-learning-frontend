"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Archive, Reply, Forward, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Suspense } from "react";
import { Loading } from "@/components/shared/loading";
import { useGetMessageByIdQuery, useArchivedChatMutation } from "@/lib/apis/common/chat-api";
import { DeleteMessageDialog } from "@/components/messages/dialog/delete-message-dialog";
import { toast } from "sonner";

function MessageActions() {
  const router = useRouter();
  const params = useParams();
  const messageId = params.id as string;

  const {
    data: message,
    isLoading,
    isError,
  } = useGetMessageByIdQuery(
    { id: messageId },
    { skip: !messageId } // Skip if no messageId
  );

  const [archivedMessage, { isLoading: isLoadingArchived }] = useArchivedChatMutation();

  const handleArchivedMessage = async () => {
    try {
      await archivedMessage({ id: messageId }).unwrap();
      toast.info("Message Archivé");
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Erreur lors du chargement du message</div>;
  if (!message) return <div>Message non trouvé</div>;
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <Button variant={"outline"} onClick={() => router.back()}>
          <ChevronLeft /> Retour
        </Button>
        <div className="flex items-center gap-4">
          <Button variant={"outline"} onClick={handleArchivedMessage}>
            {!isLoadingArchived ? (
              <>
                <Archive /> Archiver
              </>
            ) : (
              <Loader2 className="animate-spin" />
            )}
          </Button>
          <Button variant={"outline"}>
            <Reply /> Repondre
          </Button>
          <Button variant={"outline"}>
            <Forward /> Transferer
          </Button>
          <DeleteMessageDialog id={messageId} />
        </div>
      </div>
      <div className="border border-border rounded-lg p-4 mt-4">
        <div className="mb-4">
          <p className="text-primary text-xl font-bold">{message.data.subject}</p>
          <p className="text-[#979DAC]">
            De : {message.data.Sender.fs_name} (Role,formateur).{" "}
            {new Date(message.data.createdAt).toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <p>{message.data.content}</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <MessageActions />
    </Suspense>
  );
}
