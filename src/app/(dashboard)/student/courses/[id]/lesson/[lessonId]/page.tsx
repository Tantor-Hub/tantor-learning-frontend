"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, FileText } from "lucide-react";
import { useGetLessonDocumentsQuery } from "@/lib/apis/lessondocument";

export default function LessonMaterialsPage() {
  const { id: courseId, lessonId } = useParams();
  const router = useRouter();

  const { data, isLoading, error } = useGetLessonDocumentsQuery(
    { lessonId: lessonId as string },
    { skip: !lessonId }
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error instanceof Error ? error.message : "An error occurred"}
      </div>
    );
  }

  const documents = data?.data.lessondocuments || [];
  const total = data?.data.total || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Retour aux leçons
        </Button>
        <h1 className="text-2xl font-bold">Matériaux de la leçon</h1>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucun document disponible pour cette leçon.</p>
        </div>
      ) : (
        <>
          <p className="text-muted-foreground">
            {total} document{total > 1 ? "s" : ""} disponible{total > 1 ? "s" : ""}
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((document) => (
              <Card key={document.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{document.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{document.description}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>Type: {document.type}</span>
                    <span>
                      Par: {document.creator.firstName} {document.creator.lastName}
                    </span>
                  </div>
                  <Button
                    onClick={() => window.open(document.download_url, "_blank")}
                    className="w-full"
                    disabled={!document.ispublish}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {document.ispublish ? "Télécharger" : "Non publié"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
