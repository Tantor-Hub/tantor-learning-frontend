import { NewsLetter } from "@/components/sections/news-letter";
import { TrainingList } from "@/components/sections/training-list";
import { TrainingListSkeleton } from "@/components/skeletons/training-list-skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Page de liste des formations",
};

export default function Page() {
  return (
    <section className="mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <hgroup className="max-w-lg w-full mx-auto space-y-4 text-center">
          <h1 className="text-2xl text-primary font-semibold mb-4">Catalogue des Formations</h1>
          <p className="font-normal text-muted-foreground text-center">
            Découvrez notre catalogue complet de formations professionnelles adaptées à vos besoins
            et à votre parcours.
          </p>
        </hgroup>
        <Suspense fallback={<TrainingListSkeleton />}>
          <TrainingList />
        </Suspense>
      </div>
      <div className="bg-ring">
        <NewsLetter />
      </div>
    </section>
  );
}
