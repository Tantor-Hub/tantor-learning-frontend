import { TabsView } from "./tab-view";

export default function Page() {
  return (
    <div>
      <h2 className="text-primary text-xl font-semibold mb-3">Matières</h2>
      <p className="mb-8 font-light">
        Liste de toutes les matières disponibles dans la plateforme.
      </p>
      <TabsView />
    </div>
  );
}
