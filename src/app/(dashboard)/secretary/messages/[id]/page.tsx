import React, { Suspense } from "react";
import { MessageDetail } from "./message-detail";
import { MessageDetailSkeleton } from "@/components/skeletons/message-detail-skeleton";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  return (
    <Suspense fallback={<MessageDetailSkeleton />}>
      <MessageDetail messageId={id} />
    </Suspense>
  );
}
