"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseTab } from "./course-tab";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useCreateModuleMutation } from "@/lib/apis/module-de-formation-api";
import { ModuleFormationTab } from "./module-formation-tab";

function UploadDialog() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [createModule, { isLoading }] = useCreateModuleMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !description.trim()) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      await createModule({
        description: description.trim(),
        piece_jointe: file,
      }).unwrap();

      alert("Module de formation ajouté avec succès");
      setFile(null);
      setDescription("");
      setUploadProgress(0);
    } catch (error) {
      alert("Erreur lors de l'ajout du module");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter module de formation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un module de formation</DialogTitle>
          <DialogDescription>Les formats supportés: PDF, DOCX, PPTX</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Entrez la description du module"
              className="col-span-3"
              disabled={isUploading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              Fichier
            </Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.docx,.pptx"
              onChange={handleFileChange}
              className="col-span-3"
              disabled={isUploading}
            />
          </div>
          {file && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Nom du fichier</Label>
              <div className="col-span-3 text-sm truncate">{file.name}</div>
            </div>
          )}
          {isUploading && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Progression</Label>
              <div className="col-span-3">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-xs text-muted-foreground mt-1">{uploadProgress}% téléchargé</p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleUpload}
            disabled={!file || !description.trim() || isUploading || isLoading}
          >
            {isUploading || isLoading ? "Téléchargement..." : "Télécharger"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TabsView() {
  return (
    <Tabs defaultValue="courses" className="w-full border p-4">
      <div className="flex items-center justify-between">
        <TabsList className="bg-transparent border-none font-semibold">
          <TabsTrigger value="courses" className="p-3.5 bg-none">
            Matières
          </TabsTrigger>
          <TabsTrigger value="moduleFormation" className="p-3.5 bg-none">
            Module Formation
          </TabsTrigger>
        </TabsList>
        <UploadDialog />
      </div>

      <TabsContent value="courses">
        <div className="overflow-x-auto my-4 rounded-md bg-white">
          <div>
            <div className="min-w-[1000px]">
              <CourseTab />
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="moduleFormation">
        <ModuleFormationTab />
      </TabsContent>
    </Tabs>
  );
}
