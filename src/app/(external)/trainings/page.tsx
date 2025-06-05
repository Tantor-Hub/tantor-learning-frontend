"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Funnel } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import NewsLetter from "../components/newsletter";
import CourseModal from "@/components/course-modal";
import { dcgData } from "./data/index";

const filters = [
  { label: "Niveau", value: "Tous les niveaux" },
  { label: "Modalité d'enseignement", value: "Toutes les modalités" },
  { label: "Catégorie de formation", value: "Comptabilité et Finance (DCG, DSCG)" },
  { label: "Durée", value: "Courte (< 15h)" },
  { label: "Prix", value: "0-500€" },
  { label: "Prix", value: "0-500€" },
];

const dcgArray = Array.from({ length: 9 }, () => ({ ...dcgData }));

export default function Dashboard() {
  const [isShown, setIsShown] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section>
      <div className="max-w-[1440px] m-auto px-5 md:px-10">
        <hgroup className="max-w-[530px] mx-auto flex flex-col gap-[14px] mb-8">
          <h1 className="text-[38px] text-black font-medium">Catalogue des Formations</h1>
          <p className="text-[14px] font-medium text-center">
            Découvrez notre catalogue complet de formations professionnelles adaptées à vos besoins
            et à votre parcours.
          </p>
        </hgroup>

        <div className="flex flex-col sm:flex-row justify-between mb-8 gap-5">
          <div className="flex items-center border px-2.5 w-full sm:w-[50%] md:w-[40%] lg:w-[30%] rounded-md">
            <Image src="/icons/search.svg" height={20} width={20} alt="search icon" />
            <Input
              type="search"
              className="text-[#ACACAC] border-none focus-visible:outline-none focus-visible:ring-0"
              placeholder="Rechercher Une formation ..."
            />
          </div>
          <Button variant="outline" size="lg" onClick={() => setIsShown(!isShown)}>
            <Funnel />
            Filtres
          </Button>
        </div>
        {isShown && (
          <div className="border p-8 flex flex-col items-end gap-7">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-10 w-full">
              {filters.map((filters, i) => (
                <div key={i} className="flex flex-col gap-[7px]">
                  <span>{filters.label}</span>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={filters.value} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="most-recent">{filters.value}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            <Button className="bg-transparent border border-[#0466C8] text-[#ACACAC]">
              {" "}
              <Image src="/icons/close.svg" height={20} width={20} alt="close icon" />
              Renitialiser les filtres
            </Button>
          </div>
        )}
        <div className="py-10  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
          {dcgArray.map((dcgData, i) => (
            <div key={i} className="border border-blue-200 rounded-[6px] shadow-sm max-w-md">
              <div className="p-5 bg-[#007AFF26] flex flex-col gap-4">
                <h2 className="text-xl font-semibold text-blue-900">{dcgData.title}</h2>
                <p className="text-gray-700 font-medium">
                  {dcgData.category} • {dcgData.level}
                </p>
              </div>
              <div className="p-10 pt-5 flex flex-col gap-4">
                <p className="text-[#5C677D] mt-4 mb-5">{dcgData.description}</p>

                <div className="flex gap-2.5">
                  <Image src="/icons/house.svg" height={20} width={20} alt="house icon" />
                  <p className="text-black">
                    {dcgData.modalities.map((modality, index) => (
                      <span key={index}>{modality + ", "}</span>
                    ))}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <Image src="/icons/clock.svg" height={20} width={20} alt="house icon" />
                  {dcgData.duration}
                </div>
                <div className="flex items-center gap-2.5">
                  <Image src="/icons/graduation.svg" height={20} width={20} alt="house icon" />{" "}
                  {dcgData.rncp}
                </div>
                <div className="flex items-center gap-2.5">
                  <Image src="/icons/money.svg" height={20} width={20} alt="house icon" />{" "}
                  {dcgData.price}
                </div>

                <Button
                  className="bg-transparent border border-[#0466C8] hover:shadow-sm hover:shadow-blue-300 h-fit"
                  onClick={() => setModalOpen(true)}
                >
                  <Link
                    href={dcgData.link}
                    className="text-[#5C677D] font-semibold flex justify-between w-full items-center p-[7px_12px]"
                  >
                    <span>Plus de détails</span>
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#0466C8]">
        <NewsLetter />
      </div>
      <CourseModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
