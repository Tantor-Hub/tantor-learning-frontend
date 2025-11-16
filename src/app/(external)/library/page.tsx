"use client";

import { useGetBooksQuery } from "@/lib/apis/book";
import { Book } from "@/types/book";
import Image from "next/image";
import Link from "next/link";
import { Download, Eye, BookOpen, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LibraryPage() {
  const { data: books = [], isLoading, error } = useGetBooksQuery();

  if (error) {
    return (
      <section className="mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center py-12">
            <p className="text-red-500">Error loading books. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <hgroup className="max-w-lg w-full mx-auto space-y-4 text-center mb-12">
          <h1 className="text-3xl md:text-4xl text-primary font-semibold mb-4">Bibliothèque</h1>
          <p className="font-normal text-muted-foreground text-center text-lg">
            Découvrez notre collection complète de livres et ressources pédagogiques
          </p>
        </hgroup>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun livre disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function BookCard({ book }: { book: Book }) {
  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/library/${book.id}`} className="cursor-pointer">
        <div className="relative w-full h-48 bg-muted">
          {book.icon ? (
            <Image
              src={book.icon}
              alt={book.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <BookOpen className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant={book.status === "premium" ? "default" : "secondary"}>
              {book.status === "premium" ? "Premium" : "Gratuit"}
            </Badge>
          </div>
        </div>
      </Link>
      <CardHeader className="flex-grow">
        <Link
          href={`/library/${book.id}`}
          className="cursor-pointer hover:text-primary transition-colors"
        >
          <CardTitle className="line-clamp-2">{book.title}</CardTitle>
        </Link>
        <CardDescription className="flex items-center gap-2 mt-2">
          <User className="h-4 w-4" />
          <span className="line-clamp-1">{book.author || "Auteur inconnu"}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {book.description || "Aucune description disponible."}
        </p>
        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{book.views || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>{book.download || 0}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link href={`/library/${book.id}`} className="flex-1">
          <Button variant="default" className="w-full">
            <BookOpen className="h-4 w-4 mr-2" />
            Voir le livre
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
