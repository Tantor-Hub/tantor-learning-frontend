"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VideoIcon, SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div>
      <div className="flex items-center justify-between w-[400px] bg-[#D8D8D8] rounded-[8px] p-2 px-4 mb-4">
        <p className="bg-white rounded-[8px] p-1 px-4">Tous</p>
        <p>En ligne</p>
        <p>Terminé</p>
        <p>Enregistré</p>
      </div>
      <div className="mb-4">
        <p className="text-primary text-xl font-bold">Droit Fiscal</p>
        <p className="text-[#979DAC]">Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <Button>Enregistrer la vidéo</Button>
        <Button>Joindre la vidéo</Button>
      </div>
      <div className="mt-4 flex justify-between gap-6">
        <div className="rounded-md bg-gray-950 flex flex-col items-center justify-center flex-1">
          <VideoIcon className="text-white" size={100} />
          <p className="text-white text-xl">Clickez pour demarrer la visioconference</p>
        </div>
        <div className="border border-border rounded-md shadow-2xl w-[350px]">
          <div className="p-4">
            <div className="mb-4">
              <p className="text-primary text-xl font-semibold">Discussion</p>
              <p className="text-sm">4 particiants en ligne</p>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-14 h-14">
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">
                  Thomas du Bois <span className="text-[#979DAC] font-normal">10:02</span>
                </p>
                <p className="text-[#979dac] text-xs">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequatur, molestiae!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-14 h-14">
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">
                  Thomas du Bois <span className="text-[#979DAC] font-normal">10:02</span>
                </p>
                <p className="text-[#979dac] text-xs">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequatur, molestiae!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-14 h-14">
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">
                  Thomas du Bois <span className="text-[#979DAC] font-normal">10:02</span>
                </p>
                <p className="text-[#979dac] text-xs">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequatur, molestiae!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-14 h-14">
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">
                  Thomas du Bois <span className="text-[#979DAC] font-normal">10:02</span>
                </p>
                <p className="text-[#979dac] text-xs">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequatur, molestiae!
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-border p-4 flex items-center gap-4">
            <Input placeholder="Ecrivez votre message..." />
            <Button size="icon">
              <SendIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
