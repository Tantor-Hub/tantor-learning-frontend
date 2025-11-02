import React, { useState, useCallback, useEffect, useRef } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Save, X, Loader2, Download } from "lucide-react";
import { Extension, Node } from "@tiptap/core";
import {
  useCreateDocumentInstanceMutation,
  useLazyGetDocumentTemplateByIdQuery,
  useGetDocumentInstancesByTemplateIdQuery,
  useUpdateDocumentInstanceMutation,
} from "@/lib/apis/documents";
import html2pdf from "html2pdf.js";
import { toast } from "react-hot-toast";
import { DocumentInstance } from "@/types/documents";

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
            parseHTML: (element) => element.style.fontSize?.replace(/['"]+/g, "") || null,
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

// --- Improved Editable Variable Extension ---
const EditableVariable = Node.create({
  name: "editableVariable",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  draggable: false,

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
    const displayText = value || `{{${name}}}`;

    return [
      "span",
      {
        ...HTMLAttributes,
        class: "variable-field-wrapper",
        "data-variable": name,
        "data-value": value,
        style: "display: inline-block; position: relative;",
      },
      [
        "span",
        {
          class: "variable-field",
          contenteditable: "true",
          "data-placeholder": `{{${name}}}`,
          style: `
            display: inline-block;
            min-width: 100px;
            padding: 2px 8px;
            background-color: ${value ? "#fef3c7" : "#fef9e7"};
            border-bottom: 2px solid ${value ? "#d97706" : "#f59e0b"};
            color: ${value ? "#78716c" : "#a8a29e"};
            font-weight: 400;
            font-style: ${value ? "normal" : "italic"};
            outline: none;
            transition: all 0.2s;
            white-space: pre-wrap;
            word-break: break-word;
            cursor: text;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            user-select: text;
          `,
        },
        displayText,
      ],
    ];
  },
});

interface StudentTemplateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateId: string;
  sessionId: string;
  userId: string;
}

export default function StudentTemplate({
  open,
  onOpenChange,
  templateId,
  sessionId,
  userId,
}: StudentTemplateProps) {
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [existingInstance, setExistingInstance] = useState<DocumentInstance | null>(null);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // API calls
  const [
    getDocumentTemplate,
    { data: templateData, isLoading: templateLoading, error: templateError },
  ] = useLazyGetDocumentTemplateByIdQuery();
  const { data: instancesData, isLoading: instancesLoading } =
    useGetDocumentInstancesByTemplateIdQuery({ templateId }, { skip: !templateId || !open });
  const [createDocumentInstance, { isLoading: isCreating }] = useCreateDocumentInstanceMutation();
  const [updateDocumentInstance, { isLoading: isUpdating }] = useUpdateDocumentInstanceMutation();

  const isSaving = isCreating || isUpdating;

  const title = templateData?.data?.title || "";

  // Initialize editor only on client side
  const editor = useEditor({
    extensions: [
      StarterKit,
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
    content: `
      <div style="padding: 20px; text-align: center; color: #666;">
        <p>Chargement du modèle...</p>
      </div>
    `,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none min-h-[600px] p-8 bg-white leading-relaxed w-full",
        style: "min-height: 600px;",
      },
      handleClick: (view, pos, event) => {
        const target = event.target as HTMLElement;

        // If clicking on a variable field, allow it and focus
        if (target.classList.contains("variable-field")) {
          target.focus();
          return true; // Allow the click
        }

        // If clicking on a variable wrapper, focus the inner field
        if (target.classList.contains("variable-field-wrapper")) {
          const field = target.querySelector(".variable-field") as HTMLElement;
          if (field) {
            field.focus();
          }
          return true;
        }

        // Prevent clicks elsewhere in the document
        event.preventDefault();
        event.stopPropagation();
        return true;
      },
      handleKeyDown: (view, event) => {
        const target = event.target as HTMLElement;
        const activeElement = document.activeElement as HTMLElement;

        // Check if we're inside a variable field (either directly or through activeElement)
        const isInVariableField =
          target?.classList?.contains("variable-field") ||
          activeElement?.classList?.contains("variable-field") ||
          target?.closest(".variable-field") ||
          activeElement?.closest(".variable-field");

        if (isInVariableField) {
          // Allow ALL keyboard input inside variable fields including backspace, delete, etc.
          return false; // Let the browser handle all keys normally
        }

        // Allow navigation keys everywhere
        const navigationKeys = [
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "Tab",
          "Home",
          "End",
          "PageUp",
          "PageDown",
          "Escape",
          "Enter",
        ];

        if (navigationKeys.includes(event.key)) {
          return false;
        }

        // Allow selection with Shift key
        if (event.key.startsWith("Arrow") && event.shiftKey) {
          return false;
        }

        // Allow all modifier key combinations (copy, paste, select all, etc.)
        if (event.ctrlKey || event.metaKey || event.altKey) {
          return false;
        }

        // Allow function keys
        if (event.key.startsWith("F") && event.key.length > 1) {
          return false;
        }

        // Prevent all other keyboard input outside variable fields
        console.log(`Blocked key: ${event.key} outside variable field`);
        event.preventDefault();
        event.stopPropagation();
        return true;
      },
    },
    editable: true,
  });

  // Set client side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load template when component opens
  useEffect(() => {
    if (open && templateId && isClient) {
      console.log("🔄 Loading template with ID:", templateId);
      setIsContentLoaded(false);
      getDocumentTemplate({ id: templateId });
    }
  }, [open, templateId, getDocumentTemplate, isClient]);

  // Check for existing instance when instances data loads
  useEffect(() => {
    if (instancesData?.data && userId) {
      console.log("📋 Checking for existing instances:", instancesData.data);
      const userInstance = instancesData.data.find((instance) => instance.userId === userId);
      if (userInstance) {
        console.log("✅ Found existing instance:", userInstance);
        setExistingInstance(userInstance);
        setVariableValues(userInstance.variableValues || {});
      } else {
        console.log("❌ No existing instance found for user");
        setExistingInstance(null);
        setVariableValues({});
      }
    }
  }, [instancesData, userId]);

  // Load content into editor when template data is available
  useEffect(() => {
    if (!editor || !templateData?.data || !isClient) return;

    console.log("📄 Template data received:", templateData.data);
    console.log("🎯 Current variable values:", variableValues);

    const loadContent = async () => {
      try {
        if (templateData.data.content) {
          console.log("🔄 Converting template content...");

          const convertContent = (content: any): any => {
            if (!content) return null;

            const traverse = (node: any): any => {
              if (!node) return node;

              // Convert variable nodes to editable variables
              if (node.type === "variable" && node.attrs?.name) {
                const variableName = node.attrs.name;
                const variableValue = variableValues[variableName] || "";

                console.log(`🔄 Converting variable: ${variableName} = "${variableValue}"`);

                return {
                  type: "editableVariable",
                  attrs: {
                    name: variableName,
                    value: variableValue,
                  },
                };
              }

              // Process child nodes recursively
              if (node.content && Array.isArray(node.content)) {
                return {
                  ...node,
                  content: node.content.map(traverse).filter(Boolean),
                };
              }

              return node;
            };

            if (content.type === "doc" && Array.isArray(content.content)) {
              return {
                ...content,
                content: content.content.map(traverse).filter(Boolean),
              };
            }

            return content;
          };

          const convertedContent = convertContent(templateData.data.content);
          console.log("✅ Converted content:", convertedContent);

          if (convertedContent) {
            editor.commands.setContent(convertedContent);
            setIsContentLoaded(true);
            console.log("✅ Content loaded successfully");
          } else {
            throw new Error("Failed to convert content");
          }
        } else {
          console.log("⚠️ No structured content found, using fallback");
          editor.commands.setContent(`
            <div style="padding: 20px;">
              <h1>${templateData.data.title || "Document"}</h1>
              <p>Le contenu du document n'est pas disponible.</p>
            </div>
          `);
          setIsContentLoaded(true);
        }
      } catch (error) {
        console.error("❌ Error loading content:", error);
        editor.commands.setContent(`
          <div style="padding: 20px;">
            <h1>${templateData.data.title || "Document"}</h1>
            <p>Erreur lors du chargement du contenu. Veuillez réessayer.</p>
          </div>
        `);
        setIsContentLoaded(true);
        toast.error("Erreur lors du chargement du contenu");
      }
    };

    loadContent();
  }, [editor, templateData, isClient, variableValues]);

  // Event handlers for variable fields
  const updateVariableField = useCallback((variableName: string, value: string) => {
    console.log(`📝 Updating variable ${variableName}:`, value);
    setVariableValues((prev) => ({
      ...prev,
      [variableName]: value,
    }));
  }, []);

  // Set up event listeners for variable fields
  useEffect(() => {
    if (!editor || !isContentLoaded || !isClient) return;

    console.log("🎯 Setting up event listeners for variable fields");

    const handleInput = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && target.classList.contains("variable-field")) {
        const wrapper = target.closest("[data-variable]");
        const variableName = wrapper?.getAttribute("data-variable");

        if (variableName) {
          const newValue = target.textContent || "";
          updateVariableField(variableName, newValue);

          // Update styling based on whether field has value
          const hasValue = newValue.trim().length > 0;
          target.style.backgroundColor = hasValue ? "#fef3c7" : "#fef9e7";
          target.style.borderBottomColor = hasValue ? "#d97706" : "#f59e0b";
          target.style.color = hasValue ? "#78716c" : "#a8a29e";
          target.style.fontStyle = hasValue ? "normal" : "italic";
        }
      }
    };

    const handleFocus = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && target.classList.contains("variable-field")) {
        target.style.borderBottomColor = "#ea580c";
        target.style.boxShadow = "0 1px 0 0 rgba(234, 88, 12, 0.3)";
        target.style.backgroundColor = "#fef3c7";
      }
    };

    const handleBlur = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && target.classList.contains("variable-field")) {
        const hasValue = (target.textContent || "").trim().length > 0;
        target.style.borderBottomColor = hasValue ? "#d97706" : "#f59e0b";
        target.style.boxShadow = "none";
        target.style.backgroundColor = hasValue ? "#fef3c7" : "#fef9e7";
      }
    };

    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;
      // Prevent clicks outside variable fields from doing anything
      if (!target.classList.contains("variable-field") && !target.closest(".variable-field")) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener("input", handleInput);
    editorElement.addEventListener("focus", handleFocus, true);
    editorElement.addEventListener("blur", handleBlur, true);
    editorElement.addEventListener("click", handleClick, true);

    return () => {
      editorElement.removeEventListener("input", handleInput);
      editorElement.removeEventListener("focus", handleFocus, true);
      editorElement.removeEventListener("blur", handleBlur, true);
      editorElement.removeEventListener("click", handleClick, true);
    };
  }, [editor, updateVariableField, isContentLoaded, isClient]);

  // Save or Update document instance
  const handleSave = useCallback(async () => {
    if (!editor) return;

    console.log("💾 Saving document with variables:", variableValues);

    try {
      if (existingInstance) {
        // Update existing instance
        const result = await updateDocumentInstance({
          id: existingInstance.id,
          data: { variableValues },
        }).unwrap();

        setExistingInstance(result.data);
        toast.success("Document modifié avec succès");
        console.log("✅ Document updated successfully");
      } else {
        // Create new instance
        const result = await createDocumentInstance({
          templateId,
          variableValues,
        }).unwrap();

        setExistingInstance(result.data);
        toast.success("Document sauvegardé avec succès");
        console.log("✅ Document created successfully");
      }
    } catch (error) {
      console.error("❌ Error saving document instance:", error);
      toast.error("Erreur lors de la sauvegarde du document");
    }
  }, [
    editor,
    variableValues,
    existingInstance,
    templateId,
    updateDocumentInstance,
    createDocumentInstance,
  ]);

  // Download PDF
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

      // Replace variable fields with plain text for PDF
      const variableFields = tempDiv.querySelectorAll(".variable-field");
      variableFields.forEach((field) => {
        const value = field.textContent || "";
        const span = document.createElement("span");
        span.textContent = value;
        span.style.color = "#374151";
        span.style.fontWeight = "400";
        field.parentNode?.replaceChild(span, field);
      });

      // Generate PDF using html2pdf
      const options = {
        margin: 10,
        filename: `${title}_${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
      };

      await html2pdf().set(options).from(tempDiv).save();
      toast.success("PDF téléchargé avec succès");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Erreur lors du téléchargement du PDF");
    }
  }, [editor, title]);

  // Debug logging
  useEffect(() => {
    if (open) {
      console.log("=== DEBUG INFO ===");
      console.log("Open:", open);
      console.log("Template ID:", templateId);
      console.log("Template loading:", templateLoading);
      console.log("Template data:", templateData);
      console.log("Template error:", templateError);
      console.log("Instances loading:", instancesLoading);
      console.log("Instances data:", instancesData);
      console.log("Is client:", isClient);
      console.log("Is content loaded:", isContentLoaded);
      console.log("Editor exists:", !!editor);
      console.log("Variable values:", variableValues);
      console.log("===================");
    }
  }, [
    open,
    templateId,
    templateLoading,
    templateData,
    templateError,
    instancesLoading,
    instancesData,
    isClient,
    isContentLoaded,
    editor,
    variableValues,
  ]);

  if (!isClient || !open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm flex items-center justify-center">
      <div className="relative bg-white w-[95vw] h-[95vh] max-w-[1600px] rounded-lg shadow-xl border border-gray-200 flex flex-col overflow-hidden mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b bg-white shadow-sm">
          <h2 className="text-2xl font-bold">
            {templateLoading ? "Chargement..." : `Remplir le document : ${title}`}
          </h2>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Main Document Area */}
        <div className="flex-1 overflow-auto px-12 py-8 bg-gray-100">
          <div className="mx-auto bg-white shadow-md rounded-lg border border-gray-300 w-full max-w-[1000px] min-h-[700px]">
            {templateLoading || instancesLoading ? (
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
            ) : templateError ? (
              <div className="min-h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-red-600 text-lg mb-2">Erreur lors du chargement du modèle</p>
                  <p className="text-gray-600 text-sm mb-4">{"Erreur inconnue"}</p>
                  <Button
                    variant="outline"
                    onClick={() => getDocumentTemplate({ id: templateId })}
                    className="mt-4"
                  >
                    Réessayer
                  </Button>
                </div>
              </div>
            ) : !templateData?.data ? (
              <div className="min-h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-600 text-lg mb-2">Aucune donnée de modèle disponible</p>
                  <p className="text-gray-500 text-sm">
                    Template ID: {templateId}
                    <br />
                    Vérifiez que le template existe et que vous y avez accès.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => getDocumentTemplate({ id: templateId })}
                    className="mt-4"
                  >
                    Réessayer le chargement
                  </Button>
                </div>
              </div>
            ) : editor ? (
              <EditorContent editor={editor} ref={editorRef} />
            ) : (
              <div className="min-h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-600 text-lg">Initialisation de l'éditeur...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 px-8 py-5 border-t bg-white">
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${existingInstance ? "bg-green-500" : "bg-amber-400"}`}
            ></div>
            {existingInstance
              ? "Document existant trouvé. Vous pouvez modifier les valeurs."
              : "Cliquez sur les champs surlignés pour les remplir"}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              disabled={!isContentLoaded || !editor}
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger PDF
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !isContentLoaded || !editor}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {existingInstance ? "Modifier" : "Sauvegarder"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
