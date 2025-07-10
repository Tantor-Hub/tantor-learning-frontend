import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseTab } from "./course-tab";
import { RoleTab } from "./role-tab";

export function TabsView() {
  return (
    <Tabs defaultValue="courses" className="w-full">
      <TabsList className="px-2.5 py-6 bg-white border font-semibold">
        <TabsTrigger value="courses" className="p-5 px-2 md:px-5">
          Cours
        </TabsTrigger>
        <TabsTrigger value="roles" className="p-5 px-2 md:px-5">
          Rôles
        </TabsTrigger>
      </TabsList>
      <TabsContent value="courses">
        <div className="overflow-x-auto p-8 shadow-md my-5 border border-border rounded-md bg-white">
          <h2 className="text-primary text-xl font-semibold mb-3">Tous les cours</h2>
          <p className="mb-8 font-light">Liste de tous les cours disponibles dans la plateforme.</p>
          <div>
            <div className="min-w-[1000px]">
              <CourseTab />
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="roles">
        <div className="overflow-x-auto p-8 shadow-md my-5 border border-border rounded-md bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-primary text-xl font-semibold mb-3">Gestion des rôles</h2>
              <p className="mb-8 font-light">
                Visualisez et gérez tous les rôles d’utilisateurs disponibles dans l’application.
              </p>
            </div>
          </div>
          <div>
            <div className="min-w-[1000px]">
              <RoleTab />
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
