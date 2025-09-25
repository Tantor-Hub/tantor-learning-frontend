import { Suspense } from "react";
import SessionListClient from "./components/SessionListClient";
import { SessionListSkeleton } from "../../skeletons/SessionListSkeleton";

export default function SessionListPage() {
  return (
    <Suspense fallback={<SessionListSkeleton />}>
      <SessionListClient />
    </Suspense>
  );
}
