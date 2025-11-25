"use client";
import { useGetModulesQuery } from "@/lib/apis/module-de-formation-api";
import { Download, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getValidAuthTokens } from "@/lib/cookies";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useCreateModuleMutation } from "@/lib/apis/module-de-formation-api";
import { ModuleFormationSkeleton } from "@/components/skeletons/module-formation-skeleton";
import { CatalogueSkeleton } from "@/components/skeletons/catalogue-skeleton";
import { UserRole } from "@/types/user";
import {
  useGetCatalogueFormationsQuery,
  useUpdateCatalogueFormationMutation,
  useDeleteCatalogueFormationMutation,
} from "@/lib/apis/catalogue-formation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";

function UploadDialog() {
  const { token } = getValidAuthTokens();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  // Remove createModule mutation, we implement xhr upload for token header support
  // const [createModule, { isLoading }] = useCreateModuleMutation();
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !description.trim()) return;

    setIsUploading(true);
    setUploadProgress(0);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("description", description.trim());
      formData.append("piece_jointe", file);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200 || xhr.status === 201) {
          toast.success("Module de formation ajouté avec succès");
          setFile(null);
          setDescription("");
          setUploadProgress(0);
        } else {
          toast.error("Erreur lors de l'ajout du module");
        }
        setIsUploading(false);
        setIsLoading(false);
      });

      xhr.addEventListener("error", () => {
        toast.error("Erreur lors de l'ajout du module");
        setIsUploading(false);
        setIsLoading(false);
      });

      xhr.open("POST", `${process.env.NEXT_PUBLIC_BASE_URL}/moduledeformation`);
      xhr.setRequestHeader("x-connexion-tantor", `Bearer ${token}`);
      xhr.send(formData);
    } catch (error) {
      toast.error("Erreur lors de l'ajout du module");
      setIsUploading(false);
      setIsLoading(false);
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

function GuideUploadDialog({ onSuccess }: { onSuccess: () => void }) {
  const { token } = getValidAuthTokens();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<UserRole>(UserRole.ADMIN);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !title.trim() || !description.trim()) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("type", type);
      formData.append("title", title.trim());
      formData.append("description", description.trim());

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200 || xhr.status === 201) {
          toast.success("Guide de formation ajouté avec succès");
          setFile(null);
          setTitle("");
          setDescription("");
          setType(UserRole.ADMIN);
          setUploadProgress(0);
          // Refetch the catalogue data to show the new item
          onSuccess();
        } else {
          toast.error("Erreur lors de l'ajout du guide");
        }
        setIsUploading(false);
      });

      xhr.addEventListener("error", () => {
        toast.error("Erreur lors de l'ajout du guide");
        setIsUploading(false);
      });
      // console.log(token);
      xhr.open("POST", `${process.env.NEXT_PUBLIC_BASE_URL}/catalogueformation`);
      xhr.setRequestHeader("x-connexion-tantor", `Bearer ${token}`);
      xhr.send(formData);
    } catch (error) {
      toast.error("Erreur lors de l'ajout du guide");
      setIsUploading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter guide de formation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un guide de formation</DialogTitle>
          <DialogDescription>Les formats supportés: PDF, DOCX, PPTX</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as UserRole)}
              disabled={isUploading}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionnez le type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UserRole).map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Titre
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entrez le titre du guide"
              className="col-span-3"
              disabled={isUploading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Entrez la description du guide"
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
            disabled={!file || !title.trim() || !description.trim() || isUploading}
          >
            {isUploading ? "Téléchargement..." : "Télécharger"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditModuleDialog({ module, onClose }: { module: any; onClose: () => void }) {
  const { token } = getValidAuthTokens();
  const [description, setDescription] = useState(module.description);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    if (!description.trim()) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("description", description.trim());
      if (file) {
        formData.append("piece_jointe", file);
      }

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200 || xhr.status === 201) {
          toast.success("Module mis à jour avec succès");
          onClose();
        } else {
          toast.error("Erreur lors de la mise à jour du module");
        }
        setIsUploading(false);
      });

      xhr.addEventListener("error", () => {
        toast.error("Erreur lors de la mise à jour du module");
        setIsUploading(false);
      });

      xhr.open("PATCH", `${process.env.NEXT_PUBLIC_BASE_URL}/moduledeformation/${module.id}`);
      xhr.setRequestHeader("x-connexion-tantor", `Bearer ${token}`);
      xhr.send(formData);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du module");
      setIsUploading(false);
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
            disabled={isUploading}
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
            disabled={isUploading}
          />
        </div>
        {file && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Nouveau fichier</Label>
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
        <Button type="submit" onClick={handleUpdate} disabled={!description.trim() || isUploading}>
          {isUploading ? "Mise à jour..." : "Mettre à jour"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function EditCatalogueDialog({
  catalogue,
  onClose,
  onSuccess,
}: {
  catalogue: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState(catalogue.title);
  const [description, setDescription] = useState(catalogue.description);
  const [type, setType] = useState<UserRole>(catalogue.type);
  const [file, setFile] = useState<File | null>(null);
  const [updateCatalogue, { isLoading }] = useUpdateCatalogueFormationMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    if (!title.trim() || !description.trim()) return;

    try {
      await updateCatalogue({
        id: catalogue.id,
        data: {
          title: title.trim(),
          description: description.trim(),
          type: type as any,
          piece_jointe: file as any,
        },
      }).unwrap();
      toast.success("Guide mis à jour avec succès");
      onClose();
      // Refetch the catalogue data to show the updated item
      onSuccess();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du guide");
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Modifier le guide de formation</DialogTitle>
        <DialogDescription>
          Modifiez le titre, la description, le type et/ou le fichier du guide
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">
            Type
          </Label>
          <Select
            value={type}
            onValueChange={(value) => setType(value as UserRole)}
            disabled={isLoading}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Sélectionnez le type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(UserRole).map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Titre
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entrez le titre du guide"
            className="col-span-3"
            disabled={isLoading}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Entrez la description du guide"
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
        <Button
          type="submit"
          onClick={handleUpdate}
          disabled={!title.trim() || !description.trim() || isLoading}
        >
          {isLoading ? "Mise à jour..." : "Mettre à jour"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export function Catalogue() {
  const {
    data: modulesData,
    isLoading: modulesLoading,
    error: modulesError,
  } = useGetModulesQuery();
  const {
    data: cataloguesData,
    isLoading: cataloguesLoading,
    error: cataloguesError,
    refetch: refetchCatalogues,
  } = useGetCatalogueFormationsQuery();
  const catalogues = cataloguesData?.data?.catalogueformations ?? [];
  const [editingModule, setEditingModule] = useState<any>(null);
  const [editingCatalogue, setEditingCatalogue] = useState<any>(null);
  const [deleteCatalogueId, setDeleteCatalogueId] = useState<string | null>(null);
  const [deleteCatalogue, { isLoading: deleteLoading }] = useDeleteCatalogueFormationMutation();

  if (modulesError || cataloguesError) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-160px)]">
        <div className="flex flex-col items-center gap-4 p-4 max-w-md text-center">
          <p className="text-destructive">
            Impossible de charger les données. Veuillez réessayer plus tard.
          </p>
        </div>
      </div>
    );
  }

  const modules = modulesData?.data?.rows ?? [];

  const handleDeleteCatalogue = async (id: string) => {
    try {
      await deleteCatalogue(id).unwrap();
      toast.success("Guide supprimé avec succès");
      setDeleteCatalogueId(null);
      // Refetch the catalogue data to remove the deleted item
      refetchCatalogues();
    } catch (error) {
      toast.error("Erreur lors de la suppression du guide");
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-4">
        <UploadDialog />
        <GuideUploadDialog onSuccess={() => refetchCatalogues()} />
      </div>

      {/* Modules de Formation Section */}
      {modulesLoading ? (
        <ModuleFormationSkeleton />
      ) : (
        <div className="overflow-x-auto my-4 rounded-md bg-white border">
          <div className="min-w-[1000px]">
            <div className="p-6">
              <h3 className="text-[#0466C8] text-xl font-semibold mb-4">Modules de Formation</h3>
              {modules.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[150px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modules.map((module) => (
                      <TableRow key={module.id}>
                        <TableCell className="font-medium">{module.description}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => window.open(module.piece_jointe, "_blank")}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Télécharger
                              </DropdownMenuItem>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    onClick={() => setEditingModule(module)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Modifier
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                {editingModule && editingModule.id === module.id && (
                                  <EditModuleDialog
                                    module={editingModule}
                                    onClose={() => setEditingModule(null)}
                                  />
                                )}
                              </Dialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  Aucun module de formation trouvé
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Guides de Formation Section */}
      {cataloguesLoading ? (
        <CatalogueSkeleton />
      ) : (
        <div className="overflow-x-auto my-4 rounded-md bg-white border">
          <div className="min-w-[1000px]">
            <div className="p-6">
              <h3 className="text-[#0466C8] text-xl font-semibold mb-4">Guides de Formation</h3>
              {catalogues.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Créé par</TableHead>
                      <TableHead className="w-[200px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {catalogues.map((catalogue) => (
                      <TableRow key={catalogue.id}>
                        <TableCell className="font-medium">{catalogue.title}</TableCell>
                        <TableCell>{catalogue.description}</TableCell>
                        <TableCell>{catalogue.type}</TableCell>
                        <TableCell>
                          {catalogue.creator.firstName} {catalogue.creator.lastName}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  catalogue.piece_jointe &&
                                  window.open(catalogue.piece_jointe, "_blank")
                                }
                                disabled={!catalogue.piece_jointe}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Télécharger
                              </DropdownMenuItem>
                              <Dialog>
                                <DialogTrigger asChild>
                                  {/* <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Modifier e
                                  </DropdownMenuItem> */}
                                </DialogTrigger>
                                {editingCatalogue && editingCatalogue.id === catalogue.id && (
                                  <EditCatalogueDialog
                                    catalogue={editingCatalogue}
                                    onClose={() => setEditingCatalogue(null)}
                                    onSuccess={() => refetchCatalogues()}
                                  />
                                )}
                              </Dialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Cette action ne peut pas être annulée. Cela supprimera
                                      définitivement le guide de formation.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteCatalogue(catalogue.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Supprimer
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  Aucun guide de formation trouvé
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
