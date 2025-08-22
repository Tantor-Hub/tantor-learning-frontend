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
import NewsLetter from "../components/newsletter";
import { useListFormationsQuery } from "@/lib/apis/public/public-api";
import { Loading } from "@/components/shared/loading";
// import { useApplyToTrainingMutation } from "@/lib/apis/student/training-api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// Define types for your formation data
interface Formation {
  id: number;
  titre: string;
  sous_titre: string;
  id_category: number;
  id_thematic: number | null;
  type_formation: string;
  rnc: string;
  description: string;
  prerequis: string;
  alternance: string;
  status: number;
  prix: number;
  createdAt: string;
  updatedAt: string;
  Category: {
    id: number;
    category: string;
  };
}

interface FormationsResponse {
  data?: {
    list?: Formation[];
  };
}

// Types for filters
interface FilterState {
  niveau: string;
  modalite: string;
  categorie: string;
  duree: string;
  prix: string;
}

// Filter options
const filterOptions = {
  niveau: ["Tous les niveaux", "Débutant", "Intermédiaire", "Avancé"] as const,
  modalite: ["Toutes les modalités", "Présentiel", "Distanciel", "Hybride"] as const,
  categorie: [
    "Toutes les catégories",
    "Comptabilité et Finance (DCG, DSCG)",
    "Management",
    "Marketing",
    "Informatique",
  ] as const,
  duree: ["Toutes les durées", "Courte (< 15h)", "Moyenne (15-50h)", "Longue (> 50h)"] as const,
  prix: ["Tous les prix", "0-500€", "500-1000€", "1000-2000€", "2000€+"] as const,
};

export default function Page() {
  const router = useRouter();
  // const [applySessionMutation, { isLoading: isLoadingApplySessionMutation }] =
  // useApplyToTrainingMutation();

  // States for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [isShown, setIsShown] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    niveau: "Tous les niveaux",
    modalite: "Toutes les modalités",
    categorie: "Toutes les catégories",
    duree: "Toutes les durées",
    prix: "Tous les prix",
  });

  const { data, isLoading } = useListFormationsQuery();

  // Filter and search function
  const filteredData = useMemo(() => {
    if (!data?.data?.list) return [];

    return data?.data.list.filter((item: any) => {
      // Search by title only
      const matchesSearch =
        searchTerm === "" || item.titre.toLowerCase().includes(searchTerm.toLowerCase());

      // Filters - adjust according to your data structure
      const matchesNiveau =
        filters.niveau === "Tous les niveaux" || (item.niveau && item.niveau === filters.niveau);

      const matchesModalite =
        filters.modalite === "Toutes les modalités" ||
        (item.modalite && item.modalite === filters.modalite);

      const matchesCategorie =
        filters.categorie === "Toutes les catégories" ||
        (item.categorie && item.categorie === filters.categorie);

      const matchesDuree =
        filters.duree === "Toutes les durées" || (item.duree && item.duree === filters.duree);

      const matchesPrix =
        filters.prix === "Tous les prix" || (item.prix && item.prix === filters.prix);

      return (
        matchesSearch &&
        matchesNiveau &&
        matchesModalite &&
        matchesCategorie &&
        matchesDuree &&
        matchesPrix
      );
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
      niveau: "Tous les niveaux",
      modalite: "Toutes les modalités",
      categorie: "Toutes les catégories",
      duree: "Toutes les durées",
      prix: "Tous les prix",
    });
    setSearchTerm("");
  };

  // Check if any filters are active
  const hasActiveFilters =
    Object.values(filters).some(
      (value) => !value.startsWith("Tous") && !value.startsWith("Toutes")
    ) || searchTerm !== "";

  if (isLoading) return <Loading />;

  const handleApplySessionMutation = async (id: number) => {
    try {
      // await applySessionMutation({ id_session: id }).unwrap();
      toast.success(
        "Votre demande a bien été prise en compte. Vous recevrez sous peu la liste des documents à fournir pour finaliser votre inscription."
      );
    } catch (error: any) {
      let errorMessage = "Une erreur est survenue lors de votre candidature";

      if (error.data?.message) {
        errorMessage = error.data.message;
      } else if (error.status === 403) {
        errorMessage = "Vous devez compléter votre profil avant de postuler";
      } else if (error.status === 409) {
        errorMessage = "Vous avez déjà postulé à cette session";
      }

      toast.error(errorMessage);
    }
  };

  return (
    <section className="mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <hgroup className="max-w-md mx-auto flex flex-col gap-[14px] mb-8">
          <h1 className="text-3xl text-primary font-semibold mb-6">Catalogue des Formations</h1>
          <p className="font-normal text-muted-foreground text-center">
            Découvrez notre catalogue complet de formations professionnelles adaptées à vos besoins
            et à votre parcours.
          </p>
        </hgroup>

        <div className="flex flex-col sm:flex-row justify-between mb-8 gap-5">
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
          <div className="border p-8 flex flex-col items-end gap-7 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-10 w-full">
              <div className="flex flex-col gap-[7px]">
                <span>Niveau</span>
                <Select
                  value={filters.niveau}
                  onValueChange={(value) => updateFilter("niveau", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {filterOptions.niveau.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

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
                      {filterOptions.categorie.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-[7px]">
                <span>Durée</span>
                <Select
                  value={filters.duree}
                  onValueChange={(value) => updateFilter("duree", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {filterOptions.duree.map((option) => (
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
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredData.length} formation{filteredData.length > 1 ? "s" : ""} trouvée
            {filteredData.length > 1 ? "s" : ""}
            {hasActiveFilters && " (filtré)"}
          </p>
        </div>

        {/* Formations grid */}
        <div className="py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
          {filteredData.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Funnel className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600">Aucune formation trouvée</h3>
                <p className="text-gray-500 max-w-md">
                  Aucune formation ne correspond à vos critères de recherche. Essayez de modifier
                  vos filtres ou votre terme de recherche.
                </p>
                <Button variant="outline" onClick={resetFilters}>
                  Réinitialiser les filtres
                </Button>
              </div>
            </div>
          ) : (
            filteredData.map((item: Formation) => (
              <div
                key={item.id}
                className="border border-blue-200 rounded-[6px] shadow-sm max-w-md"
              >
                <div className="p-5 bg-[#007AFF26] flex flex-col gap-4">
                  <h2 className="text-xl font-semibold text-blue-900">{item.titre}</h2>
                  <p className="text-gray-700 font-medium">{item.sous_titre}</p>
                </div>
                <div className="p-10 pt-5 flex flex-col gap-4">
                  <p className="text-[#5C677D] mt-4 mb-5">
                    {item.description.length >= 80
                      ? item.description.substring(0, 80) + "..."
                      : item.description}
                  </p>

                  <div className="flex gap-2.5">
                    <Image src="/icons/house.svg" height={20} width={20} alt="house icon" />
                    <p className="text-black">{item.type_formation}</p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Image src="/icons/clock.svg" height={20} width={20} alt="clock icon" />
                    {item.alternance}
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Image
                      src="/icons/graduation.svg"
                      height={20}
                      width={20}
                      alt="graduation icon"
                    />
                    {item.rnc.startsWith("RNCP") ? item.rnc : `RNCP${item.rnc}`}
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Image src="/icons/money.svg" height={20} width={20} alt="money icon" />
                    {item.prix} &euro;
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
      </div>

      <div className="bg-ring">
        <NewsLetter />
      </div>
    </section>
  );
}
