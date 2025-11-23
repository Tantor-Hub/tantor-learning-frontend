"use client";

import React, { useState } from "react";
import { useListTrainingQuery } from "@/lib/apis/secretary/training-secretary-api";
import { ITraining } from "@/types/secretary/training-secretary";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeEuro, Calendar, Clock, Users } from "lucide-react";
import TrainingForm from "../TrainingForm";
import { CategoryFormation } from "../tabs/category";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { toast } from "react-hot-toast";
import { Loader2, Upload, FileText, Edit, Trash2 } from "lucide-react";
import { UserRole } from "@/types/user";

const TrainingCard = ({
  training,
  onViewSessions,
}: {
  training: ITraining;
  onViewSessions: (training: ITraining) => void;
}) => {
  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer border flex flex-col"
      onClick={() => onViewSessions(training)}
    >
      <CardHeader>
        {/* Fixed height title */}
        <CardTitle className="text-xl h-12 overflow-hidden line-clamp-1">
          {training.title}
        </CardTitle>

        {/* Subtitle with limited lines */}
        <CardDescription className="line-clamp-2">{training.subtitle}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col flex-1">
        {/* Description with max lines */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {training.description || "Aucune description disponible"}
        </p>

        <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4 mt-auto">
          <div className="flex items-center gap-1">
            <BadgeEuro className="h-4 w-4" />
            <span>{training.prix}€</span>
          </div>

          <div className="flex items-center gap-1">
            <Badge variant="outline">
              <span>{training.trainingCategory?.title || "Non catégorisé"}</span>
            </Badge>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onViewSessions(training);
          }}
        >
          Voir les sessions
        </Button>
      </CardContent>
    </Card>
  );
};

export default function TrainingPageClient() {
  const { data: formationsData, isLoading } = useListTrainingQuery();
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleViewSessions = (training: ITraining) => {
    router.push(`/secretary/training/${training.id}/sessions`);
  };

  const trainings = formationsData?.data || [];

  return (
    <div>
      <div>
        <Tabs defaultValue="formations" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="formations">Formations</TabsTrigger>
            <TabsTrigger value="categories">Catégories de formation</TabsTrigger>
          </TabsList>

          <TabsContent value="formations">
            <div className="mb-4 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Formations</h1>
                <p className="text-gray-600">Découvrez toutes nos formations disponibles</p>
              </div>
              <TrainingForm
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSuccess={() => {}}
              >
                <Button>Ajouter une formation</Button>
              </TrainingForm>
            </div>

            <div className="w-full">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }, (_, index) => (
                    <Card key={index} className="animate-pulse">
                      <CardHeader>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : trainings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucune formation disponible pour le moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trainings.map((training) => (
                    <TrainingCard
                      key={training.id}
                      training={training}
                      onViewSessions={handleViewSessions}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <CategoryFormation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
