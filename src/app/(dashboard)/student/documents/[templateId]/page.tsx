"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import { useSelectedSession } from "@/hooks/use-selected-session";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Save, X, Loader2, Download, ArrowLeft } from "lucide-react";
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
    const placeholder = `{{${name}}}`;

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
          "data-placeholder": placeholder,
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
            position: relative;
          `,
        },
        value || "",
      ],
    ];
  },
});

export default function DocumentTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.templateId as string;
  const sessionId = useSelectedSession();
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id || "";

  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [existingInstance, setExistingInstance] = useState<DocumentInstance | null>(null);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // PDF Crop settings (used for PDF generation)
  const [cropSettings, setCropSettings] = useState({
    offsetX: -140, // Default to -140px for better left content capture
    offsetY: 0,
    width: 0,
    height: 0,
  });

  // API calls
  const [
    getDocumentTemplate,
    { data: templateData, isLoading: templateLoading, error: templateError },
  ] = useLazyGetDocumentTemplateByIdQuery();
  const { data: instancesData, isLoading: instancesLoading } =
    useGetDocumentInstancesByTemplateIdQuery({ templateId }, { skip: !templateId || !sessionId });
  const [createDocumentInstance, { isLoading: isCreating }] = useCreateDocumentInstanceMutation();
  const [updateDocumentInstance, { isLoading: isUpdating }] = useUpdateDocumentInstanceMutation();

  const isSaving = isCreating || isUpdating;

  const title = templateData?.data?.title || "";

  // Redirect if no templateId or sessionId
  useEffect(() => {
    if (!templateId || !sessionId) {
      router.push("/student/documents");
    }
  }, [templateId, sessionId, router]);

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

        event.preventDefault();
        event.stopPropagation();
        return true;
      },
    },
    editable: false,
  });

  // Set client side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load template when component opens
  useEffect(() => {
    if (templateId && sessionId && isClient) {
      setIsContentLoaded(false);
      setVariableValues({}); // Reset variable values
      setExistingInstance(null); // Reset existing instance
      setIsPublished(false); // Reset published state
      getDocumentTemplate({ id: templateId });
    }
  }, [templateId, sessionId, getDocumentTemplate, isClient]);

  // Check for existing instance when instances data loads
  useEffect(() => {
    // Only check if we have instances data (array might be empty) or if loading is complete
    if (!instancesLoading && userId) {
      if (instancesData?.data) {
        const userInstance = instancesData.data.find((instance) => instance.userId === userId);
        if (userInstance) {
          setExistingInstance(userInstance);
          const savedValues = userInstance.variableValues || {};

          setVariableValues(savedValues);
          setIsPublished(userInstance.is_published || false);

          // Force a small delay to ensure state update is processed
          setTimeout(() => {}, 100);
        } else {
          setExistingInstance(null);
          setVariableValues({});
          setIsPublished(false);
        }
      } else if (instancesData === undefined || instancesData.data === undefined) {
        // Instances query completed but no data found (empty array or undefined)

        setExistingInstance(null);
        setVariableValues({});
        setIsPublished(false);
      }
    } else if (instancesLoading) {
    }
  }, [instancesData, userId, instancesLoading]);

  // Load content into editor when template data is available
  // Wait for instances to load first if they're still loading (to get saved values)
  useEffect(() => {
    if (!editor || !templateData?.data || !isClient || isContentLoaded) return;

    // If instances are still loading, wait for them first
    if (instancesLoading) {
      return;
    }

    const loadContent = async () => {
      // Get the latest variableValues from instances data if available
      // This ensures we use saved values if they exist
      let finalVariableValues = variableValues;
      if (instancesData?.data && userId) {
        const userInstance = instancesData.data.find((instance) => instance.userId === userId);
        if (userInstance && userInstance.variableValues) {
          finalVariableValues = userInstance.variableValues;
          // Update state if we found values (this will trigger the DOM update effect too)
          if (
            Object.keys(userInstance.variableValues).length > 0 &&
            JSON.stringify(userInstance.variableValues) !== JSON.stringify(variableValues)
          ) {
            setVariableValues(userInstance.variableValues);
            // Use the instance values directly for content loading
            finalVariableValues = userInstance.variableValues;
          }
        }
      }
      try {
        if (templateData.data.content) {
          const convertContent = (content: any, values: Record<string, string>): any => {
            if (!content) return null;

            const traverse = (node: any): any => {
              if (!node) return node;

              // Convert variable nodes to editable variables
              if (node.type === "variable" && node.attrs?.name) {
                const variableName = node.attrs.name;
                // Use values parameter (which is finalVariableValues)
                const variableValue = values[variableName] || "";

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

          const convertedContent = convertContent(templateData.data.content, finalVariableValues);

          if (convertedContent) {
            editor.commands.setContent(convertedContent);
            setIsContentLoaded(true);
          } else {
            throw new Error("Failed to convert content");
          }
        } else {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, templateData?.data, isClient, instancesLoading, instancesData, userId]);

  // Event handlers for variable fields
  const updateVariableField = useCallback((variableName: string, value: string) => {
    setVariableValues((prev) => ({
      ...prev,
      [variableName]: value,
    }));
  }, []);

  // Set up event listeners for variable fields and placeholder behavior
  useEffect(() => {
    if (!editor || !isContentLoaded || !isClient) return;

    // Add CSS for placeholder effect
    const styleId = "variable-field-placeholder-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .variable-field-wrapper {
          position: relative;
        }
        .variable-field {
          min-height: 1.2em;
        }
        .variable-field[data-show-placeholder="true"]:not(:focus)::before {
          content: attr(data-placeholder);
          color: #a8a29e;
          font-style: italic;
          pointer-events: none;
          display: inline-block;
          opacity: 0.7;
        }
        .variable-field[data-show-placeholder="true"]:not(:focus):empty::before,
        .variable-field[data-show-placeholder="true"]:not(:focus):has(br:only-child)::before {
          content: attr(data-placeholder);
          color: #a8a29e;
          font-style: italic;
          pointer-events: none;
          display: inline-block;
          opacity: 0.7;
        }
      `;
      document.head.appendChild(style);
    }

    const updatePlaceholder = (target: HTMLElement) => {
      const text = target.textContent || "";
      const hasValue = text.trim().length > 0;
      if (!hasValue && document.activeElement !== target) {
        // Show placeholder when empty and not focused
        target.setAttribute("data-show-placeholder", "true");
      } else {
        target.removeAttribute("data-show-placeholder");
      }
    };

    const handleInput = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && target.classList.contains("variable-field")) {
        // Save scroll position and current selection before any updates
        const scrollContainer = editor.view.dom.closest(".overflow-auto") || window;
        const scrollTop =
          scrollContainer === window ? window.scrollY : (scrollContainer as HTMLElement).scrollTop;
        const scrollLeft =
          scrollContainer === window ? window.scrollX : (scrollContainer as HTMLElement).scrollLeft;

        // Save cursor position
        const selection = window.getSelection();
        let savedRange: Range | null = null;
        if (selection && selection.rangeCount !== undefined && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          savedRange = range.cloneRange();
        }

        const wrapper = target.closest("[data-variable]");
        const variableName = wrapper?.getAttribute("data-variable");

        if (variableName) {
          const newValue = target.textContent || "";

          // Use requestAnimationFrame to batch the state update and avoid scroll jumps
          requestAnimationFrame(() => {
            updateVariableField(variableName, newValue);
          });

          // Clean up empty content to ensure placeholder shows
          // Remove any <br> tags if content is empty
          if (!newValue.trim()) {
            target.innerHTML = "";
            target.setAttribute("data-empty", "true");
          } else {
            target.removeAttribute("data-empty");
          }

          // Update styling based on whether field has value
          const hasValue = newValue.trim().length > 0;
          target.style.backgroundColor = hasValue ? "#fef3c7" : "#fef9e7";
          target.style.borderBottomColor = hasValue ? "#d97706" : "#f59e0b";
          target.style.color = hasValue ? "#78716c" : "#a8a29e";
          target.style.fontStyle = hasValue ? "normal" : "italic";

          updatePlaceholder(target);

          // Restore scroll position and focus after a brief delay
          requestAnimationFrame(() => {
            // Restore scroll
            if (scrollContainer === window) {
              window.scrollTo(scrollLeft, scrollTop);
            } else {
              (scrollContainer as HTMLElement).scrollTop = scrollTop;
              (scrollContainer as HTMLElement).scrollLeft = scrollLeft;
            }

            // Restore focus and cursor position
            target.focus();
            if (savedRange && selection) {
              try {
                selection.removeAllRanges();
                selection.addRange(savedRange);
              } catch (e) {
                // If range is invalid, just focus the element
                const range = document.createRange();
                range.selectNodeContents(target);
                range.collapse(false); // Move to end
                selection.removeAllRanges();
                selection.addRange(range);
              }
            }
          });
        }
      }
    };

    const handleFocus = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && target.classList.contains("variable-field")) {
        // Save scroll position before focus changes
        const scrollContainer = editor.view.dom.closest(".overflow-auto") || window;
        const scrollTop =
          scrollContainer === window ? window.scrollY : (scrollContainer as HTMLElement).scrollTop;
        const scrollLeft =
          scrollContainer === window ? window.scrollX : (scrollContainer as HTMLElement).scrollLeft;

        target.style.borderBottomColor = "#ea580c";
        target.style.boxShadow = "0 1px 0 0 rgba(234, 88, 12, 0.3)";
        target.style.backgroundColor = "#fef3c7";
        // Clear placeholder on focus
        target.removeAttribute("data-show-placeholder");
        // If empty, select all to make typing easier
        if (!target.textContent?.trim()) {
          requestAnimationFrame(() => {
            const range = document.createRange();
            range.selectNodeContents(target);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);

            // Restore scroll position after selection
            if (scrollContainer === window) {
              window.scrollTo(scrollLeft, scrollTop);
            } else {
              (scrollContainer as HTMLElement).scrollTop = scrollTop;
              (scrollContainer as HTMLElement).scrollLeft = scrollLeft;
            }
          });
        } else {
          // Maintain scroll position even when not empty
          requestAnimationFrame(() => {
            if (scrollContainer === window) {
              window.scrollTo(scrollLeft, scrollTop);
            } else {
              (scrollContainer as HTMLElement).scrollTop = scrollTop;
              (scrollContainer as HTMLElement).scrollLeft = scrollLeft;
            }
          });
        }
      }
    };

    const handleBlur = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && target.classList.contains("variable-field")) {
        const hasValue = (target.textContent || "").trim().length > 0;
        target.style.borderBottomColor = hasValue ? "#d97706" : "#f59e0b";
        target.style.boxShadow = "none";
        target.style.backgroundColor = hasValue ? "#fef3c7" : "#fef9e7";
        updatePlaceholder(target);
      }
    };

    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;
      // Prevent clicks outside variable fields from doing anything
      if (!target.classList.contains("variable-field") && !target.closest(".variable-field")) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      // If clicking on a variable field wrapper, focus the inner field
      if (target.classList.contains("variable-field-wrapper")) {
        const field = target.querySelector(".variable-field") as HTMLElement;
        if (field) {
          field.focus();
        }
        event.preventDefault();
        event.stopPropagation();
      }
    };

    // Initialize placeholders for all variable fields
    const initializePlaceholders = () => {
      const fields = editor.view.dom.querySelectorAll(".variable-field");
      fields.forEach((field) => {
        const fieldEl = field as HTMLElement;
        // Clean up empty content to ensure placeholder shows
        const text = fieldEl.textContent || "";
        if (!text.trim()) {
          fieldEl.innerHTML = "";
          fieldEl.setAttribute("data-empty", "true");
        } else {
          fieldEl.removeAttribute("data-empty");
        }
        updatePlaceholder(fieldEl);
      });
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener("input", handleInput);
    editorElement.addEventListener("focus", handleFocus, true);
    editorElement.addEventListener("blur", handleBlur, true);
    editorElement.addEventListener("click", handleClick, true);

    // Initialize placeholders after a short delay to ensure DOM is ready
    setTimeout(initializePlaceholders, 100);

    return () => {
      editorElement.removeEventListener("input", handleInput);
      editorElement.removeEventListener("focus", handleFocus, true);
      editorElement.removeEventListener("blur", handleBlur, true);
      editorElement.removeEventListener("click", handleClick, true);
    };
  }, [editor, updateVariableField, isContentLoaded, isClient]);

  // Update variable fields in DOM when variableValues change (for existing instances)
  useEffect(() => {
    if (!editor || !isContentLoaded || !isClient) return;

    // Use a small delay to ensure DOM is fully ready
    const timeoutId = setTimeout(() => {
      // Helper to update placeholder state
      const updatePlaceholderForField = (target: HTMLElement) => {
        const text = target.textContent || "";
        const hasValue = text.trim().length > 0;
        if (!hasValue && document.activeElement !== target) {
          // Show placeholder when empty and not focused
          target.setAttribute("data-show-placeholder", "true");
        } else {
          target.removeAttribute("data-show-placeholder");
        }
      };

      // Find all variable fields and update them with saved values
      const variableFields = editor.view.dom.querySelectorAll(".variable-field");

      let hasUpdates = false;

      variableFields.forEach((field) => {
        const fieldEl = field as HTMLElement;
        const wrapper = fieldEl.closest("[data-variable]") as HTMLElement;
        if (wrapper) {
          const variableName = wrapper.getAttribute("data-variable");

          if (variableName && variableValues.hasOwnProperty(variableName)) {
            const savedValue = variableValues[variableName] || "";
            const currentValue = fieldEl.textContent?.trim() || "";

            // Update if the value is different (including empty string case)
            if (savedValue !== currentValue) {
              fieldEl.textContent = savedValue;
              hasUpdates = true;

              // Update styling
              const hasValue = savedValue.trim().length > 0;
              fieldEl.style.backgroundColor = hasValue ? "#fef3c7" : "#fef9e7";
              fieldEl.style.borderBottomColor = hasValue ? "#d97706" : "#f59e0b";
              fieldEl.style.color = hasValue ? "#78716c" : "#a8a29e";
              fieldEl.style.fontStyle = hasValue ? "normal" : "italic";

              // Clean up empty content
              if (!savedValue.trim()) {
                fieldEl.innerHTML = "";
                fieldEl.setAttribute("data-empty", "true");
              } else {
                fieldEl.removeAttribute("data-empty");
              }

              // Update placeholder state
              updatePlaceholderForField(fieldEl);
            } else {
            }
          }
        }
      });

      if (hasUpdates) {
      } else {
      }
    }, 200); // Small delay to ensure DOM is ready

    return () => clearTimeout(timeoutId);
  }, [variableValues, editor, isContentLoaded, isClient]);

  // Save or Update document instance
  const handleSave = useCallback(async () => {
    if (!editor) return;

    // Ensure instances have finished loading before saving
    // This is important to correctly determine if we should create or update
    if (instancesLoading) {
      // Wait a reasonable time for instances to load (usually very fast)
      // The instances query should complete quickly, so we wait up to 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.dismiss("checking-instance");

      // Note: instancesLoading might still be true, but we'll do a final check below
      if (instancesLoading) {
        console.warn("⚠️  Instances still loading after wait, proceeding with available data");
      }
    }

    // Double-check for existing instance if we don't have one set but instances are loaded
    let instanceToUse = existingInstance;
    if (!instanceToUse && !instancesLoading && instancesData?.data) {
      const userInstance = instancesData.data.find((instance) => instance.userId === userId);
      if (userInstance) {
        instanceToUse = userInstance;
        setExistingInstance(userInstance);
        setIsPublished(userInstance.is_published || false);
      }
    }

    try {
      if (instanceToUse) {
        // Update existing instance

        const result = await updateDocumentInstance({
          id: instanceToUse.id,
          data: { variableValues, is_published: isPublished },
        }).unwrap();

        setExistingInstance(result.data);
        if (result.data?.is_published !== undefined) {
          setIsPublished(result.data.is_published);
        }
        toast.success("Document modifié avec succès");
      } else {
        // Create new instance
        const result = await createDocumentInstance({
          templateId,
          variableValues,
          is_published: isPublished,
        }).unwrap();

        setExistingInstance(result.data);
        if (result.data?.is_published !== undefined) {
          setIsPublished(result.data.is_published);
        }
        toast.success("Document sauvegardé avec succès");
      }
    } catch (error: any) {
      // Check if it's a 403 Forbidden error with the specific message
      if (
        error?.status === 403 &&
        error?.data?.message === "Ce document est déjà validé et ne peut pas être modifié."
      ) {
        toast.error("Ce document est déjà validé et ne peut pas être modifié.");
      } else {
        toast.error("Erreur lors de la sauvegarde du document");
      }
    }
  }, [
    editor,
    variableValues,
    existingInstance,
    templateId,
    updateDocumentInstance,
    createDocumentInstance,
    instancesLoading,
    instancesData,
    userId,
    isPublished,
  ]);

  // Helper function to convert modern CSS colors to rgb/hex for html2canvas compatibility
  const convertColorToSupportedFormat = useCallback((color: string): string => {
    if (!color || color === "transparent") return "transparent";

    // If already in a supported format (hex, rgb, rgba), return as is
    if (/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color)) return color;
    if (/^rgba?\(/.test(color)) return color;
    if (/^hsla?\(/.test(color)) return color;

    // Create a temporary element to convert modern color formats
    const tempEl = document.createElement("div");
    tempEl.style.color = color;
    document.body.appendChild(tempEl);

    try {
      const computedStyle = window.getComputedStyle(tempEl);
      const rgbColor = computedStyle.color;
      document.body.removeChild(tempEl);

      // Convert rgb() to hex if needed, or return rgb format
      return rgbColor;
    } catch (e) {
      document.body.removeChild(tempEl);
      // Fallback to black if conversion fails
      return "#000000";
    }
  }, []);

  // Helper function to sanitize all styles in an element tree
  const sanitizeStylesForPDF = useCallback(
    (element: HTMLElement) => {
      // Convert element's own styles
      if (element.style.color) {
        element.style.color = convertColorToSupportedFormat(element.style.color);
      }
      if (element.style.backgroundColor) {
        element.style.backgroundColor = convertColorToSupportedFormat(
          element.style.backgroundColor
        );
      }
      if (element.style.borderColor) {
        element.style.borderColor = convertColorToSupportedFormat(element.style.borderColor);
      }
      if (element.style.borderTopColor) {
        element.style.borderTopColor = convertColorToSupportedFormat(element.style.borderTopColor);
      }
      if (element.style.borderRightColor) {
        element.style.borderRightColor = convertColorToSupportedFormat(
          element.style.borderRightColor
        );
      }
      if (element.style.borderBottomColor) {
        element.style.borderBottomColor = convertColorToSupportedFormat(
          element.style.borderBottomColor
        );
      }
      if (element.style.borderLeftColor) {
        element.style.borderLeftColor = convertColorToSupportedFormat(
          element.style.borderLeftColor
        );
      }
      if (element.style.outlineColor) {
        element.style.outlineColor = convertColorToSupportedFormat(element.style.outlineColor);
      }

      // Recursively sanitize all child elements
      const allElements = element.querySelectorAll("*");
      allElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          sanitizeStylesForPDF(el);
        }
      });
    },
    [convertColorToSupportedFormat]
  );

  // Calculate crop settings for PDF generation
  const calculateCropSettings = useCallback(() => {
    if (!editor) {
      toast.error("L'éditeur n'est pas prêt");
      return null;
    }

    try {
      // First, ensure all variable values are updated in the editor DOM
      const variableFields = editor.view.dom.querySelectorAll(".variable-field");
      variableFields.forEach((field) => {
        const fieldEl = field as HTMLElement;
        const wrapper = fieldEl.closest(".variable-field-wrapper") as HTMLElement;
        if (wrapper) {
          const variableName = wrapper.getAttribute("data-variable");
          if (variableName && variableValues[variableName]) {
            const currentValue = fieldEl.textContent?.trim() || "";
            const stateValue = variableValues[variableName];
            if (currentValue !== stateValue) {
              fieldEl.textContent = stateValue;
            }
          }
        }
      });

      // Get the editor's DOM element
      const editorDom = editor.view.dom;

      // Create a temporary div to clone the content for measurement
      const tempDiv = editorDom.cloneNode(true) as HTMLElement;

      // Append to body to get accurate measurements
      document.body.appendChild(tempDiv);

      // Force a reflow to ensure accurate measurements
      tempDiv.offsetHeight;

      // Apply sanitized styles to the temp div
      sanitizeStylesForPDF(tempDiv);

      // Get bounding box of all content including any overflow
      const boundingRect = tempDiv.getBoundingClientRect();
      const allContentElementsForBounds = tempDiv.querySelectorAll("*");
      let maxRight = boundingRect.right;
      let maxBottom = boundingRect.bottom;
      let minLeft = boundingRect.left;
      let minTop = boundingRect.top;

      // Find the leftmost, rightmost, topmost, and bottommost elements
      allContentElementsForBounds.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.left < minLeft) minLeft = rect.left;
        if (rect.right > maxRight) maxRight = rect.right;
        if (rect.top < minTop) minTop = rect.top;
        if (rect.bottom > maxBottom) maxBottom = rect.bottom;
      });

      // Calculate the actual content bounds including any negative positions
      // Account for padding and ensure we start from the leftmost content
      const contentLeftOffset = Math.min(0, minLeft - boundingRect.left); // Account for negative positions
      const contentTopOffset = Math.min(0, minTop - boundingRect.top);
      const contentRightExtent = Math.max(
        tempDiv.scrollWidth,
        tempDiv.offsetWidth,
        maxRight - boundingRect.left
      );
      const contentBottomExtent = Math.max(
        tempDiv.scrollHeight,
        tempDiv.offsetHeight,
        maxBottom - boundingRect.top
      );

      // Calculate default values if crop settings not set
      const defaultWidth =
        Math.max(
          contentRightExtent - contentLeftOffset,
          794 // Minimum A4 width
        ) + 160; // Add 160px buffer (80px on each side) for safety

      const defaultHeight =
        Math.max(
          contentBottomExtent - contentTopOffset,
          1123 // Minimum A4 height
        ) + 160; // Add 160px buffer (80px on each side) for safety

      const defaultOffsetX = contentLeftOffset - 80;
      const defaultOffsetY = contentTopOffset - 80;

      // Use crop settings if available, otherwise use calculated defaults
      const captureOffsetX =
        cropSettings.width > 0 && cropSettings.height > 0 ? cropSettings.offsetX : -140; // Default to -140px
      const captureOffsetY =
        cropSettings.width > 0 && cropSettings.height > 0 ? cropSettings.offsetY : defaultOffsetY;
      const contentWidth =
        cropSettings.width > 0 && cropSettings.height > 0 ? cropSettings.width : defaultWidth;
      const contentHeight =
        cropSettings.width > 0 && cropSettings.height > 0 ? cropSettings.height : defaultHeight;

      // Clean up temp div
      document.body.removeChild(tempDiv);

      // Return the calculated settings
      return {
        offsetX: captureOffsetX,
        offsetY: captureOffsetY,
        width: contentWidth,
        height: contentHeight,
      };
    } catch (error) {
      console.error("Error calculating crop settings:", error);
      // Fallback to default settings
      return {
        offsetX: -140,
        offsetY: 0,
        width: 794, // A4 width in px at 96dpi
        height: 1123, // A4 height in px at 96dpi
      };
    }
  }, [editor, variableValues, sanitizeStylesForPDF, cropSettings]);

  const handleDownloadPDF = useCallback(async () => {
    if (!editor || !isContentLoaded) {
      toast.error("Le contenu n'est pas prêt pour le téléchargement");
      return;
    }

    try {
      // Calculate crop settings before generating PDF
      const calculatedCropSettings = calculateCropSettings();
      if (!calculatedCropSettings) {
        toast.error("Impossible de calculer les dimensions du PDF");
        return;
      }

      setCropSettings(calculatedCropSettings);

      // Get the editor's DOM element
      const editorDom = editor.view.dom;

      // Create a temporary div to clone the content for PDF generation
      const tempDiv = editorDom.cloneNode(true) as HTMLElement;

      // Set styles for PDF generation
      tempDiv.style.padding = "20px";
      tempDiv.style.backgroundColor = "#ffffff";
      tempDiv.style.width = "auto";
      tempDiv.style.maxWidth = "none";
      tempDiv.style.boxSizing = "border-box";

      // Append to body to get accurate measurements and rendering
      document.body.appendChild(tempDiv);

      // Force a reflow
      tempDiv.offsetHeight;

      // Apply sanitized styles to ensure compatibility
      sanitizeStylesForPDF(tempDiv);

      // Use the calculated crop settings
      const { offsetX, offsetY, width, height } = calculatedCropSettings;

      // Generate PDF using html2pdf
      const marginTuple: [number, number, number, number] = [10, 10, 10, 10];
      const options = {
        margin: marginTuple,
        filename: `${title || "document"}_${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          letterRendering: true,
          logging: false, // Disable logging for production
          backgroundColor: "#ffffff",
          // Use calculated dimensions to capture all content
          windowWidth: width,
          windowHeight: height,
          width: width,
          height: height,
          // Capture from the leftmost/topmost point to ensure no content is cut off
          x: offsetX,
          y: offsetY,
          // Additional options to ensure full capture
          removeContainer: false,
          imageTimeout: 15000,
          // Ensure we don't clip content
          scrollX: 0,
          scrollY: 0,
          // Ensure we capture the entire element including any overflow
          ignoreElements: (_element: Element) => {
            // Don't ignore any elements - capture everything
            return false;
          },
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait" as const,
          compress: true,
        },
      };

      toast.loading("Génération du PDF en cours...", { id: "pdf-generation" });

      // Generate PDF - tempDiv is still in DOM
      await html2pdf().set(options).from(tempDiv).save();

      // Clean up: remove tempDiv from DOM after PDF generation
      if (tempDiv.parentNode) {
        document.body.removeChild(tempDiv);
      }

      toast.dismiss("pdf-generation");
      toast.success("PDF téléchargé avec succès");
    } catch (error) {
      console.error("❌ Error downloading PDF:", error);
      toast.error("Erreur lors du téléchargement du PDF");
    }
  }, [editor, title, sanitizeStylesForPDF, isContentLoaded, calculateCropSettings]);

  // Debug logging
  useEffect(() => {}, [
    templateId,
    sessionId,
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/student/documents")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">
              {templateLoading ? "Chargement..." : `Remplir le document : ${title}`}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Document Area */}
      <div className="flex-1 overflow-auto px-6 py-8">
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
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${existingInstance ? "bg-green-500" : "bg-amber-400"}`}
            ></div>
            {existingInstance
              ? "Document existant trouvé. Vous pouvez modifier les valeurs."
              : "Cliquez sur les champs surlignés pour les remplir"}
            {existingInstance && (
              <div className="flex items-center gap-4 ml-4">
                <div className="flex items-center gap-2">
                  <span>Publié:</span>
                  <Checkbox
                    checked={isPublished}
                    onCheckedChange={(checked) => setIsPublished(!!checked)}
                  />
                </div>
                {isPublished && (
                  <>
                    <div className="flex items-center gap-2">
                      <span>Statut:</span>
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          existingInstance.status === "validated"
                            ? "bg-green-100 text-green-800"
                            : existingInstance.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {existingInstance.status === "validated"
                          ? "Validé"
                          : existingInstance.status === "rejected"
                            ? "Rejeté"
                            : "En attente"}
                      </span>
                    </div>
                    {existingInstance.status === "rejected" && existingInstance.comment && (
                      <div className="flex items-center gap-2">
                        <span>Commentaire:</span>
                        <span className="text-sm text-gray-600 italic">
                          "{existingInstance.comment}"
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleDownloadPDF()}
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
