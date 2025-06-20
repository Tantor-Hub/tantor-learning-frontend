"use client";
import { useState } from "react";
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
import { filters, sessionCourses, documentsData } from "./data";
import { DocsTab } from "./types";
import CourseTab from "./components/courses-tab";
import { Search, Funnel, ChevronDown, ArrowDownToLine } from "lucide-react";
import { CourseTabView } from "../components/course-tabview";

export default function Page() {
  const [activeDocs, setActiveDocs] = useState<DocsTab>("all");
  return (
    <div>
      <CourseTabView />
      {/* <CourseTabView /> */}

      {/* <Tabs defaultValue="all" onValueChange={(val) => setActiveDocs(val as DocsTab)}>
        <div className="overflow-x-auto bg-white p-8 shadow-md mb-5">
          <TabsList className="mt-10 mb-8 px-2.5 py-6 bg-red-500 font-semibold">
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
      </Tabs> */}

      {/* <CourseTab spec={"Progression des vos cours actuels"} /> */}
    </div>
  );
}
