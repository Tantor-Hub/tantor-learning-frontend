import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserData } from "./data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { useListUsersQuery, useListSubscribersQuery } from "@/lib/apis/admin/user-api";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/shared/loading";
import { Ellipsis } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";

export default function TableUser({ userData }: { userData: UserData }) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  let tab = "allUsers";
  if (tabParam === "student") tab = "students";
  else if (tabParam === "instructor") tab = "instructors";
  else if (tabParam === "secretary") tab = "secretaries";
  else if (tabParam === "subscriber") tab = "subscribers";
  else if (tabParam === "admin") tab = "allUsers";

  const { data: apiData, isLoading, isError, refetch } = useListUsersQuery();
  const {
    data: subscribersData,
    isLoading: isSubscribersLoading,
    isError: isSubscribersError,
    refetch: refetchSubscribers,
  } = useListSubscribersQuery();

  if (isLoading) return <Loading />;

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
    return apiData?.data.rows.filter((user) => user.role === role);
  };

  const allUsers = apiData?.data.rows ?? [];
  const students = filterUsersByRole("student") ?? [];
  const instructors = filterUsersByRole("instructor") ?? [];
  const secretaries = filterUsersByRole("secretary") ?? [];
  const subscribers = subscribersData?.data.list ?? [];

  return (
    <Tabs defaultValue={tab}>
      <div className="overflow-x-auto">
        <TabsList className="my-4 py-4 px-2.5 bg-white border font-semibold">
          <TabsTrigger value="allUsers" className="p-3.5">
            Tous ({allUsers.length})
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
                <TableCaption>Liste de tous les utilisateurs</TableCaption>
                <TableHeader className="border">
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border">
                  {allUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.firstName || "Inconnu"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell className="flex items-center justify-center">
                        <Badge variant="secondary">
                          <Ellipsis />
                        </Badge>
                      </TableCell>
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
                <TableCaption>Liste de tous les étudiants</TableCaption>
                <TableHeader className="border">
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border">
                  {students.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.firstName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell className="flex items-center justify-center">
                        <Badge variant="secondary">
                          <Ellipsis />
                        </Badge>
                      </TableCell>
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
                <TableCaption>Liste de tous les Formateurs</TableCaption>
                <TableHeader className="border">
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border">
                  {instructors.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.firstName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell className="flex items-center justify-center">
                        <Badge variant="secondary">
                          <Ellipsis />
                        </Badge>
                      </TableCell>
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
                <TableCaption>Liste de tous les Sécretaires</TableCaption>
                <TableHeader className="border">
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border">
                  {secretaries.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.firstName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell className="flex items-center justify-center">
                        <Badge variant="secondary">
                          <Ellipsis />
                        </Badge>
                      </TableCell>
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

      <TabsContent
        value="subscribers"
        className="bg-white border flex flex-col rounded-md gap-10 p-5 md:p-10"
      >
        <div className="flex flex-col gap-2.5">
          <h3 className="text-[#0466C8] text-xl font-semibold">Abonnés</h3>
          <p className="text-[#33415C] font-medium">Liste des emails des abonnés à la newsletter</p>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {isSubscribersLoading ? (
              <Loading />
            ) : isSubscribersError ? (
              <div className="text-center py-10 text-red-500">
                Impossible de charger les abonnés. Veuillez réessayer plus tard.
              </div>
            ) : subscribers.length > 0 ? (
              <>
                <Button
                  className="mb-4"
                  onClick={() => {
                    const csvContent =
                      "data:text/csv;charset=utf-8," +
                      subscribers.map((sub) => sub.user_email).join(";");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", "abonnees.csv");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Télécharger CSV
                </Button>
                <Table>
                  <TableCaption>Liste des abonnés</TableCaption>
                  <TableHeader className="border">
                    <TableRow>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="border">
                    {subscribers.map((subscriber) => (
                      <TableRow key={subscriber.id}>
                        <TableCell>{subscriber.user_email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : (
              <div className="text-center py-10 text-gray-500">Aucun abonné trouvé</div>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
