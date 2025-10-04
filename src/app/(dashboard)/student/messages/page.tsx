import { Suspense } from "react";
import { MessageTabView } from "@/components/messages/message-tab-view";
import { MessageTabViewSkeleton } from "@/components/messages/message-tab-view-skeleton";

export default function Page() {
  return (
    <Suspense fallback={<MessageTabViewSkeleton />}>
      <MessageTabView />
    </Suspense>
  );
}
