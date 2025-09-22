"use client";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="max-w-[505px] flex flex-col items-center text-center gap-[16px] md:gap-[28px] pb-[25px] md:pb-[50px]">
        <h1 className="text-4xl font-black bg-gradient-to-b from-primary to-blue-200 bg-clip-text text-transparent">
          Oops!
        </h1>
        <h2 className="text-2xl font-semibold">404 - Page non trouvée</h2>
        <p className="font-light text-muted-foreground">
          La page que vous recherchez a peut-être été supprimée, renommée ou est temporairement
          indisponible.
        </p>
      </div>
      <Button
        size="lg"
        className="hover:bg-blue-500 hover:cursor-pointer transition-colors"
        onClick={() => router.push("/")}
      >
        Retour à l'accueil <ArrowRightIcon />
      </Button>
    </div>
  );
}
