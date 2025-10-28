"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CpfTab } from "@/components/payment/tab/cpf-tab";
import { OpcoTab } from "@/components/payment/tab/opco-tab";
import { CarteTab } from "@/components/payment/tab/carte-tab";
import { useState } from "react";

export default function Page() {
  const [activeTab, setActiveTab] = useState("cpf");

  return (
    <div>
      <h1 className="text-xl semibold mb-4">Gestion des Paiements</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cpf">CPF</TabsTrigger>
          <TabsTrigger value="opco">OPCO</TabsTrigger>
          <TabsTrigger value="carte">CARTE</TabsTrigger>
        </TabsList>

        <TabsContent value="cpf">
          <h2 className="text-xl font-semibold mb-4">Méthodes de Paiement CPF</h2>
          <CpfTab />
        </TabsContent>

        <TabsContent value="opco">
          <h2 className="text-xl font-bold mb-4">Méthodes de Paiement OPCO</h2>
          <OpcoTab />
        </TabsContent>

        <TabsContent value="carte">
          <h2 className="text-xl font-semibold mb-4">Méthodes de Paiement CARTE</h2>
          <CarteTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
