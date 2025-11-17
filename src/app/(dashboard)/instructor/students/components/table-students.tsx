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
import { Button } from "@/components/ui/button";
import { useGetStudentsAttendanceQuery } from "@/lib/apis/events";
import Image from "next/image";

type Status = "all" | "excellent" | "strong" | "average" | "weak" | "very_weak";

const titleSubtitle = {
  all: {
    title: "Tous mes étudiants",
    subtitle: "Liste complète de tous vos étudiants enregistrés",
  },
  excellent: {
    title: "Étudiants excellents",
    subtitle: "Étudiants avec une progression excellente (80-100%)",
  },
  strong: {
    title: "Étudiants forts",
    subtitle: "Étudiants avec une bonne progression (60-79%)",
  },
  average: {
    title: "Étudiants moyens",
    subtitle: "Étudiants avec une progression moyenne (40-59%)",
  },
  weak: {
    title: "Étudiants faibles",
    subtitle: "Étudiants avec une progression faible (20-39%)",
  },
  very_weak: {
    title: "Étudiants très faibles",
    subtitle: "Étudiants avec une progression très faible (0-19%)",
  },
};

const StudentsTabs = () => {
  const [selected, setSelected] = useState<Status>("all");
  const { data: attendanceData, isLoading, error } = useGetStudentsAttendanceQuery();

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
              <TabsTrigger value="excellent" className="px-7 py-2">
                Excellents
              </TabsTrigger>
              <TabsTrigger value="strong" className="px-7 py-2">
                Forts
              </TabsTrigger>
              <TabsTrigger value="average" className="px-7 py-2">
                Moyens
              </TabsTrigger>
              <TabsTrigger value="weak" className="px-7 py-2">
                Faibles
              </TabsTrigger>
              <TabsTrigger value="very_weak" className="px-7 py-2">
                Très faibles
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
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 grid grid-cols-5">
                <TableHead className="font-medium text-black flex items-center">Nom</TableHead>
                <TableHead className="font-medium text-black flex items-center col-span-2">
                  Email
                </TableHead>
                <TableHead className="font-medium text-black flex items-center">Matière</TableHead>
                <TableHead className="font-medium text-black flex items-center">
                  Progression
                </TableHead>
              </TableRow>
            </TableHeader>

            <TabsContent value={selected} className="m-0">
              <TableBody>
                {attendanceData?.data.rows
                  .filter((student) => {
                    if (selected === "all") return true;
                    return student.progressionStatus === selected;
                  })
                  .map((student, i) => (
                    <TableRow key={i} className="border-b grid grid-cols-5">
                      <TableCell className="flex items-center gap-3">
                        <Image
                          src={student.studentAvatar}
                          alt={student.studentName}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full"
                        />
                        <p className="font-medium text-sm">
                          {student.studentName.split(" ").map((el, idx) => (
                            <Fragment key={idx}>
                              {el}
                              <br />
                            </Fragment>
                          ))}
                        </p>
                      </TableCell>
                      <TableCell className="col-span-2">
                        <p className="text-sm text-gray-500">{student.studentEmail}</p>
                      </TableCell>
                      <TableCell>{student.sessionCoursTitle}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${student.progression}%` }}
                            ></div>
                          </div>
                          <span>{student.progression}%</span>
                        </div>
                      </TableCell>
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
