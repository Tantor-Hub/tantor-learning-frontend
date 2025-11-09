"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SecDocsData, SecDocData } from "../types";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllUserInSessionsQuery } from "@/lib/apis/user-in-session";

type Status = "refusedpayment" | "notpaid" | "pending" | "in" | "out";

const SecDocsTabs = () => {
  const { data, isLoading, error } = useGetAllUserInSessionsQuery();
  const [selected, setSelected] = useState<Status>("pending");

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-destructive">
        Erreur lors du chargement des données.
      </div>
    );
  }

  const processedData: SecDocsData = {
    refusedpayment:
      data?.data
        ?.filter((u) => u.status === "refusedpayment")
        .map((u) => ({
          id: u.id_user,
          name: `${u.user.firstName} ${u.user.lastName}`,
          date: new Date(u.createdAt).toLocaleDateString("fr-FR"),
          action: "Paiement refusé",
          sessionTitle: u.trainingSession.title,
          nbPlaces: u.trainingSession.nb_places,
          availablePlaces: u.trainingSession.available_places,
        })) || [],
    notpaid:
      data?.data
        ?.filter((u) => u.status === "notpaid")
        .map((u) => ({
          id: u.id_user,
          name: `${u.user.firstName} ${u.user.lastName}`,
          date: new Date(u.createdAt).toLocaleDateString("fr-FR"),
          action: "Non payé",
          sessionTitle: u.trainingSession.title,
          nbPlaces: u.trainingSession.nb_places,
          availablePlaces: u.trainingSession.available_places,
        })) || [],
    pending:
      data?.data
        ?.filter((u) => u.status === "pending")
        .map((u) => ({
          id: u.id_user,
          name: `${u.user.firstName} ${u.user.lastName}`,
          date: new Date(u.createdAt).toLocaleDateString("fr-FR"),
          action: "En attente",
          sessionTitle: u.trainingSession.title,
          nbPlaces: u.trainingSession.nb_places,
          availablePlaces: u.trainingSession.available_places,
        })) || [],
    in:
      data?.data
        ?.filter((u) => u.status === "in")
        .map((u) => ({
          id: u.id_user,
          name: `${u.user.firstName} ${u.user.lastName}`,
          date: new Date(u.createdAt).toLocaleDateString("fr-FR"),
          action: "Inscrit",
          sessionTitle: u.trainingSession.title,
          nbPlaces: u.trainingSession.nb_places,
          availablePlaces: u.trainingSession.available_places,
        })) || [],
    out:
      data?.data
        ?.filter((u) => u.status === "out")
        .map((u) => ({
          id: u.id_user,
          name: `${u.user.firstName} ${u.user.lastName}`,
          date: new Date(u.createdAt).toLocaleDateString("fr-FR"),
          action: "Sorti",
          sessionTitle: u.trainingSession.title,
          nbPlaces: u.trainingSession.nb_places,
          availablePlaces: u.trainingSession.available_places,
        })) || [],
  };

  return (
    <div className="overflow-auto w-full">
      <Tabs
        defaultValue="pending"
        value={selected}
        onValueChange={(value) => setSelected(value as Status)}
        className="w-full min-w-[600px] bg-white border border-t rounded-lg shadow-sm"
      >
        <Table>
          <TabsList className="w-full">
            <TableHeader className="w-full">
              <TableRow className="grid grid-cols-5">
                <TableHead className="col-span-1">
                  <TabsTrigger value="refusedpayment" className="w-full py-5">
                    Paiement refusé
                  </TabsTrigger>
                </TableHead>
                <TableHead className="col-span-1">
                  <TabsTrigger value="notpaid" className="w-full py-5">
                    Non payé
                  </TabsTrigger>
                </TableHead>
                <TableHead className="col-span-1">
                  <TabsTrigger value="pending" className="w-full py-5">
                    En attente
                  </TabsTrigger>
                </TableHead>
                <TableHead className="col-span-1">
                  <TabsTrigger value="in" className="w-full py-5">
                    Inscrit
                  </TabsTrigger>
                </TableHead>
                <TableHead className="col-span-1">
                  <TabsTrigger value="out" className="w-full py-5">
                    Sorti
                  </TabsTrigger>
                </TableHead>
              </TableRow>
            </TableHeader>
          </TabsList>

          <TabsContent value={selected} className="w-full">
            <TableBody className="w-full flex flex-col">
              {processedData[selected].map((el, i) => (
                <TableRow key={i} className="grid grid-cols-12 px-2">
                  <TableCell className="col-span-2">
                    <span className="inline-block text-transparent size-14 rounded-full bg-[#b9b7b7]"></span>
                  </TableCell>
                  <TableCell className="flex col-span-4 flex-col">
                    <h4 className="font-medium">{el.name}</h4>
                    <span className="text-xs">{el.id}</span>
                    <span className="text-xs">{el.date}</span>
                  </TableCell>
                  <TableCell className="flex col-span-3 flex-col">
                    <span className="font-medium">{el.sessionTitle}</span>
                    <span className="text-xs">Places: {el.nbPlaces}</span>
                    <span className="text-xs">Disponibles: {el.availablePlaces}</span>
                  </TableCell>
                  <TableCell className="flex items-center col-span-3">
                    <span
                      className={`border rounded-full px-2.5 py-1 ${
                        el.action === "Paiement refusé"
                          ? "bg-[#FFD6D6] text-[#D62828] border-[#D62828]"
                          : el.action === "Non payé"
                            ? "bg-[#FFF3CD] text-[#856404] border-[#856404]"
                            : el.action === "En attente"
                              ? "bg-[#D1ECF1] text-[#0C5460] border-[#0C5460]"
                              : el.action === "Inscrit"
                                ? "bg-[#C8FFD9] text-[#059669] border-[#059669]"
                                : "bg-[#E2E3E5] text-[#383D41] border-[#383D41]"
                      }`}
                    >
                      {el.action}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TabsContent>
        </Table>
      </Tabs>
    </div>
  );
};
export default SecDocsTabs;
