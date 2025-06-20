import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseTable } from "./components/course-table";
import { AddCourseModal } from "./components/add-course-modal";
import { SeanceTable } from "./components/seance-table";
import { AddSeance } from "./components/add-seance";

export default function Page() {
  return (
    <Tabs defaultValue="courses" className="w-full">
      <TabsList className="bg-white border font-semibold px-2.5 py-6 grid-cols-1 gap-4">
        <TabsTrigger value="courses" className="p-5 px-2 md:px-5">
          COURS
        </TabsTrigger>
        <TabsTrigger value="seances" className="p-5 px-2 md:px-5">
          SÉANCES
        </TabsTrigger>
      </TabsList>
      <TabsContent value="courses">
        <div className="overflow-x-auto p-8 my-5 border rounded-md">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-primary text-xl font-semibold mb-3">
                Tous les cours disponibles
              </h2>
              <p className="mb-8 font-light">
                Gestion centralisée des cours : ajout, modification et suivi.
              </p>
            </div>
            <AddCourseModal />
          </div>
          <div>
            <div className="min-w-[1000px]">
              <CourseTable />
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="seances">
        <div className="overflow-x-auto p-8 shadow-md my-5 border border-border rounded-md bg-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-primary text-xl font-semibold mb-3">
                Toutes les séances disponibles
              </h2>
              <p className="mb-8 font-light">
                Gestion centralisée des séances : ajout, modification et suivi.
              </p>
            </div>
            <AddSeance />
          </div>
          <div>
            <div className="min-w-[1000px]">
              <SeanceTable />
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
