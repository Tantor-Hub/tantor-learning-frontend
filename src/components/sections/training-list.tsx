"use client";
import { useState, useMemo } from "react";
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
import { ArrowRight, Funnel, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useGetTrainingsWithSessionsQuery } from "@/lib/apis/public/public-api";
import { TrainingListSkeleton } from "../skeletons/training-list-skeleton";
import { ITrainingType } from "@/types/secretary/training-secretary";

// Define types based on the new API response
interface Formation {
  id: string;
  title: string;
  subtitle: string;
  type?: string; // public API variant
  trainingtype?: ITrainingType; // secretary types variant
  description: string;
  prix: string | number; // can be numeric or string
  category?: {
    title: string;
  };
  trainingCategory?: {
    title: string;
  };
}

// Types for filters
interface FilterState {
  modalite: string;
  categorie: string;
  prix: string;
}

// Filter options
const filterOptions = {
  modalite: ["Toutes les modalités", ...Object.values(ITrainingType)],
  prix: ["Tous les prix", "0-500€", "500-1000€", "1000-2000€", "2000€+"],
};

export function TrainingList() {
  // States for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [isShown, setIsShown] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    modalite: "Toutes les modalités",
    categorie: "Toutes les catégories",
    prix: "Tous les prix",
  });

  const { data, isLoading } = useGetTrainingsWithSessionsQuery();

  console.log(data);
  console.log(JSON.stringify(data));

  // Build dynamic categories from API data
  const categories = useMemo(() => {
    const list: Formation[] = Array.isArray(data?.data) ? (data?.data as Formation[]) : [];
    const unique = new Set<string>();
    list.forEach((item) => {
      const name =
        (item as any).category?.title?.trim() || (item as any).trainingCategory?.title?.trim();
      if (name) unique.add(name);
    });
    return ["Toutes les catégories", ...Array.from(unique)];
  }, [data]);

  // Filter and search function
  const filteredData = useMemo(() => {
    const list: Formation[] = Array.isArray(data?.data) ? (data?.data as Formation[]) : [];
    if (!list.length) return [];

    return list.filter((item) => {
      const matchesSearch =
        searchTerm === "" || item.title.toLowerCase().includes(searchTerm.toLowerCase());

      // Modalité: match contains to handle values like "En présentiel"
      const matchesModalite = (() => {
        if (filters.modalite === "Toutes les modalités") return true;
        const selected = filters.modalite.toLowerCase();
        const itemType = ((item as any).type || (item as any).trainingtype || "")
          .toString()
          .toLowerCase();
        return itemType.includes(selected);
      })();

      // Catégorie: exact (case-insensitive) match against category.title
      const matchesCategorie = (() => {
        if (filters.categorie === "Toutes les catégories") return true;
        const selected = filters.categorie.toLowerCase();
        const cat = ((item as any).category?.title || (item as any).trainingCategory?.title || "")
          .toString()
          .toLowerCase();
        return !!cat && cat === selected;
      })();

      // Prix: numeric range filtering
      const matchesPrix = (() => {
        if (filters.prix === "Tous les prix") return true;
        const priceValue =
          typeof (item as any).prix === "number"
            ? (item as any).prix
            : parseFloat(((item as any).prix || "0") as string);
        switch (filters.prix) {
          case "0-500€":
            return priceValue >= 0 && priceValue < 500;
          case "500-1000€":
            return priceValue >= 500 && priceValue < 1000;
          case "1000-2000€":
            return priceValue >= 1000 && priceValue < 2000;
          case "2000€+":
            return priceValue >= 2000;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesModalite && matchesCategorie && matchesPrix;
    });
  }, [data, searchTerm, filters]);

  // Update a filter
  const updateFilter = (filterType: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      modalite: "Toutes les modalités",
      categorie: "Toutes les catégories",
      prix: "Tous les prix",
    });
    setSearchTerm("");
  };

  // Check if any filters are active
  const hasActiveFilters =
    Object.values(filters).some(
      (value) => !value.startsWith("Tous") && !value.startsWith("Toutes")
    ) || searchTerm !== "";

  if (isLoading) return <TrainingListSkeleton />;
  return (
    <>
      {/* Starting Line */}
      <div className="flex flex-col sm:flex-row justify-between my-4 gap-5">
        <div className="flex items-center border px-2.5 w-full sm:w-[50%] md:w-[40%] lg:w-[30%] rounded-md">
          <Image src="/icons/search.svg" height={20} width={20} alt="search icon" />
          <Input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-[#ACACAC] border-none focus-visible:outline-none focus-visible:ring-0"
            placeholder="Rechercher par titre de formation..."
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="lg" onClick={() => setIsShown(!isShown)}>
            <Funnel />
            Filtres
            {hasActiveFilters && (
              <span className="ml-2 bg-blue-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                !
              </span>
            )}
          </Button>
          {hasActiveFilters && (
            <Button variant="outline" size="lg" onClick={resetFilters}>
              <X className="w-4 h-4" />
              Effacer
            </Button>
          )}
        </div>
      </div>

      {/* Filters section */}
      {isShown && (
        <div className="border p-8 flex flex-col items-end gap-7 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-10 w-full">
            <div className="flex flex-col gap-[7px]">
              <span>Modalité d'enseignement</span>
              <Select
                value={filters.modalite}
                onValueChange={(value) => updateFilter("modalite", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {filterOptions.modalite.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-[7px]">
              <span>Catégorie de formation</span>
              <Select
                value={filters.categorie}
                onValueChange={(value) => updateFilter("categorie", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-[7px]">
              <span>Prix</span>
              <Select value={filters.prix} onValueChange={(value) => updateFilter("prix", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {filterOptions.prix.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            variant="outline"
            className="bg-transparent border border-[#0466C8] text-[#ACACAC]"
            onClick={resetFilters}
          >
            <Image src="/icons/close.svg" height={20} width={20} alt="close icon" />
            Réinitialiser les filtres
          </Button>
        </div>
      )}

      {/* Results count */}
      <div>
        <p className="text-gray-600">
          {filteredData.length} formation{filteredData.length > 1 ? "s" : ""} trouvée
          {filteredData.length > 1 ? "s" : ""}
          {hasActiveFilters && " (filtré)"}
        </p>
      </div>

      {/* Formations grid */}
      <div className="py-4 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
        {filteredData.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Funnel className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600">Aucune formation trouvée</h3>
              <p className="text-gray-500 max-w-md">
                Aucune formation ne correspond à vos critères de recherche. Essayez de modifier vos
                filtres ou votre terme de recherche.
              </p>
              <Button variant="outline" onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
        ) : (
          filteredData.map((item: Formation) => (
            <div key={item.id} className="border border-blue-200 rounded-[6px] shadow-sm max-w-md">
              <div className="p-5 bg-[#007AFF26] flex flex-col gap-4">
                <h2 className="text-xl font-semibold text-blue-900">{item.title}</h2>
                <p className="text-gray-700 font-medium">{item.subtitle}</p>
              </div>
              <div className="p-10 pt-5 flex flex-col gap-4">
                <p className="text-[#5C677D] mt-4 mb-5">
                  {item.description.length >= 80
                    ? item.description.substring(0, 80) + "..."
                    : item.description}
                </p>

                <div className="flex gap-2.5">
                  <Image src="/icons/house.svg" height={20} width={20} alt="house icon" />
                  <p className="text-black">{(item.type || item.trainingtype || "").toString()}</p>
                </div>
                {item.category?.title && (
                  <div className="flex items-center gap-2.5">
                    <Image
                      src="/icons/graduation.svg"
                      height={20}
                      width={20}
                      alt="graduation icon"
                    />
                    {item.category.title}
                  </div>
                )}
                <div className="flex items-center gap-2.5">
                  <Image src="/icons/money.svg" height={20} width={20} alt="money icon" />
                  {Number(item.prix)} &euro;
                </div>
                <Link href={`/trainings/${item.id}`}>
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary"
                    size="lg"
                  >
                    En savoir plus
                    <ArrowRight />
                  </Button>
                </Link>
                {/* to remove later */}
                {/* <ListSeance
                    title={item.titre}
                    description={item.description}
                    id={item.id.toString()}
                  /> */}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
