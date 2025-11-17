"use client";

import {
  useGetBookByIdQuery,
  useIncrementBookViewsMutation,
  useIncrementBookDownloadCountMutation,
} from "@/lib/apis/book";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Download, Eye, BookOpen, User, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;
  const hasIncrementedView = useRef(false);

  const { data: book, isLoading, error } = useGetBookByIdQuery(bookId);
  const [incrementViews] = useIncrementBookViewsMutation();
  const [incrementDownloadCount] = useIncrementBookDownloadCountMutation();

  // Increment views when page loads (only once)
  useEffect(() => {
    if (book && !hasIncrementedView.current) {
      hasIncrementedView.current = true;
      incrementViews(bookId).catch((err) => {
        console.error("Failed to increment views:", err);
      });
    }
  }, [book, bookId, incrementViews]);

  const handleDownload = async () => {
    if (!book?.piece_joint) {
      toast.error("Aucun fichier disponible pour téléchargement");
      return;
    }

    try {
      // Increment download count
      await incrementDownloadCount(bookId).unwrap();

      // Open the file in a new tab
      window.open(book.piece_joint, "_blank");

      toast.success("Téléchargement démarré");
    } catch (error) {
      console.error("Failed to increment downloads:", error);
      // Still open the file even if increment fails
      window.open(book.piece_joint, "_blank");
    }
  };

  if (error) {
    const isPaymentRequired = "status" in error && error.status === 402;
    return (
      <section className="mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
          <div className="max-w-md mx-auto">
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <BookOpen className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle className="text-destructive">
                  {isPaymentRequired ? "Accès refusé" : "Erreur de chargement"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <CardDescription className="text-base">
                  {isPaymentRequired
                    ? "Veuillez finaliser le paiement d'une session liée à ce livre pour accéder au contenu."
                    : "Une erreur s'est produite lors du chargement du livre. Veuillez réessayer plus tard."}
                </CardDescription>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => router.push("/library")}
                    variant="outline"
                    className="w-full"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour à la bibliothèque
                  </Button>
                  {isPaymentRequired && (
                    <Button onClick={() => router.push("/dashboard")} className="w-full">
                      Aller au tableau de bord
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <Button onClick={() => router.push("/library")} variant="outline" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la bibliothèque
        </Button>

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Skeleton className="w-full h-96" />
              </div>
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>
        ) : book ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Book Cover Section */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <div className="relative w-full aspect-[3/4] bg-muted">
                  {book.icon ? (
                    <Image
                      src={book.icon}
                      alt={book.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="h-24 w-24 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-center mb-4">
                    <Badge
                      variant={book.status === "premium" ? "default" : "secondary"}
                      className="text-sm"
                    >
                      {book.status === "premium" ? "Premium" : "Gratuit"}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>{book.views || 0} vues</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Download className="h-4 w-4" />
                      <span>{book.download || 0} téléchargements</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Book Details Section */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{book.title}</h1>
                <div className="flex items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="text-lg">{book.author || "Auteur inconnu"}</span>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {book.description || "Aucune description disponible."}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Créé le: </span>
                    <span>{new Date(book.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                  {book.category && book.category.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="flex flex-wrap gap-2">
                        {book.category.map((catId, index) => (
                          <Badge key={index} variant="outline">
                            {catId}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {book.piece_joint && (
                  <>
                    {book.downloadable !== false && (
                      <Button onClick={handleDownload} size="lg" className="flex-1">
                        <Download className="h-5 w-5 mr-2" />
                        Télécharger le livre
                      </Button>
                    )}
                    <Button
                      onClick={() => window.open(book.piece_joint, "_blank")}
                      variant="outline"
                      size="lg"
                      className="flex-1"
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      Ouvrir dans un nouvel onglet
                    </Button>
                  </>
                )}
              </div>

              {/* Book Viewer */}
              {book.piece_joint && (
                <Card>
                  <CardHeader>
                    <CardTitle>Aperçu du livre</CardTitle>
                    <CardDescription>
                      Visualisez le contenu du livre directement dans cette page
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-[600px] border rounded-lg overflow-hidden">
                      <iframe src={book.piece_joint} className="w-full h-full" title={book.title} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Livre introuvable.</p>
          </div>
        )}
      </div>
    </section>
  );
}
