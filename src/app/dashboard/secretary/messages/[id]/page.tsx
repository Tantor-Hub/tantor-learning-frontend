"use client";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Archive, Reply, Forward, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { messages } from "../data";
import { NewMessageAlert } from "../components/new-message";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const messageById = messages.find((message) => message.id === parseInt(id));
  const router = useRouter();
  return (
    <div>
      <div className="flex items-center justify-between mb-11">
        <p>1 message(s) non lu</p>
        <NewMessageAlert />
      </div>
      <div className="flex items-center justify-between gap-4">
        <Button variant={"outline"} size="lg" onClick={() => router.back()}>
          <ChevronLeft /> Retour
        </Button>
        <div className="flex items-center gap-4">
          <Button variant={"outline"} size="lg">
            <Archive /> Archiver
          </Button>
          <Button variant={"outline"} size="lg">
            <Reply /> Repondre
          </Button>
          <Button variant={"outline"} size="lg">
            <Forward /> Transferer
          </Button>
          <Button variant={"destructive"} size="lg">
            <Trash /> Supprimer
          </Button>
        </div>
      </div>
      <div className="border border-border rounded-lg p-4 mt-4">
        <div className="mb-4">
          <p className="text-primary text-xl font-bold">{messageById?.title}</p>
          <p className="text-[#979DAC]">
            {messageById?.name} - {messageById?.role}
          </p>
        </div>
        <p>{messageById?.message}</p>
      </div>
    </div>
  );
}
