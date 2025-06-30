"use client";
import React, { useState } from "react";
import { useTrainingListQuery } from "@/lib/apis/secretary/training-secretary-api";
import TrainingList from "./training-list";
import { ICategory, ITraining } from "@/types/secretary/training-secretary";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryFormation } from "./tabs/category";
export default function TrainingListPage() {
  const {
    data: formationsData,
    refetch: refetchFormations,
    isLoading: isLoadingFormationData,
  } = useTrainingListQuery();
  const router = useRouter();

  const handleViewDetails = (formation: ITraining) => {
    router.push(`/secretary/training/${formation.id}`);
  };

  return (
    <div className="min-h-screen">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-white border font-semibold px-2.5 py-6 grid-cols-1 gap-4">
          <TabsTrigger value="all" className="p-5 px-2 md:px-5">
            Formation
          </TabsTrigger>
          <TabsTrigger value="category" className="p-5 px-2 md:px-5">
            Categories de Formation
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="max-w-7xl mx-auto">
            <TrainingList
              formations={formationsData?.data?.list || []}
              onViewDetails={handleViewDetails}
              refetchFormations={refetchFormations}
              isLoadingFormationData={isLoadingFormationData}
            />
          </div>
        </TabsContent>
        <TabsContent value="category">
          <CategoryFormation />
        </TabsContent>
      </Tabs>
    </div>
  );
}
