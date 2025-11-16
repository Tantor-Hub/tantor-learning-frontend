"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BooksTab } from "./BooksTab";
import { BookCategoriesTab } from "./BookCategoriesTab";

export default function Page() {
  const [activeTab, setActiveTab] = useState("books");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bibliotheque</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="categories">Book Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="books">
          <BooksTab />
        </TabsContent>
        <TabsContent value="categories">
          <BookCategoriesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
