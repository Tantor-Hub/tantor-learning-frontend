"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SecDocsData } from "../types";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
type Status = "completed" | "inProgress" | "waiting";

const SecDocsTabs = ({ data }: { data: SecDocsData }) => {
  const [selected, setSelected] = useState<Status>("waiting");
  return (
    <div className="overflow-auto w-full">
      <Tabs
        defaultValue="waiting"
        value={selected}
        onValueChange={(value) => setSelected(value as Status)}
        className="w-full min-w-[600px] bg-white border border-t rounded-lg shadow-sm"
      >
        <Table>
          <TabsList className="w-full">
            <TableHeader className="w-full">
              <TableRow className="grid grid-cols-8 md:grid-cols-10">
                <TableHead className="col-span-2">
                  <TabsTrigger value="waiting" className="w-full py-5">
                    En Attente
                  </TabsTrigger>
                </TableHead>
                <TableHead className="col-span-4 md:col-span-6">
                  <TabsTrigger value="inProgress" className="w-full py-5 ">
                    En traitement
                  </TabsTrigger>
                </TableHead>

                <TableHead className="col-span-2">
                  <TabsTrigger value="completed" className="w-full py-5 ">
                    Complétées
                  </TabsTrigger>
                </TableHead>
              </TableRow>
            </TableHeader>
          </TabsList>

          <TabsContent value={selected} className="w-full">
            <TableBody className="w-full flex flex-col">
              {data[selected].map((el, i) => (
                <TableRow key={i} className="grid grid-cols-10 px-2">
                  <TableCell className=" col-span-2">
                    <span className="inline-block text-transparent size-14 rounded-full bg-[#b9b7b7]"></span>
                  </TableCell>
                  <TableCell className="flex col-span-6 flex-col">
                    <h4 className="font-medium">{el.name}</h4>
                    <span className="text-xs">{el.id}</span>
                    <span className="text-xs">{el.date}</span>
                  </TableCell>
                  <TableCell className="flex items-center">
                    <span
                      className={`col-span-2 border rounded-full px-2.5 py-1 ${el.action == "Archiver" ? "bg-[#C8FFD9] text-[#059669] border-[#059669]" : el.action == "Traitement" ? "bg-[#C8E8FF] text-[#0466C8] border-[#0466C8]" : "bg-[#FFD6D6] text-[#D62828] border-[#D62828]"}`}
                    >
                      {el.action}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TabsContent>
        </Table>
      </Tabs>
    </div>
  );
};
export default SecDocsTabs;
