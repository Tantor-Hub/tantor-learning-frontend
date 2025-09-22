"use client";
import { useState, useRef, useEffect, WheelEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MentionsLegales } from "./tabs/mentions-legales";
import { CSG } from "./tabs/cgs";
import { CGU } from "./tabs/cgu";
import { CodeEthique } from "./tabs/code-ethique";
import { ROI } from "./tabs/roi";
import { DonneesPersonnelles } from "./tabs/donnees-personnelles";

type Tab = {
  id: string;
  label: string;
};

export default function Page() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const tabs: Tab[] = [
    { id: "codeEthique", label: "CODE ETHIQUE" },
    { id: "cgu", label: "CONDITIONS GENERALES D'UTILISATION" },
    { id: "cgs", label: "CONDITIONS GENERALES DE SERVICE" },
    { id: "mentions", label: "MENTIONS LEGALES" },
    { id: "reglement", label: "REGLEMENT INTERIEUR" },
    { id: "reclamations", label: "POLITIQUE GLOBALE DE RECLAMATIONS" },
    { id: "donnees", label: "POLITIQUE DE PROTECTION DES DONNEES PERSONNELLES" },
  ];

  // Fonction pour obtenir le paramètre tab depuis l'URL
  const getTabFromURL = (): string => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab");

      // Vérifier si le tab existe dans notre liste
      if (tabParam && tabs.some((tab) => tab.id === tabParam)) {
        return tabParam;
      }
    }
    // Retourner le premier élément par défaut
    return tabs[0].id;
  };

  const [activeTab, setActiveTab] = useState(getTabFromURL());

  // Effet pour écouter les changements d'URL
  useEffect(() => {
    const handleURLChange = () => {
      setActiveTab(getTabFromURL());
    };

    // Écouter les événements de navigation
    window.addEventListener("popstate", handleURLChange);

    return () => {
      window.removeEventListener("popstate", handleURLChange);
    };
  }, []);

  // Fonction pour changer d'onglet et mettre à jour l'URL
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);

    // Mettre à jour l'URL sans recharger la page
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tabId);
    window.history.pushState({}, "", url.toString());
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Permettre le scroll avec la molette de la souris
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (scrollRef.current) {
      e.preventDefault();
      scrollRef.current.scrollBy({ left: e.deltaY, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Navigation avec flèches */}
      <div className="relative w-full">
        <div className="flex items-center w-full">
          {/* Flèche gauche */}
          <button
            onClick={scrollLeft}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors z-10 bg-white shadow-sm border"
            aria-label="Faire défiler vers la gauche"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Container des tabs avec scroll */}
          <div className="flex-1 mx-2 overflow-hidden">
            <div
              ref={scrollRef}
              onWheel={handleWheel}
              className="flex overflow-x-auto overflow-y-hidden scrollbar-hide border-b w-full cursor-grab active:cursor-grabbing"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    flex-shrink-0 px-6 py-3 text-sm font-medium whitespace-nowrap
                    transition-colors duration-200 min-w-fit border-b-2
                    ${
                      activeTab === tab.id
                        ? "text-primary border-primary"
                        : "text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Flèche droite */}
          <button
            onClick={scrollRight}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors z-10 bg-white shadow-sm border"
            aria-label="Faire défiler vers la droite"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Contenu des tabs */}
      <div className="mt-6 w-full">
        {activeTab === "codeEthique" && <CodeEthique />}
        {activeTab === "cgu" && <CGU />}
        {activeTab === "cgs" && <CSG />}
        {activeTab === "mentions" && <MentionsLegales />}
        {activeTab === "reglement" && <ROI />}
        {activeTab === "reclamations" && (
          <div className="p-6 w-full">
            <h2 className="text-2xl font-bold mb-4">Politique Globale de Réclamations</h2>
            <p>Contenu de la politique de réclamations...</p>
          </div>
        )}
        {activeTab === "donnees" && <DonneesPersonnelles />}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
