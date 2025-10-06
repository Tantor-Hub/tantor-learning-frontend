"use client";

import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useListUserByRoleQuery } from "@/lib/apis/users-api";
import { UserRole } from "@/types/user";
import StudentTab from "./student-tab";
import InstructorTab from "./instructor-tab";
import SecretaryTab from "./secretary-tab";

export default function Page() {
  const studentsQuery = useListUserByRoleQuery({ role: UserRole.STUDENT });
  const instructorsQuery = useListUserByRoleQuery({ role: UserRole.INSTRUCTOR });
  const secretariesQuery = useListUserByRoleQuery({ role: UserRole.SECRETARY });

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold">Gestion des utilisateurs</p>
      </div>
      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students">Étudiants</TabsTrigger>
          <TabsTrigger value="instructors">Instructeurs</TabsTrigger>
          <TabsTrigger value="secretaries">Secrétaires</TabsTrigger>
        </TabsList>
        <TabsContent value="students">
          <Suspense fallback={<StudentTabSkeleton />}>
            <StudentTab
              data={studentsQuery.data?.data || []}
              isLoading={studentsQuery.isLoading}
              error={studentsQuery.error}
            />
          </Suspense>
        </TabsContent>
        <TabsContent value="instructors">
          <Suspense fallback={<InstructorTabSkeleton />}>
            <InstructorTab
              data={instructorsQuery.data?.data || []}
              isLoading={instructorsQuery.isLoading}
              error={instructorsQuery.error}
            />
          </Suspense>
        </TabsContent>
        <TabsContent value="secretaries">
          <Suspense fallback={<SecretaryTabSkeleton />}>
            <SecretaryTab
              data={secretariesQuery.data?.data || []}
              isLoading={secretariesQuery.isLoading}
              error={secretariesQuery.error}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </>
  );
}

function StudentTabSkeleton() {
  return <div>Skeleton for students</div>;
}

function InstructorTabSkeleton() {
  return <div>Skeleton for instructors</div>;
}

function SecretaryTabSkeleton() {
  return <div>Skeleton for secretaries</div>;
}
