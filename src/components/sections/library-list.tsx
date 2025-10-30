"use client";
import { useGetAllBooksInLibraryQuery } from "@/lib/apis/public/public-api";
import { EmptyState } from "@/components/shared/empty-state";
import { selectIsAuthenticated } from "@/features/auth/auth-slice";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { TrainingListSkeleton } from "../skeletons/training-list-skeleton";
import { useAuth } from "@/hooks/use-auth";

export function LibraryList() {
  const { data, isLoading } = useGetAllBooksInLibraryQuery();
  const router = useRouter();
  // const isAuthenticated = useAuth(); // Use the improved useAuth hook for server-side validation
  if (isLoading) return <TrainingListSkeleton />;
  // if (!isAuthenticated) {
  //   toast("Vous devez créer un compte pour accéder à cette fonctionnalité");
  //   router.push("/signin");
  //   return;
  // }

  // console.log("data: ", data);

  // Check if we have books data
  const books = data?.data?.rows || [];
  const hasNoBooks = books.length === 0;

  return (
    <div className="mx-auto">
      {hasNoBooks ? (
        <div className="flex items-center justify-center">
          <EmptyState
            icon="BookOpen"
            title="Aucun livre disponible pour le moment"
            description="La collection sera bientôt disponible."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book: any) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow"
            >
              {/* Book Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-20 bg-blue-100 rounded flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              {/* Book Title */}
              <h3 className="text-xl font-semibold text-slate-800 mb-3 text-center">
                {book.Title?.title || "Titre non disponible"}
              </h3>

              {/* Book Description */}
              <p className="text-gray-600 mb-6 text-sm text-center">
                {book.Title?.description || "Description non disponible"}
              </p>

              {/* Action Button */}
              <div className="flex justify-center">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
                  Lire le livre
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
