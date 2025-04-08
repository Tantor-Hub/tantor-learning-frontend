"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="max-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <Image src="/kids_studying.svg" alt="kids_studying" width={1000} height={1000} />
          <p className="mt-6 text-blue-700 font-semibold text-lg">
            Accédez à des formations de qualité, où
          </p>
          <p className="mt-6 text-blue-700 font-semibold font-poppins text-lg">que vous soyez.</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center space-y-6">
          <h2 className="text-2xl font-extrabold poppins text-blue-800">TANTOR–LEARNING</h2>
          <p className="text-md font-semibold text-blue-950">Réinitialisation réussie</p>
          <Image src="/check-icon.svg" alt="check" width={60} height={60} className="mx-auto" />
          <p className="text-blue-950 font-semibold">Réussi</p>
          <Button
            className="w-full bg-blue-900 text-white font-poppins hover:bg-blue-900"
            onClick={() => router.push("/")}
          >
            Continuer
          </Button>
        </div>
      </div>
    </div>
  );
}
