"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useGetMySessionsQuery, useGetAllTrainingsQuery } from "@/lib/apis/student/training-api";
import { AfterTab } from "./after";
import { Loading } from "@/components/shared/loading";
import { BeforeTab } from "./before";
import { useListUserByGroupQuery } from "@/lib/apis/admin/user-api";
import { DuringTab } from "./during";

export default function Page() {
  const listSessions = useGetAllTrainingsQuery();
  const students = useListUserByGroupQuery({ group: "student" });
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  if (listSessions.isLoading || students.isLoading) return <Loading />;

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
        <div className="flex justify-start mb-4">
          <Select
            onValueChange={(value) => setSelectedUserId(value)}
            value={selectedUserId || undefined}
          >
            <SelectTrigger className="min-w-[300px]">
              <SelectValue placeholder="Sélectionner un(e) élève" />
            </SelectTrigger>
            <SelectContent>
              {students.data?.data.list.map((student) => (
                <SelectItem key={student.id} value={String(student.id)}>
                  {`${student.fs_name} ${student.ls_name}` || "Inconnue"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-start mb-4">
          <Select
            onValueChange={(value) => setSelectedSession(value)}
            value={selectedSession || undefined}
          >
            <SelectTrigger className="min-w-[300px]">
              <SelectValue placeholder="Sélectionner une session" />
            </SelectTrigger>
            <SelectContent>
              {listSessions.data?.data.list.map((session) => (
                <SelectItem key={session.id} value={String(session.id)}>
                  {`${session.designation} - ${session.Formation.titre}` || "Session sans nom"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="before">
        <div className="overflow-x-auto">
          <TabsList className="flex min-w-[1000px] w-full bg-white border">
            <TabsTrigger value="before">Avant La Formation</TabsTrigger>
            <TabsTrigger value="during">Pendant La Formation</TabsTrigger>
            <TabsTrigger value="after">Après La Formation</TabsTrigger>
          </TabsList>

          <TabsContent value="before">
            <BeforeTab sessionId={selectedSession} studentId={selectedUserId} />
          </TabsContent>
          <TabsContent value="during">
            <DuringTab sessionId={selectedSession} studentId={selectedUserId} />
          </TabsContent>
          <TabsContent value="after">
            <AfterTab sessionId={selectedSession} studentId={selectedUserId} />
            {/* studentId={selectedUserId} */}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
