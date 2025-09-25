"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function GeneralInfo() {
  // Placeholder content - in a real app, this would fetch session data
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales de la session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Titre de la session</Label>
            <p className="mt-1">Session de formation avancée</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Description</Label>
            <p className="mt-1">Cette session couvre les sujets avancés de la formation.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Date de début</Label>
              <p className="mt-1">01/01/2024</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Date de fin</Label>
              <p className="mt-1">31/01/2024</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
