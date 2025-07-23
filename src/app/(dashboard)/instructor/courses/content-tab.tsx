"use client";
import React, { useState } from "react";
import { Plus, X, Save, Trash2, ChevronLeft } from "lucide-react";
import { useAddMatiereMutation } from "@/lib/apis/instructor/instructor";
import { toast } from "react-hot-toast";

interface Chapter {
  id: number;
  chapitre: string;
  paragraphes: string[];
}

interface ContentTabsProps {
  courseId: string;
  initialChapters: Chapter[];
  refetchCourse: () => void;
}

export function ContentTabs({ courseId, initialChapters, refetchCourse }: ContentTabsProps) {
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters || []);
  const [addCourseContent, { isLoading: isLoadingAddCourseContent }] = useAddMatiereMutation();

  const addChapter = (): void => {
    const newChapter: Chapter = {
      id: Date.now(),
      chapitre: "",
      paragraphes: [""],
    };
    setChapters([...chapters, newChapter]);
  };

  const updateChapter = (chapterId: number, field: keyof Chapter, value: string): void => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === chapterId ? { ...chapter, [field]: value } : chapter
      )
    );
  };

  const deleteChapter = (chapterId: number): void => {
    setChapters(chapters.filter((chapter) => chapter.id !== chapterId));
  };

  const addParagraph = (chapterId: number): void => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, paragraphes: [...chapter.paragraphes, ""] }
          : chapter
      )
    );
  };

  const updateParagraph = (chapterId: number, paragraphIndex: number, value: string): void => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              paragraphes: chapter.paragraphes.map((p, index) =>
                index === paragraphIndex ? value : p
              ),
            }
          : chapter
      )
    );
  };

  const deleteParagraph = (chapterId: number, paragraphIndex: number): void => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              paragraphes: chapter.paragraphes.filter((_, index) => index !== paragraphIndex),
            }
          : chapter
      )
    );
  };

  const saveContent = async (): Promise<void> => {
    try {
      const payload = {
        id_cours: Number(courseId),
        content: chapters.map((chapter) => ({
          chapitre: chapter.chapitre,
          paragraphes: chapter.paragraphes.filter((p) => p.trim() !== ""),
        })),
      };

      await addCourseContent(payload).unwrap();
      await refetchCourse();
      toast.success("Contenu ajouté avec succès");
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Chapitres et contenu</h2>
        <button
          onClick={addChapter}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter un chapitre
        </button>
      </div>

      <div className="space-y-6">
        {chapters.map((chapter, chapterIndex) => (
          <div key={chapter.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {chapterIndex + 1}
                </div>
                <input
                  type="text"
                  value={chapter.chapitre}
                  onChange={(e) => updateChapter(chapter.id, "chapitre", e.target.value)}
                  className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 flex-1"
                  placeholder="Titre du chapitre"
                />
              </div>
              <button
                onClick={() => deleteChapter(chapter.id)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {chapter.paragraphes.map((paragraphe, paragraphIndex) => (
                <div key={paragraphIndex} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-2">
                    {paragraphIndex + 1}
                  </div>
                  <div className="flex-1 relative">
                    <textarea
                      value={paragraphe}
                      onChange={(e) => updateParagraph(chapter.id, paragraphIndex, e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      placeholder="Contenu du paragraphe"
                    />
                    <button
                      onClick={() => deleteParagraph(chapter.id, paragraphIndex)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => addParagraph(chapter.id)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium ml-9"
              >
                <Plus className="w-4 h-4" />
                Ajouter un paragraphe
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={saveContent}
          disabled={isLoadingAddCourseContent}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isLoadingAddCourseContent ? "Sauvegarde..." : "Sauvegarder le contenu"}
        </button>
      </div>
    </div>
  );
}
