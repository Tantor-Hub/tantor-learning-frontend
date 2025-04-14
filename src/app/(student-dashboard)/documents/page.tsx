"use client";

import { useState } from "react";
import { Download, Filter, Search, Bell, X, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-24 bg-white flex flex-col items-center py-4 border-r">
        <div className="mb-8">
          <img src="/api/placeholder/60/60" alt="Tantor Logo" className="w-14 h-14" />
        </div>
        <div className="flex flex-col items-center gap-8 flex-grow">
          <button className="p-3 rounded-md hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button className="p-3 rounded-md hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          <button className="p-3 rounded-md hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
          <button className="p-3 rounded-md hover:bg-gray-100 bg-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
          <button className="p-3 rounded-md hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <button className="p-3 rounded-md hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button className="p-3 rounded-md hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white p-4 flex items-center justify-between border-b">
          <h1 className="text-xl font-semibold text-blue-600">Mes Documents</h1>
          <div className="relative flex-1 mx-16">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div>
                <div className="font-medium">user004</div>
                <div className="text-xs text-green-500 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  En ligne
                </div>
              </div>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
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
      </div>
    </div>
  );
}