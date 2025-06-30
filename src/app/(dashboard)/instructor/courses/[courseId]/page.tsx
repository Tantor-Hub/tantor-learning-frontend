"use client";
import React, { useState } from "react";
import { Upload, Video, FileText, Plus, X } from "lucide-react";

interface Chapter {
  id: number;
  title: string;
  description: string;
}

interface DraggedFiles {
  video: File | null;
  documents: File[];
}

export default function Page() {
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [courseDescription, setCourseDescription] = useState<string>("");
  const [estimatedDuration, setEstimatedDuration] = useState<string>("");
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: 1,
      title: "Introduction aux concepts du marketing en général",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent non odio et risus porta dapibus. Nunc purus elit, dignissim non sem nec, aliquet pharetra purus. Fusce fermentum in sem vel egestas. Cras risus eros, pulvinar in condimentum sit amet, lobortis sit amet orci. Cras maximus urna nec ligula dignissim semper vitae non diam.",
    },
    {
      id: 2,
      title: "Introduction aux concepts du marketing en général",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent non odio et risus porta dapibus. Nunc purus elit, dignissim non sem nec, aliquet pharetra purus. Fusce fermentum in sem vel egestas. Cras risus eros, pulvinar in condimentum sit amet, lobortis sit amet orci. Cras maximus urna nec ligula dignissim semper vitae non diam.",
    },
    {
      id: 3,
      title: "Introduction aux concepts du marketing en général",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent non odio et risus porta dapibus. Nunc purus elit, dignissim non sem nec, aliquet pharetra purus. Fusce fermentum in sem vel egestas. Cras risus eros, pulvinar in condimentum sit amet, lobortis sit amet orci. Cras maximus urna nec ligula dignissim semper vitae non diam.",
    },
    {
      id: 4,
      title: "Introduction aux concepts du marketing en général",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent non odio et risus porta dapibus. Nunc purus elit, dignissim non sem nec, aliquet pharetra purus. Fusce fermentum in sem vel egestas. Cras risus eros, pulvinar in condimentum sit amet, lobortis sit amet orci. Cras maximus urna nec ligula dignissim semper vitae non diam.",
    },
  ]);

  const [draggedFiles, setDraggedFiles] = useState<DraggedFiles>({
    video: null,
    documents: [],
  });

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: "video" | "documents"): void => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    if (type === "video") {
      setDraggedFiles((prev) => ({ ...prev, video: files[0] || null }));
    } else {
      setDraggedFiles((prev) => ({ ...prev, documents: [...prev.documents, ...files] }));
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "video" | "documents"
  ): void => {
    const files = Array.from(e.target.files || []);

    if (type === "video") {
      setDraggedFiles((prev) => ({ ...prev, video: files[0] || null }));
    } else {
      setDraggedFiles((prev) => ({ ...prev, documents: [...prev.documents, ...files] }));
    }
  };

  const addChapter = (): void => {
    const newChapter: Chapter = {
      id: chapters.length + 1,
      title: "Introduction aux concepts du marketing en général",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent non odio et risus porta dapibus. Nunc purus elit, dignissim non sem nec, aliquet pharetra purus. Fusce fermentum in sem vel egestas. Cras risus eros, pulvinar in condimentum sit amet, lobortis sit amet orci. Cras maximus urna nec ligula dignissim semper vitae non diam.",
    };
    setChapters([...chapters, newChapter]);
  };

  const updateChapter = (id: number, field: keyof Chapter, value: string): void => {
    setChapters(
      chapters.map((chapter) => (chapter.id === id ? { ...chapter, [field]: value } : chapter))
    );
  };

  const handleSaveDraft = (): void => {
    console.log("Saving as draft...", {
      courseTitle,
      courseDescription,
      estimatedDuration,
      chapters,
      draggedFiles,
    });
  };

  const handleSave = (): void => {
    console.log("Saving course...", {
      courseTitle,
      courseDescription,
      estimatedDuration,
      chapters,
      draggedFiles,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Course Title */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Titre du cours</label>
        <input
          type="text"
          value={courseTitle}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCourseTitle(e.target.value)}
          placeholder="Introduction au droit fiscal"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Course Description */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description du cours</label>
        <textarea
          value={courseDescription}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setCourseDescription(e.target.value)
          }
          placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent non odio et risus porta dapibus. Nunc purus elit, dignissim non sem nec, aliquet pharetra purus. Fusce fermentum in sem vel egestas. Cras risus eros, pulvinar in condimentum sit amet, lobortis sit amet orci. Cras maximus urna nec ligula dignissim semper vitae non diam. Nulla facilisi. Pellentesque quis vestibulum lorem"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Estimated Duration */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Durée estimée</label>
        <input
          type="text"
          value={estimatedDuration}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEstimatedDuration(e.target.value)
          }
          placeholder="30h"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Course Content */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">Contenu du cours</label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Video Upload */}
          <div className="border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Video</h3>
              <Video className="w-5 h-5 text-gray-400" />
            </div>

            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "video")}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">Deposez votre video ici</p>
              <p className="text-sm text-gray-500 mb-4">MP4, WebM ou MO jusqu'à 2GB</p>

              <label className="inline-block">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileSelect(e, "video")}
                  className="hidden"
                />
                <span className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                  Parcourir
                </span>
              </label>

              {draggedFiles.video && (
                <div className="mt-4 p-2 bg-blue-50 rounded text-sm text-blue-700">
                  {draggedFiles.video.name}
                </div>
              )}
            </div>
          </div>

          {/* Documents Upload */}
          <div className="border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Documents</h3>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>

            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "documents")}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">Deposez vos documents ici</p>
              <p className="text-sm text-gray-500 mb-4">PDF,DOCX,PPTX jusqu'à 100 MB</p>

              <label className="inline-block">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  multiple
                  onChange={(e) => handleFileSelect(e, "documents")}
                  className="hidden"
                />
                <span className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                  Parcourir
                </span>
              </label>

              {draggedFiles.documents.length > 0 && (
                <div className="mt-4 space-y-2">
                  {draggedFiles.documents.map((file: File, index: number) => (
                    <div key={index} className="p-2 bg-blue-50 rounded text-sm text-blue-700">
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Chapters */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Chapitres du cours</h3>
        <p className="text-sm text-gray-500 mb-6">Organisez votre cours en chapitres</p>

        <div className="space-y-4">
          {chapters.map((chapter: Chapter) => (
            <div key={chapter.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  {chapter.id}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={chapter.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateChapter(chapter.id, "title", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                  />
                  <textarea
                    value={chapter.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      updateChapter(chapter.id, "description", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addChapter}
          className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Ajouter un chapitre
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleSaveDraft}
          className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        >
          Enregistrer comme brouillon
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}
