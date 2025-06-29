"use client";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useListCoursesBySessionIdQuery } from "@/lib/apis/student/training-api";
import { Loading } from "@/components/shared/loading";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filters, documentsData } from "../../courses/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BeforeTab } from "../documents/before-tab";
import { DuringTab } from "../documents/during-tab";
import { AfterTab } from "../documents/after-tab";
import { Plus, Upload, FileText, Download } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import { EmptyState } from "@/components/shared/empty-state";

export default function Page() {
  const params = useParams();
  const sessionId = params.id as string;
  const currentUser = useSelector(selectCurrentUser);
  const {
    data: courses,
    isLoading,
    isError,
  } = useListCoursesBySessionIdQuery({ id_session: sessionId.toString() }, { skip: !sessionId });

  const handleAddDocument = (phase: string) => {
    console.log(`Ajouter document pour ${phase}`);
    // Logique pour ajouter un document
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Section de recherche et filtres */}
      {courses!.data.rows.length > 0 && (
        <>
          <div className="flex flex-col sm:flex-row gap-5 md:gap-10 mb-5">
            <div className="flex items-center border px-2.5 w-full rounded-md bg-white shadow-sm">
              <Image src="/icons/search.svg" height={20} width={20} alt="search icon" />
              <Input
                type="search"
                className="text-[#ACACAC] border-none focus-visible:outline-none focus-visible:ring-0"
                placeholder="Rechercher Un cours ..."
              />
            </div>
            <div className="flex gap-2 items-center border px-2.5 py-1.5 min-w-28 rounded-md bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
              <Image src="/icons/filter.svg" height={20} width={20} alt="filter ico" />
              <span className="text-[#ACACAC]">Filtres</span>
            </div>
          </div>

          {/* Section des filtres */}
          <div className="border p-8 flex flex-col items-end gap-7 bg-white rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-10 w-full">
              {filters.map((filter, i) => (
                <div key={i} className="flex flex-col gap-[7px]">
                  <span className="font-medium text-gray-700">{filter.label}</span>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={filter.value} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="most-recent">{filter.value}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            <Button className="bg-transparent border border-[#cbd9e7] text-[#ACACAC] hover:bg-gray-50 transition-colors">
              <Image src="/icons/close.svg" height={20} width={20} alt="close icon" />
              Réinitialiser les filtres
            </Button>
          </div>
        </>
      )}

      {/* Section des cours */}
      {courses?.data.rows.length ? (
        <div className="py-5 grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-5">
          {courses?.data.rows.map((session, i) => (
            <div
              key={i}
              className="border border-blue-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              <div className="p-2.5">
                <Image
                  src="/icons/video-placeholder.svg"
                  width={200}
                  height={110}
                  alt="Aperçu du cours"
                  className="object-cover w-full h-auto rounded-md"
                />
                <div className="flex justify-between mt-2.5">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-xl ${
                      session.CreatedBy.email === "En direct"
                        ? "bg-[#E8F8ED] text-[#1BB66C]"
                        : session.CreatedBy.email === "Dans 2h"
                          ? "bg-[#FDF6E8] text-[#DFA100]"
                          : "bg-[#F1F5F9] text-[#334155]"
                    }`}
                  >
                    {session.id_formateur}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Image src="/icons/users.svg" alt="Participants" width={14} height={14} />
                    <span>{"49"} inscrits</span>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 space-y-2">
                <p className="text-sm text-[#0466C8] font-medium leading-tight">
                  {session.Title.title}
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gray-200 rounded-md" />
                  <div className="text-sm text-gray-800 flex flex-col">
                    <span className="text-[#0466C8]">{session.CreatedBy.fs_name}</span>
                    <span className="text-[10px] text-gray-500">Professeur</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10">
          <EmptyState
            icon="BookIcon"
            title="Aucun cours disponible"
            description="Il n'y a actuellement aucun cours à afficher."
          />
        </div>
      )}

      {/* Section des documents avec boutons d'action */}
      <div className="bg-white rounded-lg shadow-sm border">
        <Tabs defaultValue="before" className="w-full">
          <div className="border-b">
            <TabsList className="bg-transparent w-full justify-start p-0 h-auto">
              <TabsTrigger
                value="before"
                className="px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-[#0466C8] data-[state=active]:bg-transparent data-[state=active]:text-[#0466C8] font-semibold"
              >
                Avant La Formation
              </TabsTrigger>
              <TabsTrigger
                value="during"
                className="px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-[#0466C8] data-[state=active]:bg-transparent data-[state=active]:text-[#0466C8] font-semibold"
              >
                Pendant La Formation
              </TabsTrigger>
              <TabsTrigger
                value="after"
                className="px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-[#0466C8] data-[state=active]:bg-transparent data-[state=active]:text-[#0466C8] font-semibold"
              >
                Après La Formation
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="before" className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-[#0466C8] text-xl font-semibold mb-2">
                  Documents Avant La Formation
                </h2>
                <p className="text-gray-600 text-sm">
                  Gérez les documents nécessaires avant le début de la formation
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleAddDocument("before")}
                  className="bg-[#0466C8] hover:bg-[#0456b8] text-white flex items-center gap-2"
                >
                  <Plus size={16} />
                  Ajouter Document
                </Button>
              </div>
            </div>
            <BeforeTab id_session={Number(sessionId)} id_student={Number(currentUser!.id)} />
          </TabsContent>

          <TabsContent value="during" className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-[#0466C8] text-xl font-semibold mb-2">
                  Documents Pendant La Formation
                </h2>
                <p className="text-gray-600 text-sm">
                  Ressources et documents utilisés pendant la session de formation
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleAddDocument("before")}
                  className="bg-[#0466C8] hover:bg-[#0456b8] text-white flex items-center gap-2"
                >
                  <Plus size={16} />
                  Ajouter Document
                </Button>
              </div>
            </div>
            <DuringTab id_session={Number(sessionId)} id_student={Number(currentUser!.id)} />
          </TabsContent>

          <TabsContent value="after" className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-[#0466C8] text-xl font-semibold mb-2">
                  Documents Après La Formation
                </h2>
                <p className="text-gray-600 text-sm">
                  Certificats, évaluations et documents de suivi post-formation
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleAddDocument("after")}
                  className="bg-[#0466C8] hover:bg-[#0456b8] text-white flex items-center gap-2"
                >
                  <Plus size={16} />
                  Ajouter Document
                </Button>
              </div>
            </div>
            <AfterTab id_session={Number(sessionId)} id_student={Number(currentUser!.id)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
