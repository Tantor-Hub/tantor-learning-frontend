import { TabsView } from "./tab-view";
export default function Page() {
  return (
    <div className="border-red-500">
      <h2 className="text-primary text-xl font-semibold mb-3">Matières</h2>
      <p className="mb-8 font-light">
        Liste de toutes les matières disponibles dans la plateforme.
      </p>
      <div></div>
      <TabsView />
    </div>
  );
}
