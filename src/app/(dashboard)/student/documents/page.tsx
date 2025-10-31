"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { AfterTab } from "./tabs/after";
import { BeforeTab } from "./tabs/before";
import { DuringTab } from "./tabs/during";
import { FilledDocumentsList } from "./components/FilledDocumentsList";
import { useSelectedSession } from "@/hooks/use-selected-session";
import { useSessionAlert } from "@/hooks/use-session-alert";
import { SessionAlert } from "@/components/shared/session-alert";
import { useLazyGetDocumentTemplateByIdQuery } from "@/lib/apis/documents";
import StudentTemplate from "./student-template";
import toast from "react-hot-toast";

export default function Page() {
  const selectedSessionId = useSelectedSession();
  const currentUser = useSelector(selectCurrentUser);
  const { shouldShowAlert, isLoading: alertLoading } = useSessionAlert();
  const [getTemplateById, { data: templateData, isLoading: templateLoading }] =
    useLazyGetDocumentTemplateByIdQuery();
  const [studentTemplateOpen, setStudentTemplateOpen] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState("");

  const handleFillDocument = async (templateId: string) => {
    try {
      setCurrentTemplateId(templateId);
      await getTemplateById({ id: templateId }).unwrap();
      setStudentTemplateOpen(true);
    } catch (error) {
      console.error("Failed to load template:", error);
      toast.error("Erreur lors du chargement du modèle");
    }
  };

  if (!selectedSessionId) {
    return null;
  }

  if (alertLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {shouldShowAlert && <SessionAlert />}
      {!shouldShowAlert && (
        <>
          <div className="flex flex-col sm:flex-row gap-5 md:gap-10 mb-5">
            <div className="flex items-center border px-2.5 w-full rounded-md bg-white">
              <Image src="/icons/search.svg" height={20} width={20} alt="search icon" />
              <Input
                type="search"
                className="text-[#ACACAC] border-none focus-visible:outline-none focus-visible:ring-0"
                placeholder="Rechercher Un cours ..."
              />
            </div>
          </div>

          <Tabs defaultValue="before">
            <div className="overflow-x-auto">
              <TabsList className="flex min-w-[1000px] w-full bg-white border">
                <TabsTrigger value="before">Avant La Formation</TabsTrigger>
                <TabsTrigger value="during">Pendant La Formation</TabsTrigger>
                <TabsTrigger value="after">Après La Formation</TabsTrigger>
              </TabsList>

              <TabsContent value="before">
                <Tabs defaultValue="televerser">
                  <TabsList className="flex bg-white border">
                    <TabsTrigger value="televerser">Document a televerser</TabsTrigger>
                    <TabsTrigger value="remplir">Document à remplir</TabsTrigger>
                  </TabsList>
                  <TabsContent value="remplir">
                    <FilledDocumentsList
                      sessionId={String(selectedSessionId)}
                      type="before"
                      onFillDocument={handleFillDocument}
                    />
                  </TabsContent>
                  <TabsContent value="televerser">
                    <BeforeTab sessionId={String(selectedSessionId)} />
                  </TabsContent>
                </Tabs>
              </TabsContent>
              <TabsContent value="during">
                <Tabs defaultValue="televerser">
                  <TabsList className="flex bg-white border">
                    <TabsTrigger value="televerser">Document a televerser</TabsTrigger>
                    <TabsTrigger value="remplir">Document à remplir</TabsTrigger>
                  </TabsList>
                  <TabsContent value="remplir">
                    <FilledDocumentsList
                      sessionId={String(selectedSessionId)}
                      type="during"
                      onFillDocument={handleFillDocument}
                    />
                  </TabsContent>
                  <TabsContent value="televerser">
                    <DuringTab sessionId={String(selectedSessionId)} />
                  </TabsContent>
                </Tabs>
              </TabsContent>
              <TabsContent value="after">
                <Tabs defaultValue="televerser">
                  <TabsList className="flex bg-white border">
                    <TabsTrigger value="televerser">Document a televerser</TabsTrigger>
                    <TabsTrigger value="remplir">Document à remplir</TabsTrigger>
                  </TabsList>
                  <TabsContent value="remplir">
                    <FilledDocumentsList
                      sessionId={String(selectedSessionId)}
                      type="after"
                      onFillDocument={handleFillDocument}
                    />
                  </TabsContent>
                  <TabsContent value="televerser">
                    <AfterTab sessionId={String(selectedSessionId)} />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </div>
          </Tabs>
        </>
      )}

      <StudentTemplate
        open={studentTemplateOpen}
        onOpenChange={setStudentTemplateOpen}
        templateId={currentTemplateId}
        sessionId={String(selectedSessionId)}
        userId={currentUser?.id || ""}
      />
    </div>
  );
}
