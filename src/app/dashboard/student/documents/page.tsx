"use client";
import { useState } from "react";
import { Download, Filter, Search, X, Eye } from "lucide-react";

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <main className="h-screen flex-1 p-6 overflow-auto">
      {/* Search Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher Un document..."
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium border rounded-md">
            <Filter className="w-4 h-4" /> Filtres
          </button>
          <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md">
            <Download className="w-4 h-4" /> Telecharger
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <select className="w-full p-2 border rounded-md bg-white">
              <option>10/04/2025</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select className="w-full p-2 border rounded-md bg-white">
              <option>tous les documents</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Formateurs</label>
            <select className="w-full p-2 border rounded-md bg-white">
              <option>Comptabilité et Finance (DCG, DSCG)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Durée</label>
            <select className="w-full p-2 border rounded-md bg-white">
              <option>Courte (&lt; 1h)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Etats</label>
            <select className="w-full p-2 border rounded-md bg-white">
              <option>à venir</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <select className="w-full p-2 border rounded-md bg-white">
              <option>0-20</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="flex items-center text-sm text-gray-500">
            <X className="w-4 h-4 mr-1" /> Réinitialiser les filtres
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full">
        {/* Custom Tabs */}
        <div className="flex mb-4">
          <button
            className={`px-6 py-3 font-medium ${activeTab === "all" ? "bg-blue-600 text-white" : "bg-white"} rounded-l-md`}
            onClick={() => setActiveTab("all")}
          >
            Tous les documents
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === "shared" ? "bg-blue-600 text-white" : "bg-white"}`}
            onClick={() => setActiveTab("shared")}
          >
            Partages avec moi
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === "recent" ? "bg-blue-600 text-white" : "bg-white"} rounded-r-md`}
            onClick={() => setActiveTab("recent")}
          >
            Recents
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "all" && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-blue-600">Tous les documents</h2>
              <p className="text-sm text-gray-500">Liste de tous vos documents disponibles</p>
            </div>

            {/* Document Table */}
            <div className="bg-white rounded-md shadow-sm overflow-hidden">
              <div className="grid grid-cols-6 px-6 py-3 text-sm font-medium bg-gray-100">
                <div>Noms</div>
                <div>Type</div>
                <div>Taille</div>
                <div>Date</div>
                <div>Catégorie</div>
                <div>Actions</div>
              </div>

              {/* Document Row 1 */}
              <div className="grid grid-cols-6 px-6 py-4 border-t items-center text-sm">
                <div>Cours d'introduction au management</div>
                <div>
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">PDF</span>
                </div>
                <div>2.6MB</div>
                <div>12/04/2025</div>
                <div>Cours</div>
                <div className="flex items-center gap-3">
                  <button className="text-blue-500">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="text-blue-500">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Document Row 2 */}
              <div className="grid grid-cols-6 px-6 py-4 border-t items-center text-sm">
                <div>TPI - Recherche sur l'impact du mgt1</div>
                <div>
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">DOCX</span>
                </div>
                <div>1.8MB</div>
                <div>15/04/2025</div>
                <div>TPI</div>
                <div className="flex items-center gap-3">
                  <button className="text-blue-500">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="text-blue-500">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "shared" && (
          <div className="bg-white rounded-md shadow-sm p-8 text-center text-gray-500">
            <p>Aucun document partagé pour le moment</p>
          </div>
        )}

        {activeTab === "recent" && (
          <div className="bg-white rounded-md shadow-sm p-8 text-center text-gray-500">
            <p>Aucun document récent</p>
          </div>
        )}
      </div>
    </main>
  );
}
