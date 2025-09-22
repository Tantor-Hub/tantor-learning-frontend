"use client";
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
import Image from "next/image";
import { ArrowDownToLine, Funnel, ChevronDown, Search } from "lucide-react";

import { studentFilter } from "./data";
import StudentsTabs from "./components/table-students";

export default function Page() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-5 md:gap-10 mb-5">
        <div className="flex items-center w-full rounded-md relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} />
          </div>
          <Input
            type="search"
            placeholder="Rechercher Un document..."
            className="pl-10 pr-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 flex gap-2 items-center px-2.5 py-1.5 min-w-28 rounded-md border border-primary text-primary shadow-md">
            <Funnel size={20} />
            <span>Filtres</span>
            <ChevronDown />
          </div>
          <Button>
            {" "}
            <ArrowDownToLine />
            Telecharger
          </Button>
        </div>
      </div>
      <div className="border p-8 flex flex-col items-end gap-7 rounded-md shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-10 w-full">
          {studentFilter.map((filter, i) => (
            <div key={i} className="flex flex-col gap-[7px]">
              <span className="font-semibold">{filter.label}</span>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={filter.value} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="most-recent">{filter.value}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <Button className="bg-transparent border border-[#cbd9e7] text-[#ACACAC]">
          <Image src="/icons/close.svg" height={20} width={20} alt="close icon" />
          Renitialiser les filtres
        </Button>
      </div>

      <div>
        <div className="overflow-x-auto p-8 shadow-md my-5 border border-border rounded-md">
          <div>
            <div className="min-w-[1000px]">
              <StudentsTabs />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
