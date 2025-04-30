import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Funnel, ArrowDownToLine, ChevronDown, Plus } from "lucide-react";
import { TabsView } from "./tab-view";
import { CreateCourse } from "./create-course";

export default function Page() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-3">
          <p className="font-medium">Gérez tous les cours disponibles sur la plateforme</p>
          <div className="flex items-center w-full rounded-md relative flex-1 bg-white">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} />
            </div>
            <Input
              type="search"
              placeholder="Rechercher Un document..."
              className="pl-10 pr-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <CreateCourse />
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border border-primary text-primary">
              <Funnel size={20} />
              Exporter
            </Button>
            <Button variant="outline" className="border border-primary text-primary">
              <Funnel size={20} />
              Filters
              <ChevronDown />
            </Button>
          </div>
        </div>
      </div>

      {/* Tab View */}
      <TabsView />
    </>
  );
}
