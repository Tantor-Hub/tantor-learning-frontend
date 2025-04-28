"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Archive, Reply, Forward, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <Button variant={"outline"} onClick={() => router.back()}>
          <ChevronLeft /> Retour
        </Button>
        <div className="flex items-center gap-4">
          <Button variant={"outline"}>
            <Archive /> Archiver
          </Button>
          <Button variant={"outline"}>
            <Reply /> Repondre
          </Button>
          <Button variant={"outline"}>
            <Forward /> Transferer
          </Button>
          <Button variant={"destructive"}>
            <Trash /> Supprimer
          </Button>
        </div>
      </div>
      <div className="border border-border rounded-lg p-4 mt-4">
        <div className="mb-4">
          <p className="text-primary text-xl font-bold">Informations sur le prochain cours</p>
          <p className="text-[#979DAC]">De : Pierre Durand (Formateur) . Aujourdh’ui , 09:15</p>
        </div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, nisi beatae animi
          sapiente rerum doloremque. Recusandae, doloribus accusantium? Eveniet quos rem velit rerum
          sed magnam error hic suscipit nihil porro. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Impedit eligendi quo nobis dolorem nisi! Minus iure animi possimus
          architecto in a sed deserunt est, ad dicta, totam facere perferendis harum?
        </p>
      </div>
    </div>
  );
}
