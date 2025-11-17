"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BooksTab } from "./BooksTab";
import { BookCategoriesTab } from "./BookCategoriesTab";

export default function Page() {
  const [activeTab, setActiveTab] = useState("books");

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="books">Livres</TabsTrigger>
          <TabsTrigger value="categories">Catégories de livres</TabsTrigger>
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
