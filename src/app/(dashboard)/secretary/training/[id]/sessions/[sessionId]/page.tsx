import { Suspense } from "react";
import SessionDetailsClient from "./components/SessionDetailsClient";
import { SessionDetailsSkeleton } from "../../../skeletons/SessionDetailsSkeleton";

export default function SessionDetailsPage() {
  return (
    <Suspense fallback={<SessionDetailsSkeleton />}>
      <SessionDetailsClient />
    </Suspense>
  );
}
