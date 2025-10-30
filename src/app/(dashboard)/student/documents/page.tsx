"use client";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { AfterTab } from "./after";
import { BeforeTab } from "./before";
import { DuringTab } from "./during";
import { useSelectedSession } from "@/hooks/use-selected-session";
import { useSessionAlert } from "@/hooks/use-session-alert";
import { SessionAlert } from "@/components/shared/session-alert";
import { useGetDocumentsTemplatesBySessionIdQuery } from "@/lib/apis/documents";

export default function Page() {
  const selectedSessionId = useSelectedSession();
  const { shouldShowAlert, isLoading: alertLoading } = useSessionAlert();
  const { data: templatesData } = useGetDocumentsTemplatesBySessionIdQuery({
    sessionId: selectedSessionId || "",
  });

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
                    <div className="space-y-4">
                      {templatesData?.data
                        ?.filter((template) => template.type === "before")
                        .map((template) => (
                          <div
                            key={template.id}
                            className="p-4 border rounded-lg bg-white shadow-sm"
                          >
                            <h3 className="font-medium mb-2">{template.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">
                              {template.variables?.length || 0} variable(s) à remplir
                            </p>
                            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                              Remplir le document
                            </button>
                          </div>
                        ))}
                      {(!templatesData?.data ||
                        templatesData.data.filter((template) => template.type === "before")
                          .length === 0) && (
                        <p className="text-center text-gray-500 py-8">
                          Aucun document à remplir pour cette période
                        </p>
                      )}
                    </div>
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
                    <div className="space-y-4">
                      {templatesData?.data
                        ?.filter((template) => template.type === "during")
                        .map((template) => (
                          <div
                            key={template.id}
                            className="p-4 border rounded-lg bg-white shadow-sm"
                          >
                            <h3 className="font-medium mb-2">{template.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">
                              {template.variables?.length || 0} variable(s) à remplir
                            </p>
                            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                              Remplir le document
                            </button>
                          </div>
                        ))}
                      {(!templatesData?.data ||
                        templatesData.data.filter((template) => template.type === "during")
                          .length === 0) && (
                        <p className="text-center text-gray-500 py-8">
                          Aucun document à remplir pour cette période
                        </p>
                      )}
                    </div>
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
                    <div className="space-y-4">
                      {templatesData?.data
                        ?.filter((template) => template.type === "after")
                        .map((template) => (
                          <div
                            key={template.id}
                            className="p-4 border rounded-lg bg-white shadow-sm"
                          >
                            <h3 className="font-medium mb-2">{template.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">
                              {template.variables?.length || 0} variable(s) à remplir
                            </p>
                            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                              Remplir le document
                            </button>
                          </div>
                        ))}
                      {(!templatesData?.data ||
                        templatesData.data.filter((template) => template.type === "after")
                          .length === 0) && (
                        <p className="text-center text-gray-500 py-8">
                          Aucun document à remplir pour cette période
                        </p>
                      )}
                    </div>
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
    </div>
  );
}
