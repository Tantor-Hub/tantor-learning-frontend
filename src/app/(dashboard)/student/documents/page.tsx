"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Image from "next/image";
import { BookOpen, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

import { filters, documentsData } from "../courses/data";
import { DocsTab } from "../courses/types";

export default function StudentDashboard() {
  const [activeDocs, setActiveDocs] = useState<DocsTab>("all");
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-5 md:gap-10 mb-5">
        <div className="flex items-center border px-2.5 w-full rounded-md bg-white">
          <Image src="/icons/search.svg" height={20} width={20} alt="search icon" />
          <Input
            type="search"
            className="text-[#ACACAC] border-none focus-visible:outline-none focus-visible:ring-0"
            placeholder="Rechercher Un cours ..."
          />
        </div>
        <div className="flex gap-2 items-center border px-2.5 py-1.5 min-w-28 rounded-md bg-white">
          <Image src="/icons/filter.svg" height={20} width={20} alt="filter ico" />
          <span className="text-[#ACACAC]">Filtres</span>
        </div>
      </div>
      <div className="border p-8 flex flex-col items-end gap-7 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-10 w-full">
          {filters.map((filter, i) => (
            <div key={i} className="flex flex-col gap-[7px]">
              <span>{filter.label}</span>
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
        <Button className="bg-transparent border border-[#cbd9e7] text-[#ACACAC]">
          <Image src="/icons/close.svg" height={20} width={20} alt="close icon" />
          Renitialiser les filtres
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={(val) => setActiveDocs(val as DocsTab)}>
        <div className="overflow-x-auto bg-white p-8 shadow-md shadow-gray-300 my-5">
          <TabsList className="flex w-full min-w-[1000px] mb-4 shadow-md shadow-gray-300 border-t  border-gray-50 bg-gray-100">
            <TabsTrigger value="all" className="flex-[1] py-5 rounded-xl">
              Tous les documents
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex-[1] py-5 rounded-xl">
              Partagés avec moi
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex-[1] py-5 rounded-xl">
              Récents
            </TabsTrigger>
          </TabsList>
          <h2 className="text-[#0466C8] text-[18px] font-semibold mb-2.5">
            {documentsData[activeDocs]?.[0]?.title}
          </h2>
          {(["all", "shared", "recent"] as DocsTab[]).map((key) => (
            <TabsContent key={key} value={key}>
              <div className="min-w-[1000px]">
                <Table>
                  <TableHeader>
                    <TableRow className="grid grid-cols-7 text-sm font-medium text-gray-500 px-4 py-2 rounded-t-lg bg-gray-100 mb-1">
                      <TableHead className="col-span-2">Noms</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Taille</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentsData[key].length <= 1 ? (
                      <p className="text-center text-gray-500 mt-4">Aucun document</p>
                    ) : (
                      documentsData[key].map((doc, i) => (
                        <TableRow
                          key={i}
                          className="grid grid-cols-7 items-center px-4 py-3 border-b text-sm text-gray-800 hover:bg-gray-50 transition shadow-sm bg-white mb-1"
                        >
                          <TableCell className="col-span-2">
                            {"name" in doc ? doc.name : "-"}
                          </TableCell>
                          <TableCell>
                            <span className="text-xs border px-2 py-0.5 rounded-full text-blue-600 border-blue-200">
                              {"type" in doc ? doc.type : "-"}
                            </span>
                          </TableCell>
                          <TableCell>{"size" in doc ? doc.size : "-"}</TableCell>
                          <TableCell>{"date" in doc ? doc.date : "-"}</TableCell>
                          <TableCell>{"category" in doc ? doc.category : "-"}</TableCell>
                          <TableCell className="flex items-center gap-3 text-blue-600">
                            <BookOpen size={16} />
                            <Download size={16} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>

      {/* Section des documents avec boutons d'action */}

      {/* <div className="bg-white rounded-lg shadow-sm border">
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
      </div> */}
    </div>
  );
}
