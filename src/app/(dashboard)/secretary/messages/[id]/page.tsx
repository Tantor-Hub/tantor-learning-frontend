import { Suspense } from "react";
import { MessageActions } from "./message-actions";
import { MessageActionsSkeleton } from "./message-actions-skeleton";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<MessageActionsSkeleton />}>
      <MessageActions messageId={id} />
    </Suspense>
  );
}
