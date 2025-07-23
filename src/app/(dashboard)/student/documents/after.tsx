import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Ellipsis, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FileData {
  nom: string;
  type: string;
  taille: string;
  date: string;
  categorie: string;
}

type ActionType = "download" | "view" | "edit" | "share" | "delete";

type DocumentType =
  | "questionnaire_satisfaction"
  | "paiement"
  | "documents_financeur"
  | "fiche_controle_finale";

export function AfterTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [files, setFiles] = useState<FileData[]>([
    {
      nom: "Microsoft Excel",
      type: "pdf",
      taille: "2.5MB",
      date: "24/04/2024",
      categorie: "contrat d'engagement",
    },
    {
      nom: "Rapport Q1",
      type: "xlsx",
      taille: "1.2MB",
      date: "15/03/2024",
      categorie: "rapport financier",
    },
    {
      nom: "Présentation",
      type: "pptx",
      taille: "5.8MB",
      date: "02/03/2024",
      categorie: "présentation",
    },
  ]);
  const [newFiles, setNewFiles] = useState<{ file: File | null; type: DocumentType }[]>([]);

  const handleAction = (action: ActionType, fileName: string): void => {
    console.log(`Action: ${action} sur le fichier: ${fileName}`);

    switch (action) {
      case "download":
        alert(`Téléchargement de ${fileName}`);
        break;
      case "view":
        alert(`Visualisation de ${fileName}`);
        break;
      case "edit":
        alert(`Modification de ${fileName}`);
        break;
      case "share":
        alert(`Partage de ${fileName}`);
        break;
      case "delete":
        if (confirm(`Êtes-vous sûr de vouloir supprimer ${fileName} ?`)) {
          setFiles(files.filter((f) => f.nom !== fileName));
          alert(`${fileName} supprimé`);
        }
        break;
      default:
        break;
    }
  };

  const handleAddFiles = () => {
    setIsDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const updatedFiles = [...newFiles];
      updatedFiles[index] = { ...updatedFiles[index], file: fileList[0] };
      setNewFiles(updatedFiles);
    }
  };

  const handleTypeChange = (value: DocumentType, index: number) => {
    const updatedFiles = [...newFiles];
    updatedFiles[index] = { ...updatedFiles[index], type: value };
    setNewFiles(updatedFiles);
  };

  const addFileInput = () => {
    setNewFiles([...newFiles, { file: null, type: "questionnaire_satisfaction" }]);
  };

  const removeFileInput = (index: number) => {
    const updatedFiles = [...newFiles];
    updatedFiles.splice(index, 1);
    setNewFiles(updatedFiles);
  };

  const handleSubmit = () => {
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    const addedFiles = newFiles
      .filter((item) => item.file)
      .map((item) => {
        const file = item.file as File;
        return {
          nom: file.name,
          type: file.name.split(".").pop() || "",
          taille: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
          date: formattedDate,
          categorie: item.type,
        };
      });

    setFiles([...files, ...addedFiles]);
    setNewFiles([]);
    setIsDialogOpen(false);
  };

  return (
    <div className="mx-auto">
      <Button className="my-4" onClick={handleAddFiles}>
        <Plus className="mr-2 h-4 w-4" />
        Ajouter les documents
      </Button>

      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Taille</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{file.nom}</TableCell>
              <TableCell>
                <Badge variant={"outline"}>{file.type.toLocaleLowerCase()}</Badge>
              </TableCell>
              <TableCell>{file.taille}</TableCell>
              <TableCell>{file.date}</TableCell>
              <TableCell className="capitalize">{file.categorie.replace(/_/g, " ")}</TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge variant="secondary" className="hover:cursor-pointer">
                      <Ellipsis />
                      <span className="sr-only">Ouvrir le menu</span>
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleAction("download", file.nom)}>
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleAction("delete", file.nom)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Ajouter des documents</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {newFiles.map((item, index) => (
              <div key={index} className="grid grid-cols-12 items-center gap-4">
                <div className="col-span-5">
                  <Input
                    id={`file-${index}`}
                    type="file"
                    onChange={(e) => handleFileChange(e, index)}
                  />
                </div>
                <div className="col-span-5">
                  <Select
                    value={item.type}
                    onValueChange={(value) => handleTypeChange(value as DocumentType, index)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type de document" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="questionnaire_satisfaction">
                        Questionnaire de satisfaction
                      </SelectItem>
                      <SelectItem value="paiement">Paiement</SelectItem>
                      <SelectItem value="documents_financeur">Documents financeur</SelectItem>
                      <SelectItem value="fiche_controle_finale">Fiche contrôle finale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Button variant="outline" size="icon" onClick={() => removeFileInput(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="mt-2" onClick={addFileInput}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un autre document
            </Button>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button type="button" onClick={handleSubmit}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
