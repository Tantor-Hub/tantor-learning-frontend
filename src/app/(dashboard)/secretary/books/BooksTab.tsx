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
import { useGetBooksQuery, useDeleteBookMutation } from "@/lib/apis/book";
import { Book } from "@/types/book";
import { CreateBookModal } from "./create-book-modal";

export function BooksTab() {
  // Books hooks
  const { data: books = [], isLoading: booksLoading } = useGetBooksQuery();
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.status === "premium" ? "Premium" : "Gratuit"}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditBook(book)}
                    className="mr-2"
                  >
                    Modifier
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteBook(book.id)}>
                    Supprimer
                  </Button>
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
