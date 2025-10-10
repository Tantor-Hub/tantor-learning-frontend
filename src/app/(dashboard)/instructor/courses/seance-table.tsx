import { EmptyState } from "@/components/shared/empty-state";

export function SeanceTable() {
  return (
    <EmptyState
      icon="Database"
      title="Pas des données"
      description="Il n'y a pas des données pour maintenant"
    />
  );
}
