import React, { useState, useCallback, useRef, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { TextAlign } from "@tiptap/extension-text-align";
import { Heading } from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Highlight from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";
import { Save, X, Loader2, Download } from "lucide-react";
import { Extension, Node } from "@tiptap/core";
import { useCreateDocumentInstanceMutation } from "@/lib/apis/documents";

// --- Font Size Extension ---
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

// --- Editable Variable Extension ---
const EditableVariable = Node.create({
  name: "editableVariable",
  group: "inline",
  inline: true,
  atom: true,
  addAttributes() {
    return {
      name: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-variable"),
        renderHTML: (attributes) => ({ "data-variable": attributes.name }),
      },
      value: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-value") || "",
        renderHTML: (attributes) => ({ "data-value": attributes.value }),
      },
    };
  },
  parseHTML() {
    return [{ tag: "span[data-variable]" }];
  },
  renderHTML({ node, HTMLAttributes }) {
    const value = node.attrs.value || "";
    const name = node.attrs.name || "";
    return [
      "input",
      {
        ...HTMLAttributes,
        type: "text",
        placeholder: `{{${name}}}`,
        value,
        class: "variable-input",
        style:
          "background-color: #fef3c7; padding: 4px 8px; border-radius: 4px; border: 1px solid #d97706; font-weight: normal; color: #92400e; min-width: 150px; font-size: 14px;",
        "data-variable": name,
      },
      "",
    ];
  },
});

interface StudentTemplateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateData?: any;
  isLoading?: boolean;
  sessionId: string;
}

export default function StudentTemplate({
  open,
  onOpenChange,
  templateData,
  isLoading = false,
  sessionId,
}: StudentTemplateProps) {
  const [title, setTitle] = useState(templateData?.data?.title || "");
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createDocumentInstance, { isLoading: isCreating }] = useCreateDocumentInstanceMutation();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      TextStyle,
      Color,
      FontFamily.configure({ types: ["textStyle"] }),
      FontSize,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      Underline,
      Subscript,
      Superscript,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-600 underline" },
      }),
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
      HorizontalRule,
      EditableVariable,
    ],
    content: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Chargement du modèle..." }] },
      ],
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none min-h-[600px] p-8 bg-white leading-relaxed w-full",
      },
    },
    editable: false,
  });

  useEffect(() => {
    if (templateData?.data) setTitle(templateData.data.title || "");
    else setTitle("");
  }, [templateData]);

  const convertVariablesToEditable = useCallback(
    (jsonContent: any) => {
      const traverse = (node: any): any => {
        if (node.type === "variable" && node.attrs?.name) {
          return {
            ...node,
            type: "editableVariable",
            attrs: { ...node.attrs, value: variableValues[node.attrs.name] || "" },
          };
        }
        if (node.content) return { ...node, content: node.content.map(traverse) };
        return node;
      };
      return traverse(jsonContent);
    },
    [variableValues]
  );

  useEffect(() => {
    if (!editor) return;
    if (open && templateData?.data) {
      try {
        if (templateData.data.content) {
          const content = convertVariablesToEditable(templateData.data.content);
          editor.commands.setContent(content);
        } else editor.commands.clearContent();
      } catch (error) {
        console.error("Failed to load template content:", error);
        editor.commands.clearContent();
      }
    }
  }, [open, editor, templateData, convertVariablesToEditable]);

  const handleSave = useCallback(async () => {
    try {
      await createDocumentInstance({
        templateId: templateData?.data?.id,
        variableValues,
      }).unwrap();
      toast.success("Document sauvegardé avec succès!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving document instance:", error);
      toast.error("Erreur lors de la sauvegarde du document");
    }
  }, [createDocumentInstance, templateData?.data?.id, variableValues, onOpenChange]);

  const handleDownloadPDF = useCallback(async () => {
    if (!editor) return;
    try {
      const filledContent = editor.getHTML();
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = filledContent;
      tempDiv.style.fontFamily = "Arial, sans-serif";
      tempDiv.style.fontSize = "12px";
      tempDiv.style.lineHeight = "1.5";
      tempDiv.style.padding = "20px";

      const inputs = tempDiv.querySelectorAll("input.variable-input");
      inputs.forEach((input) => {
        const value = (input as HTMLInputElement).value || "";
        const span = document.createElement("span");
        span.textContent = value;
        span.style.backgroundColor = "#fef3c7";
        span.style.padding = "2px 4px";
        span.style.borderRadius = "3px";
        input.parentNode?.replaceChild(span, input);
      });

      const opt = {
        margin: 1,
        filename: `${title}_rempli.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" as const },
      };

      html2pdf().set(opt).from(tempDiv).save();
      toast.success("PDF téléchargé avec succès");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Erreur lors du téléchargement du PDF");
    }
  }, [editor, title]);

  const handleVariableChange = useCallback((variableName: string, value: string) => {
    setVariableValues((prev) => ({ ...prev, [variableName]: value }));
  }, []);

  useEffect(() => {
    if (!editor) return;
    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target && target.classList.contains("variable-input")) {
        const variableName = target.getAttribute("data-variable");
        if (variableName) handleVariableChange(variableName, target.value);
      }
    };
    const editorElement = editor.view.dom;
    editorElement.addEventListener("input", handleInput);
    return () => editorElement.removeEventListener("input", handleInput);
  }, [editor, handleVariableChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm flex items-center justify-center">
      <div className="relative bg-white w-[95vw] h-[95vh] max-w-[1600px] rounded-lg shadow-xl border border-gray-200 flex flex-col overflow-hidden mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b bg-white shadow-sm">
          <h2 className="text-2xl font-bold">Remplir le document : {title}</h2>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Main Document Area */}
        <div className="flex-1 overflow-auto px-12 py-8 bg-gray-100">
          <div className="mx-auto bg-white shadow-md rounded-lg border border-gray-300 w-full max-w-[1000px] p-10">
            {isLoading ? (
              <div className="min-h-[600px] p-12 space-y-6 w-full">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            ) : (
              <EditorContent editor={editor} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 px-8 py-5 border-t bg-white">
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
            Remplissez les champs en surbrillance pour compléter le document
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Télécharger PDF
            </Button>
            <Button onClick={handleSave} disabled={isLoading || isCreating}>
              {isLoading || isCreating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
