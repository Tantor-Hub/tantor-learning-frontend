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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} from "@/lib/apis/book";
import { Book, CreateBookRequest, UpdateBookRequest } from "@/types/book";

export function BooksTab() {
  // Books hooks
  const { data: books = [], isLoading: booksLoading } = useGetBooksQuery();
  const [createBook] = useCreateBookMutation();
  const [updateBook] = useUpdateBookMutation();
  const [deleteBook] = useDeleteBookMutation();

  // State for dialog
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Form state
  const [bookForm, setBookForm] = useState<Partial<CreateBookRequest & UpdateBookRequest>>({});

  const handleCreateBook = async () => {
    if (editingBook) {
      await updateBook({ id: editingBook.id, body: bookForm as UpdateBookRequest });
    } else {
      await createBook({
        ...bookForm,
        title: bookForm.title || "",
        description: bookForm.description || "",
        session: bookForm.session || [],
        author: bookForm.author || "",
        status: bookForm.status || "free",
        category: bookForm.category || [],
        public: bookForm.public ?? true,
        // icon and piece_joint are Files, set to null or handle file input separately
        icon: null as any,
        piece_joint: null as any,
      } as CreateBookRequest);
    }
    setBookDialogOpen(false);
    setEditingBook(null);
    setBookForm({});
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      description: book.description,
      session: book.session,
      author: book.author,
      status: book.status,
      category: book.category,
      public: true, // Default or from book if available
    });
    setBookDialogOpen(true);
  };

  const handleDeleteBook = async (id: string) => {
    await deleteBook(id);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Books</h2>
        <Button
          onClick={() => {
            setEditingBook(null);
            setBookForm({});
            setBookDialogOpen(true);
          }}
        >
          Add Book
        </Button>
      </div>
      {booksLoading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditBook(book)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteBook(book.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Book Dialog */}
      <Dialog open={bookDialogOpen} onOpenChange={setBookDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingBook ? "Edit Book" : "Add Book"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={bookForm.title || ""}
                onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={bookForm.description || ""}
                onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={bookForm.author || ""}
                onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={bookForm.status || "free"}
                onValueChange={(value) =>
                  setBookForm({ ...bookForm, status: value as "premium" | "free" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Note: File uploads for icon and piece_joint would require additional components like file input and handling */}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setBookDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBook}>{editingBook ? "Update" : "Create"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
