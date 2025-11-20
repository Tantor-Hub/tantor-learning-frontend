"use client";

import { useGetBooksQuery, useIncrementBookViewCountMutation } from "@/lib/apis/book";
import { useGetBookCategoriesQuery } from "@/lib/apis/bookcategory";
import { Book } from "@/types/book";
import { BookCategory } from "@/types/bookcategory";
import Image from "next/image";
import Link from "next/link";
import { Download, Eye, BookOpen, User, Filter, Search } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function LibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [minViews, setMinViews] = useState<string>("");
  const [minDownloads, setMinDownloads] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(20);

  const { data: categories } = useGetBookCategoriesQuery();

  const queryParams = {
    ...(selectedCategory && { category: selectedCategory }),
    ...(author && { author }),
    ...(minViews && { minViews: parseInt(minViews) }),
    ...(minDownloads && { minDownload: parseInt(minDownloads) }),
    ...(search && { search }),
    ...(selectedStatus && { status: selectedStatus }),
    page,
    limit,
  };

  const { data: booksResponse, isLoading, error } = useGetBooksQuery(queryParams);
  const books = booksResponse?.data || [];
  const totalPages = booksResponse?.totalPages || 1;

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

  const handleFilterChange = () => {
    setPage(1); // Reset to first page when filters change
  };

  return (
    <section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <hgroup className="max-w-lg w-full mx-auto space-y-4 text-center mb-12">
          <h1 className="text-3xl md:text-4xl text-primary font-semibold mb-4">Bibliothèque</h1>
          <p className="font-normal text-muted-foreground text-center text-lg">
            Découvrez notre collection complète de livres et ressources pédagogiques
          </p>
        </hgroup>

        {/* Filters Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  value={selectedCategory || "all"}
                  onValueChange={(value) => {
                    setSelectedCategory(value === "all" ? "" : value);
                    handleFilterChange();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories?.data?.map((category: BookCategory) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Auteur</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="author"
                    placeholder="Rechercher par auteur..."
                    value={author}
                    onChange={(e) => {
                      setAuthor(e.target.value);
                      handleFilterChange();
                    }}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={selectedStatus || "all"}
                  onValueChange={(value) => {
                    setSelectedStatus(value === "all" ? "" : value);
                    handleFilterChange();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="free">Gratuit</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minViews">Vues minimum</Label>
                <Input
                  id="minViews"
                  type="number"
                  placeholder="0"
                  value={minViews}
                  onChange={(e) => {
                    setMinViews(e.target.value);
                    handleFilterChange();
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minDownloads">Téléchargements minimum</Label>
                <Input
                  id="minDownloads"
                  type="number"
                  placeholder="0"
                  value={minDownloads}
                  onChange={(e) => {
                    setMinDownloads(e.target.value);
                    handleFilterChange();
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
          <div className="flex flex-col items-center justify-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Aucun livre trouvé</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Aucun livre ne correspond à vos critères de recherche. Essayez de modifier vos filtres
              ou de rechercher un autre terme.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book: Book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage(Math.max(1, page - 1))}
                        className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setPage(pageNum)}
                          isActive={page === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        className={
                          page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function BookCard({ book }: { book: Book }) {
  const [incrementView] = useIncrementBookViewCountMutation();

  const handleViewClick = () => {
    incrementView(book.id);
  };

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
        <Link href={`/library/${book.id}`} onClick={handleViewClick} className="flex-1">
          <Button variant="default" className="w-full">
            <BookOpen className="h-4 w-4 mr-2" />
            Voir le livre
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
