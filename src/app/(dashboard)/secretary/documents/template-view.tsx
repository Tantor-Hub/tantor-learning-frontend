"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { TextAlign } from "@tiptap/extension-text-align";
import { Heading } from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";
import { useLazyGetSecretaryDocumentInstanceByIdQuery } from "@/lib/apis/documents";

interface TemplateViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instanceId: string;
}

export default function TemplateView({ open, onOpenChange, instanceId }: TemplateViewerProps) {
  const [mounted, setMounted] = useState(false);
  const [fetchInstance, { data, isFetching, isError }] =
    useLazyGetSecretaryDocumentInstanceByIdQuery();

  // Handle client-side mounting to avoid SSR issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open && instanceId) {
      fetchInstance({ id: instanceId });
    }
  }, [open, instanceId, fetchInstance]);

  const content = useMemo(() => {
    // Response structure: data is the template object directly with content at the top level
    // Structure: { id, title, content: {...} }
    if (!data) {
      return {
        type: "doc",
        content: [{ type: "paragraph", content: [{ type: "text", text: "Chargement..." }] }],
      };
    }

    // Try multiple paths to find the content
    const base =
      (data as any)?.content ||
      (data as any)?.template?.content ||
      (data as any)?.data?.template?.content;

    if (!base) {
      return {
        type: "doc",
        content: [
          { type: "paragraph", content: [{ type: "text", text: "Aucun contenu disponible." }] },
        ],
      };
    }

    // Get variable values from the instance data if available
    // The instance should have variableValues property
    const instance = (data as any)?.data || data;
    const values: Record<string, string> = instance?.variableValues || {};

    const convert = (node: any): any => {
      if (!node) return null;
      if (Array.isArray(node)) {
        const converted = node.map(convert).filter(Boolean);
        return converted.length > 0 ? converted : null;
      }

      // Filter out empty text nodes
      if (node.type === "text" && (!node.text || !node.text.trim())) {
        return null;
      }

      // Replace variable nodes with plain text using provided values
      if (node.type === "variable" && node.attrs?.name) {
        const name = node.attrs.name as string;
        const value = values[name] ?? "";
        // Only create text node if value is not empty, otherwise skip it (return null)
        if (value && value.trim()) {
          return { type: "text", text: value };
        }
        // Skip empty variables entirely
        return null;
      }

      if (node.content && Array.isArray(node.content)) {
        const convertedContent = node.content.map(convert).filter(Boolean);
        // If all content was filtered out, return null to remove the node
        if (convertedContent.length === 0) {
          return null;
        }
        return { ...node, content: convertedContent };
      }
      return node;
    };

    let processed = convert(base);

    // Final cleanup: recursively remove any empty text nodes that might have slipped through
    const finalCleanup = (node: any): any => {
      if (!node) return null;
      if (Array.isArray(node)) {
        const cleaned = node.map(finalCleanup).filter(Boolean);
        return cleaned.length > 0 ? cleaned : null;
      }

      // Remove empty text nodes
      if (node.type === "text" && (!node.text || !node.text.trim())) {
        return null;
      }

      if (node.content && Array.isArray(node.content)) {
        const cleanedContent = node.content.map(finalCleanup).filter(Boolean);
        if (cleanedContent.length === 0) {
          return null;
        }
        return { ...node, content: cleanedContent };
      }
      return node;
    };

    processed = finalCleanup(processed);

    // Ensure the processed content has the correct structure
    if (!processed || !processed.type) {
      return {
        type: "doc",
        content: [
          { type: "paragraph", content: [{ type: "text", text: "Aucun contenu disponible." }] },
        ],
      };
    }

    return processed;
  }, [data]);

  // Access title from the template object (handle both possible structures)
  const title = (data as any)?.title || (data as any)?.data?.template?.title || "Document";

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily.configure({ types: ["textStyle"] }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      Underline,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: true, HTMLAttributes: { class: "text-blue-600 underline" } }),
      Image.configure({ HTMLAttributes: { class: "max-w-full h-auto" } }),
      Table.configure({
        resizable: true,
        HTMLAttributes: { class: "border-collapse border border-gray-300 w-full" },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: { class: "border border-gray-300 bg-gray-100 p-3" },
      }),
      TableCell.configure({ HTMLAttributes: { class: "border border-gray-300 p-3" } }),
    ],
    content: content || {
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: "Chargement..." }] }],
    },
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none min-h-[600px] p-8 bg-white leading-relaxed w-full",
      },
    },
  });

  // Update editor content when fetched data changes
  useEffect(() => {
    if (editor && mounted && data && content) {
      // Small delay to ensure editor is fully initialized after hydration
      const timer = setTimeout(() => {
        try {
          // Check if content is different from current editor content
          const currentContent = editor.getJSON();
          const contentStr = JSON.stringify(content);
          const currentContentStr = JSON.stringify(currentContent);

          if (contentStr !== currentContentStr) {
            editor.commands.setContent(content as any);
          }
        } catch (error) {
          console.error("Error setting editor content:", error);
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [editor, content, data, mounted]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm flex items-center justify-center">
      <div className="relative bg-white w-[95vw] h-[95vh] max-w-[1600px] rounded-lg shadow-xl border border-gray-200 flex flex-col overflow-hidden mx-auto">
        <div className="flex items-center justify-between px-8 py-5 border-b bg-white shadow-sm">
          <h2 className="text-2xl font-bold">{isFetching ? "Chargement..." : title}</h2>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto px-12 py-8 bg-gray-100">
          <div className="mx-auto bg-white shadow-md rounded-lg border border-gray-300 w-full max-w-[1000px] min-h-[700px]">
            {isFetching ? (
              <div className="min-h-[600px] p-8 space-y-6 w-full">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-4/5" />
                <div className="space-y-3 mt-8">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-5 w-4/5" />
                </div>
              </div>
            ) : isError ? (
              <div className="min-h-[600px] flex items-center justify-center">
                <div className="text-center text-red-600">
                  Erreur lors du chargement du document
                </div>
              </div>
            ) : mounted && editor ? (
              <EditorContent editor={editor} />
            ) : (
              <div className="min-h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-500">Chargement du contenu...</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t bg-white">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}
