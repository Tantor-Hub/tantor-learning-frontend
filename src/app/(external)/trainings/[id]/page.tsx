"use client";

import Link from "next/link";
import { Suspense, use } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import SessionList from "./session-list";
import SessionListSkeleton from "./session-list-skeleton";
import { useGetCatalogueFormationsByTrainingIdPublicQuery } from "@/lib/apis/catalogue-formation";

export default function Page(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const trainingId = params.id;
  const { data: catalogueData } = useGetCatalogueFormationsByTrainingIdPublicQuery(trainingId);
  const catalogue = catalogueData?.data?.[0]; // Assuming single student catalogue per training

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 space-y-8">
      <div className="flex justify-between items-center">
        <Link href="/trainings">
          <Button variant="outline" className="border-primary text-primary" size="lg">
            <ArrowLeft />
            Retour aux formations
          </Button>
        </Link>

        {catalogue && catalogue.piece_jointe && (
          <Button
            variant="outline"
            className="border-primary text-primary"
            size="lg"
            onClick={() => window.open(catalogue.piece_jointe!, "_blank")}
          >
            <Download />
            Catalogue de formation
          </Button>
        )}
      </div>

      <Suspense fallback={<SessionListSkeleton />}>
        {/* RTK Query runs inside client SessionList; Suspense shows skeleton while it fetches */}
        <SessionList trainingId={trainingId} />
      </Suspense>
    </div>
  );
}
