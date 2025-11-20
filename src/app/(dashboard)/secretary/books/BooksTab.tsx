"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { useGetBooksForSecretaryQuery, useDeleteBookMutation } from "@/lib/apis/book";
import { Book } from "@/types/book";
import { CreateBookModal } from "./create-book-modal";
import { UpdateBookModal } from "./update-book-modal";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

export function BooksTab() {
  // Books hooks
  const { data: booksResponse, isLoading: booksLoading } = useGetBooksForSecretaryQuery({});
  const books = booksResponse?.data || [];
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

  // State for dialog
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [updateBookDialogOpen, setUpdateBookDialogOpen] = useState(false);
  const [updatingBookId, setUpdatingBookId] = useState<string>("");
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setBookDialogOpen(true);
  };

  const handleUpdateBook = (bookId: string) => {
    setUpdatingBookId(bookId);
    setUpdateBookDialogOpen(true);
  };

  const handleDeleteBook = async (id: string) => {
    try {
      setDeletingBookId(id);
      const loadingToastId = toast.loading("Suppression du livre...");

      await deleteBook(id).unwrap();

      toast.success("Livre supprimé avec succès !", { id: loadingToastId });
      setDeletingBookId(null);
    } catch (error: any) {
      console.error("Error deleting book:", error);
      toast.error(error?.data?.message || "Erreur lors de la suppression du livre");
      setDeletingBookId(null);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Livres</h2>
        <CreateBookModal />
      </div>
      {booksLoading ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Auteur</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Vues</TableHead>
              <TableHead>Téléchargements</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Auteur</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Vues</TableHead>
              <TableHead>Téléchargements</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => {
              const isDeletingThis = deletingBookId === book.id;
              return (
                <TableRow key={book.id} className={isDeletingThis ? "opacity-50" : ""}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.status === "premium" ? "Premium" : "Gratuit"}</TableCell>
                  <TableCell>{book.views}</TableCell>
                  <TableCell>{book.download}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isDeletingThis}>
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleUpdateBook(book.id)}
                          disabled={isDeletingThis}
                        >
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteBook(book.id)}
                          className="text-destructive"
                          disabled={isDeletingThis}
                        >
                          {isDeletingThis ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Suppression...
                            </>
                          ) : (
                            "Supprimer"
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <UpdateBookModal
        open={updateBookDialogOpen}
        onOpenChange={setUpdateBookDialogOpen}
        bookId={updatingBookId}
        onSuccess={() => {
          setUpdatingBookId("");
        }}
      />
    </>
  );
}
