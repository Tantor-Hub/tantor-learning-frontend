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
import { MoreHorizontal } from "lucide-react";
import { useGetBooksQuery, useDeleteBookMutation } from "@/lib/apis/book";
import { Book } from "@/types/book";
import { CreateBookModal } from "./create-book-modal";

export function BooksTab() {
  // Books hooks
  const { data: booksResponse, isLoading: booksLoading } = useGetBooksQuery({});
  const books = booksResponse?.data || [];
  const [deleteBook] = useDeleteBookMutation();

  // State for dialog
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setBookDialogOpen(true);
  };

  const handleDeleteBook = async (id: string) => {
    await deleteBook(id);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Livres</h2>
        <Button
          onClick={() => {
            setEditingBook(null);
            setBookDialogOpen(true);
          }}
        >
          Ajouter un livre
        </Button>
      </div>
      {booksLoading ? (
        <p>Chargement...</p>
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
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.status === "premium" ? "Premium" : "Gratuit"}</TableCell>
                <TableCell>{book.views}</TableCell>
                <TableCell>{book.download}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditBook(book)}>
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteBook(book.id)}
                        className="text-destructive"
                      >
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <CreateBookModal
        open={bookDialogOpen}
        onOpenChange={setBookDialogOpen}
        editingBook={editingBook}
        onSuccess={() => {
          setEditingBook(null);
        }}
      />
    </>
  );
}
