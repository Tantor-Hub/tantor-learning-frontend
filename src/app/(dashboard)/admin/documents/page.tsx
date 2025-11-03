"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import { InternData, StudentTable } from "./components/student-table";
import { Catalogue } from "./components/catalogue";
import { useState } from "react";
import { useGetAllUserInSessionsAdminQuery } from "@/lib/apis/user-in-session";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentTableSkeleton } from "@/components/skeletons/student-table-skeleton";

export default function Page() {
  const { data, isLoading, error } = useGetAllUserInSessionsAdminQuery();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return (
      <Tabs defaultValue="informations-eleves" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="informations-eleves">Informations élèves</TabsTrigger>
          <TabsTrigger value="catalogues">Catalogues</TabsTrigger>
        </TabsList>
        <TabsContent value="informations-eleves">
          <div>
            <div className="flex flex-col sm:flex-row gap-5 md:gap-10 mb-5">
              <div className="flex items-center w-full rounded-md relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={20} />
                </div>
                <Input
                  type="search"
                  placeholder="Rechercher un utilisateur..."
                  className="pl-10 pr-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              </div>
            </div>
            <div className="w-full overflow-x-auto">
              <div className="">
                <StudentTableSkeleton />
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="catalogues">
          <Catalogue />
        </TabsContent>
      </Tabs>
    );
  }

  if (error) {
    return <div className="p-8 text-red-500">Error fetching users: {JSON.stringify(error)}</div>;
  }

  const baseData = (data?.data || []).map((userInSession) => {
    const user = userInSession.user;
    const session = userInSession.trainingSession;
    const trainings = session.trainings;

    return {
      id: userInSession.id,
      status: userInSession.status,
      // User details
      user_id: user.id,
      user_firstName: user.firstName,
      user_lastName: user.lastName,
      user_email: user.email,
      user_phone: user.phone || "-",
      user_dateBirth: user.dateBirth || "-",
      user_address: user.address || "-",
      user_country: user.country || "-",
      user_city: user.city || "-",
      user_is_verified: user.is_verified ? "Oui" : "Non",
      user_avatar: user.avatar || null,
      // Session details
      session_title: session.title,
      // Training details
      training_title: trainings?.title || "-",
    };
  });

  const internData: InternData[] = baseData.map((item) => ({
    "Nom complet": `${item.user_firstName} ${item.user_lastName}`,
    Email: item.user_email,
    Adresse: item.user_address,
    Pays: item.user_country,
    Ville: item.user_city,
    "Date de naissance": item.user_dateBirth,
    Formation: item.training_title,
    Session: item.session_title,
    Statut: item.status,
  }));

  const filteredInternData: InternData[] = internData.filter(
    (item) =>
      String(item["Nom complet"]).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.Email).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.Adresse).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.Pays).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.Ville).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item["Date de naissance"]).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.Formation).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.Session).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.Statut).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Tabs defaultValue="informations-eleves" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="informations-eleves">Informations élèves</TabsTrigger>
        <TabsTrigger value="catalogues">Catalogues</TabsTrigger>
        {/* <TabsTrigger value="mentions-legales">Mentions légales</TabsTrigger> */}
      </TabsList>
      <TabsContent value="informations-eleves">
        <div>
          <div className="flex flex-col sm:flex-row gap-5 md:gap-10 mb-5">
            <div className="flex items-center w-full rounded-md relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} />
              </div>
              <Input
                type="search"
                placeholder="Rechercher un utilisateur..."
                className="pl-10 pr-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <div className="">
              <StudentTable
                data={filteredInternData}
                title="INFORMATIONS COMPLETES DES ELEVES"
                baseData={baseData}
              />
            </div>
          </div>
        </div>
      </TabsContent>
      {/* <TabsContent value="mentions-legales">
        <div>
          <p>Mentions légales content goes here.</p>
        </div>
      </TabsContent> */}
      <TabsContent value="catalogues">
        <Catalogue />
      </TabsContent>
    </Tabs>
  );
}
