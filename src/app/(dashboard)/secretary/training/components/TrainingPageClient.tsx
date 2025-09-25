"use client";

import { useListTrainingQuery } from "@/lib/apis/secretary/training-secretary-api";
import TrainingList from "../training-list";
import { ITraining } from "@/types/secretary/training-secretary";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryFormation } from "../tabs/category";

export default function TrainingPageClient() {
  const {
    data: formationsData,
    refetch: refetchFormations,
    isLoading: isLoadingFormationData,
  } = useListTrainingQuery();
  const router = useRouter();

  const handleViewDetails = (formation: ITraining) => {
    router.push(`/secretary/training/${formation.id}`);
  };

  const handleEdit = (formation: ITraining) => {
    // This will be handled by TrainingList
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
              formations={formationsData?.data || []}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
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
