"use client";
import Image from "next/image";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  return (
    <section className="hero relative h-[680px] p-5 md:p-10">
      <div className="relative max-w-[1440px] flex items-center h-full m-auto">
        <div className="max-w-fit flex flex-col gap-10 h-fit justify-center">
          <h1 className="text-[28px] md:text-[40px] relative z-20 text-shadow-md text-white font-bold">
            Bienvenue sur Tantor Learning
          </h1>
          <p className="text-white text-xl md:text-2xl relative z-20 max-w-[750px] text-shadow-md">
            Votre plateforme de formation en ligne professionnelle. Accedez a des formations de
            qualite, ou que vous soyez.
          </p>
          <div className="border border-white flex gap-2.5 items-center px-1.5 md:px-2.5 relative z-20 rounded-full w-full max-w-[500px]">
            <Input
              id="searchInput"
              type="text"
              className=" text-white text-base md:text-xl border-none shadow-none outline-0 focus-visible:ring-0 placeholder:text-white placeholder:text-base"
              placeholder="Trouver votre formation"
            />
            <label
              className="bg-[#0353A4] text-white p-1.5 m-1 rounded-full cursor-pointer"
              htmlFor="searchInput"
            >
              <Search />
            </label>
          </div>
          <div className="relative z-20 flex flex-col md:flex-row gap-5 max-w-[500px]">
            <Button
              className=" bg-white text-[#0353A4] text-[18px] cursor-pointer p-5 py-6 rounded-xl"
              onClick={() => router.push("/trainings")}
            >
              Decouvrir nos formations
            </Button>
            <Button
              className="bg-[#0353A4] text-white  text-[18px] cursor-pointer p-5 py-6 rounded-xl"
              onClick={() => router.push("/signup")}
            >
              S'inscrire maintenant
            </Button>
          </div>
        </div>
        <Image
          src="/hero-bg.png"
          height={100}
          width={400}
          alt="hero image"
          className="absolute z-0 right-5 top-0 h-full w-auto object-cover"
        />
        <div className="absolute -inset-5 md:-inset-10 bg-[#00000094] lg:hidden"></div>
      </div>
    </section>
  );
};
export default Hero;
