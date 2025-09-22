"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseTab } from "./course-tab";
import { RoleTab } from "./role-tab";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

function UploadDialog() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const simulateUpload = () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
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
          <DialogDescription>Les formats supportés: PDF</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
          <Button type="submit" onClick={simulateUpload} disabled={!file || isUploading}>
            {isUploading ? "Téléchargement..." : "Télécharger"}
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
            Cours
          </TabsTrigger>
          <TabsTrigger value="roles" className="p-3.5 bg-none">
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
      <TabsContent value="roles">
        <div className="overflow-x-auto p-8 shadow-md my-4 border border-border rounded-md bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-primary text-xl font-semibold mb-3">Gestion des rôles</h2>
              <p className="mb-8 font-light">
                Visualisez et gérez tous les rôles d'utilisateurs disponibles dans l'application.
              </p>
            </div>
          </div>
          <div>
            <div className="min-w-[1000px]">
              <RoleTab />
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
