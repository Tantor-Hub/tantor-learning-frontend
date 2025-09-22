"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/features/auth/auth-slice";

export default function Hero() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return (
    <section className="hero relative mask-b-from-90% h-[100vh] flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-start h-full m-auto">
        <div className="max-w-fit flex flex-col gap-3 py-12 h-fit justify-center text-center md:text-start">
          <h1 className="text-[36px] md:text-[48px] lg:text-[60px] max-w-xl  md:leading-[90px] font-[600] relative z-20 text-shadow-md text-white font-work-sans">
            Bienvenue sur Tantor Learning
          </h1>
          <p className="text-[#FFFFFFCC] font-normal text-[20px] leading-[160%] mb-12 max-w-xl text-xl md:text-2xl relative z-20 text-shadow-md">
            Votre plateforme de formation en ligne professionnelle. Accedez a des formations de
            qualite, ou que vous soyez.
          </p>
          <div className="relative z-20 flex flex-col w-full md:flex-row gap-6 md:max-w-xl">
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white"
              onClick={() => router.push("/trainings")}
            >
              Decouvrir nos formations
            </Button>
            <Button size="lg" onClick={() => router.push("/signup")}>
              {isAuthenticated && "Télécharger le module de Formation"}
              {!isAuthenticated && "S'inscrire maintenant"}
            </Button>
          </div>
        </div>
        <Image
          src="/hero-background.png"
          height={100}
          width={400}
          alt="hero image"
          className="absolute z-0 right-5 top-0 h-full w-auto object-cover"
        />
        <div className="absolute -inset-5 md:-inset-10 bg-ring lg:hidden"></div>
      </div>
    </section>
  );
}
