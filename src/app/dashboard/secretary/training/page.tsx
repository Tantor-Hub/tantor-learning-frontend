"use client";
import React, { useState } from "react";
import { useTrainingListQuery } from "@/lib/apis/secretary/training-secretary-api";
import TrainingList from "./training-list";
import TrainingDetails from "./TrainingDetails";
import { ICategory, ITraining } from "@/types/secretary/training-secretary";

export default function TrainingListPage() {
  const {
    data: formationsData,
    refetch: refetchFormations,
    isLoading: isLoadingFormationData,
  } = useTrainingListQuery();
  const [currentView, setCurrentView] = useState<"list" | "details">("list");
  const [selectedFormation, setSelectedFormation] = useState<ITraining | null>(null);

  const handleViewDetails = (formation: ITraining) => {
    setSelectedFormation(formation);
    setCurrentView("details");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedFormation(null);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {currentView === "list" ? (
          <TrainingList
            formations={formationsData?.data?.list || []}
            onViewDetails={handleViewDetails}
            refetchFormations={refetchFormations}
            isLoadingFormationData={isLoadingFormationData}
          />
        ) : (
          <TrainingDetails
            formation={selectedFormation}
            onBack={handleBackToList}
            refetchFormations={refetchFormations}
          />
        )}
      </div>
    </div>
  );
}
