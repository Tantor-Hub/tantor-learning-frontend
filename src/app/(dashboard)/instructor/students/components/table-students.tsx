"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { Fragment, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import studentData from "../data";
import { Button } from "@/components/ui/button";
import { StudentDocsData } from "../types";

type Status = "all" | "inProgress" | "completed" | "needHelp";

const titleSubtitle = {
  all: {
    title: "Tous mes étudiants",
    subtitle: "Liste complète de tous vos étudiants enregistrés",
  },
  inProgress: {
    title: "Étudiants actifs",
    subtitle: "Étudiants actuellement engagés dans un programme ou une formation",
  },
  completed: {
    title: "Étudiants ayant terminés",
    subtitle: "Ceux ayant terminé leurs formations ou parcours",
  },
  needHelp: {
    title: "Étudiants avec bésoin d'aide",
    subtitle: "Étudiants qui ont besoin d’assistance ou de suivi",
  },
};

const StudentsTabs = ({ data = studentData }: { data?: StudentDocsData }) => {
  const [selected, setSelected] = useState<Status>("all");

  const getProgressBarColor = (action: string) => {
    return action === "Actif"
      ? "bg-green-500"
      : action === "Traitement"
        ? "bg-blue-500"
        : action === "Terminé"
          ? "bg-yellow-500"
          : "bg-red-500";
  };

  return (
    <div className="overflow-auto w-full">
      <div className="flex justify-between mb-4">
        <Tabs
          defaultValue="waiting"
          value={selected}
          onValueChange={(value) => setSelected(value as Status)}
          className="w-full bg-white rounded-lg text-sm"
        >
          <div className="flex">
            <TabsList className="h-auto p-0 bg-gray-100">
              <TabsTrigger value="all" className="px-7 py-2">
                Tous
              </TabsTrigger>
              <TabsTrigger value="inProgress" className="px-7 py-2">
                Actifs
              </TabsTrigger>
              <TabsTrigger value="completed" className="px-7 py-2">
                Terminés
              </TabsTrigger>
              <TabsTrigger value="needHelp" className="px-7 py-2">
                Besoin d'aide
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4">
              <h2 className="text-primary text-xl font-semibold mb-3">
                {titleSubtitle[selected].title}
              </h2>
              <p className="text-sm text-gray-500">{titleSubtitle[selected].subtitle}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 p-3 w-fit">
              <Button
                variant={"outline"}
                className="p-5 text-sm text-[#0466C8] border border-[#0466C8] rounded-md"
              >
                Voir le temps d'étude
              </Button>
              <Button className="p-5 text-sm text-white bg-[#0466C8] rounded-md">
                Faire l'appel
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 grid grid-cols-8">
                <TableHead className="font-medium text-black flex items-center">Nom</TableHead>
                <TableHead className="font-medium text-black flex items-center col-span-2">
                  Email
                </TableHead>
                <TableHead className="font-medium text-black flex items-center">Matière</TableHead>
                <TableHead className="font-medium text-black flex items-center">
                  Progression
                </TableHead>
                <TableHead className="font-medium text-black flex items-center">Statut</TableHead>
                <TableHead className="font-medium text-black flex items-center">
                  Date de connexion
                </TableHead>
                <TableHead className="font-medium text-black flex items-center">Adresse</TableHead>
              </TableRow>
            </TableHeader>

            <TabsContent value={selected} className="m-0">
              <TableBody>
                {data[selected]?.map((student, i) => (
                  <TableRow key={i} className="border-b grid grid-cols-8">
                    <TableCell className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <p className="font-medium text-sm">
                        {student.name.split(" ").map((el, i) => (
                          <Fragment key={i}>
                            {el}
                            <br />
                          </Fragment>
                        ))}
                      </p>
                    </TableCell>
                    <TableCell className="col-span-2">
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-2 rounded-full ${getProgressBarColor(student.action)}`}
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span>{student.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          student.action === "Actif"
                            ? "bg-green-100 text-green-600 border border-green-600"
                            : student.action === "Traitement"
                              ? "bg-blue-100 text-blue-600 border border-blue-600"
                              : student.action === "Terminé"
                                ? "bg-yellow-100 text-yellow-600 border border-yellow-600"
                                : "bg-red-100 text-red-600 border border-red-600"
                        }`}
                      >
                        {student.action}
                      </span>
                    </TableCell>
                    <TableCell>{student.lastConnection}</TableCell>
                    <TableCell>{student.city}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TabsContent>
          </Table>
        </Tabs>
      </div>

      <div className="flex md:justify-end gap-2.5">
        <Button
          variant="outline"
          className="px-4 py-2 text-[#0466C8] border border-[#0466C8] rounded"
        >
          Précédent
        </Button>
        <Button className="px-4 py-2 text-white bg-[#0466C8] rounded">Suivant</Button>
      </div>
    </div>
  );
};

export default StudentsTabs;
