"use client";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { AfterTab } from "./after";
import { BeforeTab } from "./before";
import { DuringTab } from "./during";
import { useSelectedSession } from "@/hooks/use-selected-session";

export default function Page() {
  const selectedSessionId = useSelectedSession();
  return (
    <div>
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
            <BeforeTab sessionId={String(selectedSessionId)} />
          </TabsContent>
          <TabsContent value="during">
            <DuringTab sessionId={String(selectedSessionId)} />
          </TabsContent>
          <TabsContent value="after">
            <AfterTab sessionId={String(selectedSessionId)} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
