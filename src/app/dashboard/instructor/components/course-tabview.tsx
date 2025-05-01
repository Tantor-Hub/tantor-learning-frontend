import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Plus, MoreHorizontal } from "lucide-react";
import { BookOpen, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { documentsData } from "../data/index";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { CreateCourse } from "../../admin/courses/create-course";

const documentsData = [
  {
    titre: "Marketing Digital Avancé",
    catégorie: "Bureautique",
    étudiant: 212,
    status: "Archivé",
    dernière_mise_à_jour: "Il y a 3 mois",
    action: "Voir plus",
  },
  {
    titre: "Marketing Digital Avancé",
    catégorie: "Bureautique",
    étudiant: 212,
    status: "Actif",
    dernière_mise_à_jour: "Il y a 3 mois",
    action: "Voir plus",
  },
  {
    titre: "Marketing Digital Avancé",
    catégorie: "Bureautique",
    étudiant: 212,
    status: "Actif",
    dernière_mise_à_jour: "Il y a 3 mois",
    action: "Voir plus",
  },
  {
    titre: "Marketing Digital Avancé",
    catégorie: "Bureautique",
    étudiant: 212,
    status: "Actif",
    dernière_mise_à_jour: "Il y a 3 mois",
    action: "Voir plus",
  },
  {
    titre: "Marketing Digital Avancé",
    catégorie: "Bureautique",
    étudiant: 212,
    status: "Actif",
    dernière_mise_à_jour: "Il y a 3 mois",
    action: "Voir plus",
  },
];

export function CourseTabView() {
  return (
    <Tabs defaultValue="all" className="w-full border border-border rounded-md my-4 p-8 bg-white">
      <TabsList className="flex items-center gap-4 bg-white border mb-8 px-2.5 py-6 font-semibold">
        <TabsTrigger value="all" className="p-5 px-2 md:px-5">
          Tous
        </TabsTrigger>
        <TabsTrigger value="archives" className="p-5 px-2 md:px-5">
          Actifs
        </TabsTrigger>
        <TabsTrigger value="deleted" className="p-5 px-2 md:px-5">
          Brouillons
        </TabsTrigger>
        <TabsTrigger value="new" className="p-5 px-2 md:px-5">
          Archives
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xl text-primary font-semibold mb-3">Tous mes matières</p>
            <p>Liste complete de tous mes matieres enregistres sur la plateforme</p>
          </div>
          <CreateCourse />
          {/* <Button size="lg">
            <Plus />
            Ajouter une matière
          </Button> */}
        </div>

        <div>
          <div className="min-w-[1000px]">
            <table className="w-full border-collapse border rounded-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 text-left border-b">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="py-2 px-4 text-left border-b text-gray-500 font-medium">Titres</th>
                  <th className="py-2 px-4 text-left border-b text-gray-500 font-medium">
                    Catégorie
                  </th>
                  <th className="py-2 px-4 text-left border-b text-gray-500 font-medium">
                    Etudiant
                  </th>
                  <th className="py-2 px-4 text-left border-b text-gray-500 font-medium">Status</th>
                  <th className="py-2 px-4 text-left border-b text-gray-500 font-medium">
                    Dernière mise à jour
                  </th>
                  <th className="py-2 px-4 text-left border-b text-gray-500 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {documentsData.map((doc, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="py-3 px-4 border-b font-medium">{doc.titre}</td>
                    <td className="py-3 px-4 border-b">{doc.catégorie}</td>
                    <td className="py-3 px-4 border-b">{doc.étudiant}</td>
                    <td className="py-3 px-4 border-b">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                          doc.status === "Actif"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b text-gray-500">{doc.dernière_mise_à_jour}</td>
                    <td className="py-3 px-4 border-b">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-500">
                          <Plus size={16} />
                        </button>
                        <button className="text-gray-500">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="archives">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold">Aucun message</h1>
          <p className="text-gray-500">Vous n'avez pas de message dans cette catégorie.</p>
          <p className="text-gray-500">
            Vous pouvez envoyer un message en cliquant sur le bouton ci-dessous.
          </p>
          <Image src="/empty.svg" width={200} height={200} alt="Empty svg" />
          <p>Votre liste de reçus est vide.</p>
        </div>
      </TabsContent>
      <TabsContent value="deleted">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold">Aucun message</h1>
          <p className="text-gray-500">Vous n'avez pas de message dans cette catégorie.</p>
          <p className="text-gray-500">
            Vous pouvez envoyer un message en cliquant sur le bouton ci-dessous.
          </p>
          <Image src="/empty.svg" width={200} height={200} alt="Empty svg" />
          <p>Votre liste de reçus est vide.</p>
        </div>
      </TabsContent>

      <TabsContent value="new">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold">Aucun message</h1>
          <p className="text-gray-500">Vous n'avez pas de message dans cette catégorie.</p>
          <p className="text-gray-500">
            Vous pouvez envoyer un message en cliquant sur le bouton ci-dessous.
          </p>
          <Image src="/empty.svg" width={200} height={200} alt="Empty svg" />
          <p>Votre liste de reçus est vide.</p>
        </div>
      </TabsContent>
      <TabsContent value="send">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold">Aucun message</h1>
          <p className="text-gray-500">Vous n'avez pas de message dans cette catégorie.</p>
          <p className="text-gray-500">
            Vous pouvez envoyer un message en cliquant sur le bouton ci-dessous.
          </p>
          <Image src="/empty.svg" width={200} height={200} alt="Empty svg" />
          <p>Votre liste de reçus est vide.</p>
        </div>
      </TabsContent>
      <TabsContent value="received">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold">Aucun message</h1>
          <p className="text-gray-500">Vous n'avez pas de message dans cette catégorie.</p>
          <p className="text-gray-500">
            Vous pouvez envoyer un message en cliquant sur le bouton ci-dessous.
          </p>
          <Image src="/empty.svg" width={200} height={200} alt="Empty svg" />
          <p>Votre liste de reçus est vide.</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
