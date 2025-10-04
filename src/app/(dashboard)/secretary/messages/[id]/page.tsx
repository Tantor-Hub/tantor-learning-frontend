import { Suspense } from "react";
import { MessageActions } from "./message-actions";
import { MessageActionsSkeleton } from "./message-actions-skeleton";

export default function Page() {
  return (
    <Suspense fallback={<MessageActionsSkeleton />}>
      <MessageActions />
    </Suspense>
  );
}
