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

const TableUser = ({ userData }: { userData: UserData }) => {
  return (
    <Tabs defaultValue="allUsers">
      <div className="overflow-x-auto">
        <TabsList className="mt-10 mb-8 px-2.5 py-6 bg-white font-semibold">
          <TabsTrigger value="allUsers" className="p-5 px-2 md:px-5">
            Tous
          </TabsTrigger>
          <TabsTrigger value="students" className="p-5 px-2 md:px-5">
            Etudiants
          </TabsTrigger>
          <TabsTrigger value="instructors" className="p-5 px-2 md:px-5">
            Formateurs
          </TabsTrigger>
          <TabsTrigger value="secretaries" className="p-5 px-2 md:px-5">
            Secrétaires
          </TabsTrigger>
        </TabsList>
      </div>

      {(["allUsers", "students", "instructors", "secretaries"] as const).map((el, i) => (
        <TabsContent
          key={i}
          value={el}
          className="bg-white flex flex-col rounded-md gap-10 p-5 md:p-10"
        >
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[#0466C8] text-xl font-semibold">{userData.tableInfo[el].title}</h3>
            <p className="text-[#33415C] font-medium">{userData.tableInfo[el].description}</p>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader>
                  <TableRow className="grid grid-cols-7 text-sm font-medium text-gray-500 px-4 py-2 rounded-t-lg bg-gray-100 mb-1">
                    <TableHead>Nom</TableHead>
                    <TableHead className="col-span-2">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dernière mis-à-jour</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userData[el].map((data, j) => (
                    <TableRow
                      key={data.id + j + i}
                      className="grid grid-cols-7 items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 transition bg-white mb-1"
                    >
                      <TableCell>{data.nom}</TableCell>
                      <TableCell className="text-wrap col-span-2">{data.email}</TableCell>
                      <TableCell>{data.role}</TableCell>
                      <TableCell>{data.status}</TableCell>
                      <TableCell>{data.lastUpdate}</TableCell>
                      <TableCell>...</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
export default TableUser;
