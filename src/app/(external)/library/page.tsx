import { Suspense } from "react";
import { TrainingListSkeleton } from "@/components/skeletons/training-list-skeleton";
import { LibraryList } from "@/components/sections/library-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bibliothèque",
};

export default function Page() {
  return (
    <div className="my-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h1 className="text-2xl font-semibold text-center mb-8 text-primary">
          Bibliothèque Générale
        </h1>
        <Suspense fallback={<TrainingListSkeleton />}>
          <LibraryList />
        </Suspense>
      </div>
    </div>
  );
}
