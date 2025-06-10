import { BookOpen } from "lucide-react";

export default function Page() {
  // from-slate-50 to-slate-100
  return (
    <div className="min-h-[50vh] bg-gradient-to-br flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Titre */}
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Bibliothèque Générale</h1>

        {/* Message d'état vide */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
          <p className="text-lg text-slate-600 mb-4">Aucun livre disponible pour le moment</p>
          <p className="text-sm text-slate-500">La collection sera bientôt disponible</p>
        </div>
      </div>
    </div>
  );
}
