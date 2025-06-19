import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { documentsData } from "../../student/courses/data";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CourseTable } from "./components/course-table";
import { AddCourseModal } from "./components/add-course-modal";

export function TabsView() {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="w-full mb-8 px-2.5 py-6 bg-white border font-semibold">
        <TabsTrigger value="all" className="p-5 px-2 md:px-5">
          COURS
        </TabsTrigger>
        <TabsTrigger value="actifs" className="p-5 px-2 md:px-5">
          SÉANCES
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <div className="overflow-x-auto p-8 my-5 border rounded-md">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-primary text-xl font-semibold mb-3">
                Tous les cours disponibles
              </h2>
              <p className="mb-8 font-light">
                Gestion centralisée des cours : ajout, modification et suivi.
              </p>
            </div>
            <AddCourseModal />
          </div>
          <div>
            <div className="min-w-[1000px]">
              <CourseTable />
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="actifs">
        <div className="overflow-x-auto p-8 shadow-md my-5 border border-border rounded-md bg-white">
          <h2 className="text-primary text-xl font-semibold mb-3">Cours actifs</h2>
          <p className="mb-8 font-light">
            Tous les cours actuellement actifs et disponibles aux étudiants
          </p>
          <div>
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader>
                  <TableRow className="grid grid-cols-7 text-sm font-medium text-gray-500 px-4 py-2 rounded-t-lg bg-gray-100 mb-1">
                    <TableHead className="col-span-2">Noms</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Signature</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentsData["all"].length <= 1 ? (
                    <p className="text-center text-gray-500 mt-4">Aucun document</p>
                  ) : (
                    documentsData["all"].map((doc, i) => (
                      <TableRow
                        key={i}
                        className="grid grid-cols-7 items-center px-4 py-3 border-b text-sm text-gray-800 hover:bg-gray-50 transition shadow-sm bg-white mb-1"
                      >
                        <TableCell className="col-span-2">{doc.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {" "}
                          <Checkbox id="terms" />
                        </TableCell>
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
          </div>
        </div>
      </TabsContent>
      <TabsContent value="brouillon">
        <div className="overflow-x-auto p-8 shadow-md my-5 border border-border rounded-md bg-white">
          <h2 className="text-primary text-xl font-semibold mb-3">Cours actifs</h2>
          <p className="mb-8 font-light">
            Tous les cours actuellement actifs et disponibles aux étudiants
          </p>
          <div>
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader>
                  <TableRow className="grid grid-cols-7 text-sm font-medium text-gray-500 px-4 py-2 rounded-t-lg bg-gray-100 mb-1">
                    <TableHead className="col-span-2">Noms</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Signature</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentsData["all"].length <= 1 ? (
                    <p className="text-center text-gray-500 mt-4">Aucun document</p>
                  ) : (
                    documentsData["all"].map((doc, i) => (
                      <TableRow
                        key={i}
                        className="grid grid-cols-7 items-center px-4 py-3 border-b text-sm text-gray-800 hover:bg-gray-50 transition shadow-sm bg-white mb-1"
                      >
                        <TableCell className="col-span-2">{doc.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {" "}
                          <Checkbox id="terms" />
                        </TableCell>
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
          </div>
        </div>
      </TabsContent>

      <TabsContent value="archives">
        <div className="overflow-x-auto p-8 shadow-md my-5 border border-border rounded-md bg-white">
          <h2 className="text-primary text-xl font-semibold mb-3">Cours actifs</h2>
          <p className="mb-8 font-light">
            Tous les cours actuellement actifs et disponibles aux étudiants
          </p>
          <div>
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader>
                  <TableRow className="grid grid-cols-7 text-sm font-medium text-gray-500 px-4 py-2 rounded-t-lg bg-gray-100 mb-1">
                    <TableHead className="col-span-2">Noms</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Signature</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentsData["all"].length <= 1 ? (
                    <p className="text-center text-gray-500 mt-4">Aucun document</p>
                  ) : (
                    documentsData["all"].map((doc, i) => (
                      <TableRow
                        key={i}
                        className="grid grid-cols-7 items-center px-4 py-3 border-b text-sm text-gray-800 hover:bg-gray-50 transition shadow-sm bg-white mb-1"
                      >
                        <TableCell className="col-span-2">{doc.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {" "}
                          <Checkbox id="terms" />
                        </TableCell>
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
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
