"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseTable } from "./course-table";
import { CourseSessionId } from "./course-session-id-table";
import { BookOpen, School } from "lucide-react";
import { useGetAllTrainingsQuery } from "@/lib/apis/public/public-api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function Page() {
  const { data: sessionsData, isLoading: isLoadingSessions } = useGetAllTrainingsQuery();
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");

  // Extract sessions list from the API response
  const sessionsList = sessionsData?.data?.list || [];

  return (
    <Tabs defaultValue="courses" className="w-full">
      <TabsList className="bg-white border font-semibold px-2.5 py-6 grid-cols-1 gap-4">
        <TabsTrigger value="courses" className="p-5 px-2 md:px-5">
          <BookOpen /> Tous les Cours
        </TabsTrigger>
        <TabsTrigger value="seances" className="p-5 px-2 md:px-5">
          <School /> Par Session
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
                Toutes les cours par session
              </h2>
              <p className="mb-8 font-light">Voir le cours par session</p>
            </div>
            <div className="w-[300px]">
              <Select
                value={selectedSessionId}
                onValueChange={(value) => setSelectedSessionId(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une session" />
                </SelectTrigger>
                <SelectContent>
                  {sessionsList.map((session: any) => (
                    <SelectItem key={session.id} value={session.id.toString()}>
                      {session.Formation.titre} - {session.designation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <div className="min-w-[1000px]">
              {selectedSessionId ? (
                <CourseSessionId id_session={selectedSessionId} />
              ) : (
                <div className="text-center py-10 text-gray-500">
                  Veuillez sélectionner une session pour afficher les cours
                </div>
              )}
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
