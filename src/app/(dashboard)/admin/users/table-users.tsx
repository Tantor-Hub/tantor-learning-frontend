import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserData, userData } from "./data";
import { useListUsersQuery, useListSubscribersQuery } from "@/lib/apis/admin/user-api";
import { useSearchParams } from "next/navigation";
import AllUsersTab from "./tabs/all-users";
import AdminTab from "./tabs/admin";
import StudentsTab from "./tabs/students";
import InstructorsTab from "./tabs/instructors";
import SecretariesTab from "./tabs/secretaries";
import SubscribersTab from "./tabs/subscribers";

export default function TableUser({ userData }: { userData: UserData }) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  let tab = "allUsers";
  if (tabParam === "student") tab = "students";
  else if (tabParam === "instructor") tab = "instructors";
  else if (tabParam === "secretary") tab = "secretaries";
  else if (tabParam === "subscriber") tab = "subscribers";
  else if (tabParam === "admin") tab = "admin";

  // Get counts for tab labels
  const { data: apiData } = useListUsersQuery();
  const { data: subscribersData } = useListSubscribersQuery();

  const allUsers = apiData?.data.rows ?? [];
  const students = allUsers.filter((user) => user.role === "student");
  const instructors = allUsers.filter((user) => user.role === "instructor");
  const secretaries = allUsers.filter((user) => user.role === "secretary");
  const admins = allUsers.filter((user) => user.role === "admin");
  const subscribers = subscribersData?.data.list ?? [];

  return (
    <Tabs defaultValue={tab}>
      <div className="overflow-x-auto">
        <TabsList className="my-4 py-4 px-2.5 bg-white border font-semibold">
          <TabsTrigger value="allUsers" className="p-3.5">
            Tous ({allUsers.length})
          </TabsTrigger>
          <TabsTrigger value="admin" className="p-3.5">
            Administrateurs ({admins.length})
          </TabsTrigger>
          <TabsTrigger value="students" className="p-3.5">
            Etudiants ({students.length})
          </TabsTrigger>
          <TabsTrigger value="instructors" className="p-3.5">
            Formateurs ({instructors.length})
          </TabsTrigger>
          <TabsTrigger value="secretaries" className="p-3.5">
            Secrétaires ({secretaries.length})
          </TabsTrigger>
          <TabsTrigger value="subscribers" className="p-3.5">
            Abonnés ({subscribers.length})
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="allUsers">
        <AllUsersTab
          title={userData.tableInfo.allUsers.title}
          description={userData.tableInfo.allUsers.description}
        />
      </TabsContent>

      <TabsContent value="admin">
        <AdminTab
          title={userData.tableInfo.admin.title}
          description={userData.tableInfo.admin.description}
        />
      </TabsContent>

      <TabsContent value="students">
        <StudentsTab
          title={userData.tableInfo.students.title}
          description={userData.tableInfo.students.description}
        />
      </TabsContent>

      <TabsContent value="instructors">
        <InstructorsTab
          title={userData.tableInfo.instructors.title}
          description={userData.tableInfo.instructors.description}
        />
      </TabsContent>

      <TabsContent value="secretaries">
        <SecretariesTab
          title={userData.tableInfo.secretaries.title}
          description={userData.tableInfo.secretaries.description}
        />
      </TabsContent>

      <TabsContent value="subscribers">
        <SubscribersTab
          title={userData.tableInfo.subscribers.title}
          description={userData.tableInfo.subscribers.description}
        />
      </TabsContent>
    </Tabs>
  );
}
