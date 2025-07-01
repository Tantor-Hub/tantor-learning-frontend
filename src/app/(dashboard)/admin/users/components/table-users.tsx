import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserData } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListUsersQuery } from "@/lib/apis/admin/user-api";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function TableUser({ userData }: { userData: UserData }) {
  const { data: apiData, isLoading, isError, error, refetch } = useListUsersQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-160px)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-160px)]">
        <div className="flex flex-col items-center gap-4 p-4 max-w-md text-center">
          <p className="text-destructive">
            {"Impossible de charger les utilisateurs. Veuillez réessayer plus tard."}
          </p>
          <Button onClick={() => refetch()} variant="outline" size="lg">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  // Filtrer les utilisateurs par rôle
  const filterUsersByRole = (role: string) => {
    return apiData?.data.rows.filter((user) =>
      user.roles.some((userRole) => userRole.role.toLowerCase().includes(role.toLowerCase()))
    );
  };

  const allUsers = apiData?.data.rows || [];
  const students = filterUsersByRole("étudiant") || [];
  const instructors = filterUsersByRole("formateur") || [];
  const secretaries = filterUsersByRole("secrétariat") || [];

  return (
    <Tabs defaultValue="allUsers">
      <div className="overflow-x-auto">
        <TabsList className="mt-10 mb-8 px-2.5 py-6 bg-white border font-semibold">
          <TabsTrigger value="allUsers" className="p-5 px-2 md:px-5">
            Tous ({allUsers.length})
          </TabsTrigger>
          <TabsTrigger value="students" className="p-5 px-2 md:px-5">
            Etudiants ({students.length})
          </TabsTrigger>
          <TabsTrigger value="instructors" className="p-5 px-2 md:px-5">
            Formateurs ({instructors.length})
          </TabsTrigger>
          <TabsTrigger value="secretaries" className="p-5 px-2 md:px-5">
            Secrétaires ({secretaries.length})
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        value="allUsers"
        className="bg-white border flex flex-col rounded-md gap-10 p-5 md:p-10"
      >
        <div className="flex flex-col gap-2.5">
          <h3 className="text-[#0466C8] text-xl font-semibold">
            {userData.tableInfo.allUsers.title}
          </h3>
          <p className="text-[#33415C] font-medium">{userData.tableInfo.allUsers.description}</p>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {allUsers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="grid grid-cols-7 text-sm font-medium text-gray-500 px-4 py-2 rounded-t-lg bg-gray-100 mb-1">
                    <TableHead>Nom</TableHead>
                    <TableHead className="col-span-2">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allUsers.map((data) => (
                    <TableRow
                      key={data.id}
                      className="grid grid-cols-7 items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 transition bg-white mb-1"
                    >
                      <TableCell>{data.nick_name}</TableCell>
                      <TableCell className="text-wrap col-span-2">{data.email}</TableCell>
                      <TableCell>{data.roles[0].role}</TableCell>
                      <TableCell>...</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10 text-gray-500">Aucun utilisateur trouvé</div>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent
        value="students"
        className="bg-white border flex flex-col rounded-md gap-10 p-5 md:p-10"
      >
        <div className="flex flex-col gap-2.5">
          <h3 className="text-[#0466C8] text-xl font-semibold">
            {userData.tableInfo.students.title}
          </h3>
          <p className="text-[#33415C] font-medium">{userData.tableInfo.students.description}</p>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {students.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="grid grid-cols-7 text-sm font-medium text-gray-500 px-4 py-2 rounded-t-lg bg-gray-100 mb-1">
                    <TableHead>Nom</TableHead>
                    <TableHead className="col-span-2">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((data) => (
                    <TableRow
                      key={data.id}
                      className="grid grid-cols-7 items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 transition bg-white mb-1"
                    >
                      <TableCell>{data.nick_name}</TableCell>
                      <TableCell className="text-wrap col-span-2">{data.email}</TableCell>
                      <TableCell>{data.roles[0].role}</TableCell>
                      <TableCell>...</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10 text-gray-500">Aucun étudiant trouvé</div>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent
        value="instructors"
        className="bg-white border flex flex-col rounded-md gap-10 p-5 md:p-10"
      >
        <div className="flex flex-col gap-2.5">
          <h3 className="text-[#0466C8] text-xl font-semibold">
            {userData.tableInfo.instructors.title}
          </h3>
          <p className="text-[#33415C] font-medium">{userData.tableInfo.instructors.description}</p>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {instructors.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="grid grid-cols-7 text-sm font-medium text-gray-500 px-4 py-2 rounded-t-lg bg-gray-100 mb-1">
                    <TableHead>Nom</TableHead>
                    <TableHead className="col-span-2">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instructors.map((data) => (
                    <TableRow
                      key={data.id}
                      className="grid grid-cols-7 items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 transition bg-white mb-1"
                    >
                      <TableCell>{data.nick_name}</TableCell>
                      <TableCell className="text-wrap col-span-2">{data.email}</TableCell>
                      <TableCell>{data.roles[0].role}</TableCell>
                      <TableCell>...</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10 text-gray-500">Aucun formateur trouvé</div>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent
        value="secretaries"
        className="bg-white border flex flex-col rounded-md gap-10 p-5 md:p-10"
      >
        <div className="flex flex-col gap-2.5">
          <h3 className="text-[#0466C8] text-xl font-semibold">
            {userData.tableInfo.secretaries.title}
          </h3>
          <p className="text-[#33415C] font-medium">{userData.tableInfo.secretaries.description}</p>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {secretaries.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="grid grid-cols-7 text-sm font-medium text-gray-500 px-4 py-2 rounded-t-lg bg-gray-100 mb-1">
                    <TableHead>Nom</TableHead>
                    <TableHead className="col-span-2">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {secretaries.map((data) => (
                    <TableRow
                      key={data.id}
                      className="grid grid-cols-7 items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 transition bg-white mb-1"
                    >
                      <TableCell>{data.nick_name}</TableCell>
                      <TableCell className="text-wrap col-span-2">{data.email}</TableCell>
                      <TableCell>{data.roles[0].role}</TableCell>
                      <TableCell>...</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10 text-gray-500">Aucun secrétaire trouvé</div>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
