"use client";
import React, { useState } from "react";
import { useTrainingListQuery } from "@/lib/apis/secretary/training-secretary-api";
import TrainingList from "./training-list";
import { ICategory, ITraining } from "@/types/secretary/training-secretary";
import { useRouter } from "next/navigation";

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
      <div className="max-w-7xl mx-auto">
        <TrainingList
          formations={formationsData?.data?.list || []}
          onViewDetails={handleViewDetails}
          refetchFormations={refetchFormations}
          isLoadingFormationData={isLoadingFormationData}
        />
      </div>
    </div>
  );
}
