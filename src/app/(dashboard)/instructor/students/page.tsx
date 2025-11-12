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
