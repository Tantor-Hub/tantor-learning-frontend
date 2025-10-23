"use client";
import { useGetModulesQuery, useUpdateModuleMutation } from "@/lib/apis/module-de-formation-api";
import { Download, Edit } from "lucide-react";
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
import { ModuleFormationSkeleton } from "@/components/skeletons/module-formation-skeleton";

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

function EditModuleDialog({ module, onClose }: { module: any; onClose: () => void }) {
  const [description, setDescription] = useState(module.description);
  const [file, setFile] = useState<File | null>(null);
  const [updateModule, { isLoading }] = useUpdateModuleMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    if (!description.trim()) return;

    try {
      await updateModule({
        id: module.id,
        description: description.trim(),
        piece_jointe: file || undefined,
      }).unwrap();
      alert("Module mis à jour avec succès");
      onClose();
    } catch (error) {
      alert("Erreur lors de la mise à jour du module");
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Modifier le module de formation</DialogTitle>
        <DialogDescription>Modifiez la description et/ou le fichier du module</DialogDescription>
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
            disabled={isLoading}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="file" className="text-right">
            Nouveau fichier (optionnel)
          </Label>
          <Input
            id="file"
            type="file"
            accept=".pdf,.docx,.pptx"
            onChange={handleFileChange}
            className="col-span-3"
            disabled={isLoading}
          />
        </div>
        {file && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Nouveau fichier</Label>
            <div className="col-span-3 text-sm truncate">{file.name}</div>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button type="submit" onClick={handleUpdate} disabled={!description.trim() || isLoading}>
          {isLoading ? "Mise à jour..." : "Mettre à jour"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export function ModuleFormationTab() {
  const { data, isLoading, error } = useGetModulesQuery();
  const [editingModule, setEditingModule] = useState<any>(null);

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-160px)]">
        <div className="flex flex-col items-center gap-4 p-4 max-w-md text-center">
          <p className="text-destructive">
            Impossible de charger les modules de formation. Veuillez réessayer plus tard.
          </p>
        </div>
      </div>
    );
  }

  const modules = data?.data?.rows ?? [];

  return (
    <div className="overflow-x-auto my-4 rounded-md bg-white border">
      <div className="min-w-[1000px]">
        <div className="p-6">
          <h3 className="text-[#0466C8] text-xl font-semibold mb-4">Modules de Formation</h3>
          <div className="space-y-4">
            {modules.length > 0 ? (
              modules.map((module) => (
                <div
                  key={module.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{module.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(module.piece_jointe, "_blank")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingModule(module)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </DialogTrigger>
                      {editingModule && editingModule.id === module.id && (
                        <EditModuleDialog
                          module={editingModule}
                          onClose={() => setEditingModule(null)}
                        />
                      )}
                    </Dialog>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                Aucun module de formation trouvé
                <div className="mt-4">
                  <UploadDialog />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
