"use client";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetDocumentInstanceByIdQuery } from "@/lib/apis/documents";
import { Loading } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { EditorContent, useEditor } from "@tiptap/react";
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

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const id = useMemo(
    () => (Array.isArray(params?.id) ? params.id[0] : (params?.id as string)),
    [params]
  );

  const { data, isLoading, isError } = useGetDocumentInstanceByIdQuery({ id }, { skip: !id });

  const content = data?.data?.filledContent || data?.data?.template?.content || null;
  const title = data?.data?.template?.title || "Document";

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
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Aucun contenu disponible." }],
        },
      ],
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

  if (isLoading) return <Loading />;
  if (isError) return <div className="p-6">Erreur lors du chargement du document.</div>;

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{title}</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Retour
        </Button>
      </div>
      <div className="border rounded bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
