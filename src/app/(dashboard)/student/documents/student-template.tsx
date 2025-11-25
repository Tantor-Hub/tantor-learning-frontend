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
import { Checkbox } from "@/components/ui/checkbox";
import { Save, X, Loader2, Download } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { useAppSelector } from "@/store/store";
import { selectCurrentUser } from "@/features/auth/auth-slice";

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

  addOptions() {
    return {
      editable: true,
    };
  },

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
    const isEditable = this.options.editable;

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
          contenteditable: isEditable ? "true" : "false",
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
            cursor: ${isEditable ? "text" : "not-allowed"};
            -webkit-user-select: ${isEditable ? "text" : "none"};
            -moz-user-select: ${isEditable ? "text" : "none"};
            -ms-user-select: ${isEditable ? "text" : "none"};
            user-select: ${isEditable ? "text" : "none"};
            position: relative;
            opacity: ${isEditable ? "1" : "0.6"};
            pointer-events: ${isEditable ? "auto" : "none"};
          `,
        },
        value || "",
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
  const [isPublished, setIsPublished] = useState(false);
  const [signatureAccepted, setSignatureAccepted] = useState(false);
  const [showSignatureWarning, setShowSignatureWarning] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [commentTop, setCommentTop] = useState<number | null>(null);
  const currentUser = useAppSelector(selectCurrentUser);
  const activeFieldRef = useRef<HTMLElement | null>(null);

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
    useGetDocumentInstancesByTemplateIdQuery({ templateId }, { skip: !templateId || !open });
  const [createDocumentInstance, { isLoading: isCreating }] = useCreateDocumentInstanceMutation();
  const [updateDocumentInstance, { isLoading: isUpdating }] = useUpdateDocumentInstanceMutation();

  const isSaving = isCreating || isUpdating;

  const title = templateData?.data?.title || "";

  // Determine if the document should be readonly
  const isReadonly =
    existingInstance?.signature === true ||
    (existingInstance?.is_published &&
      (existingInstance?.status === "pending" || existingInstance?.status === "validated"));

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
      EditableVariable.configure({
        editable: !isReadonly,
      }),
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

        // If clicking on a variable field and editable, allow it and focus
        if (target.classList.contains("variable-field") && !isReadonly) {
          target.focus();
          return true; // Allow the click
        }

        // If clicking on a variable wrapper and editable, focus the inner field
        if (target.classList.contains("variable-field-wrapper") && !isReadonly) {
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

        if (isInVariableField && !isReadonly) {
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

        event.preventDefault();
        event.stopPropagation();
        return true;
      },
    },
    editable: !isReadonly,
  });

  // Set client side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update editor editable state when isReadonly changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!isReadonly);
    }
  }, [editor, isReadonly]);

  // Disable all variable fields when document is readonly (signed)
  useEffect(() => {
    if (!editor || !isContentLoaded || !isClient) return;

    const variableFields = editor.view.dom.querySelectorAll(".variable-field");
    variableFields.forEach((field) => {
      const fieldEl = field as HTMLElement;
      if (isReadonly) {
        // Disable the field
        fieldEl.setAttribute("contenteditable", "false");
        fieldEl.style.pointerEvents = "none";
        fieldEl.style.cursor = "not-allowed";
        fieldEl.style.opacity = "0.6";
        // Prevent any interaction
        fieldEl.style.userSelect = "none";
        fieldEl.style.setProperty("-webkit-user-select", "none");
        fieldEl.style.setProperty("-moz-user-select", "none");
        fieldEl.style.setProperty("-ms-user-select", "none");
      } else {
        // Re-enable the field
        fieldEl.setAttribute("contenteditable", "true");
        fieldEl.style.pointerEvents = "auto";
        fieldEl.style.cursor = "text";
        fieldEl.style.opacity = "1";
        fieldEl.style.userSelect = "text";
        fieldEl.style.setProperty("-webkit-user-select", "text");
        fieldEl.style.setProperty("-moz-user-select", "text");
        fieldEl.style.setProperty("-ms-user-select", "text");
      }
    });
  }, [editor, isContentLoaded, isClient, isReadonly]);

  // Load template when component opens
  useEffect(() => {
    if (open && templateId && isClient) {
      setIsContentLoaded(false);
      setVariableValues({}); // Reset variable values
      setExistingInstance(null); // Reset existing instance
      setIsPublished(false); // Reset published state
      setSignatureAccepted(false); // Reset signature acceptance
      setShowSignatureWarning(false); // Reset warning dialog
      getDocumentTemplate({ id: templateId });
    } else if (!open) {
      // Reset state when modal closes
      setIsContentLoaded(false);
      setVariableValues({});
      setExistingInstance(null);
      setIsPublished(false);
      setSignatureAccepted(false);
      setShowSignatureWarning(false);
    }
  }, [open, templateId, getDocumentTemplate, isClient]);

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
          setSignatureAccepted(userInstance.signature === true);

          // Force a small delay to ensure state update is processed
          setTimeout(() => {}, 100);
        } else {
          setExistingInstance(null);
          setVariableValues({});
          setIsPublished(false);
          setSignatureAccepted(false);
        }
      } else if (instancesData === undefined || instancesData.data === undefined) {
        // Instances query completed but no data found (empty array or undefined)

        setExistingInstance(null);
        setVariableValues({});
        setIsPublished(false);
        setSignatureAccepted(false);
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
          const convertContent = (
            content: any,
            values: Record<string, string>,
            signatureAccepted: boolean,
            currentUser: any
          ): any => {
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

            let convertedContent = content;
            if (content.type === "doc" && Array.isArray(content.content)) {
              convertedContent = {
                ...content,
                content: content.content.map(traverse).filter(Boolean),
              };
            }

            // If signature is required and document is validated, append signature to the last empty paragraph
            if (
              templateData.data?.signature &&
              existingInstance?.status === "validated" &&
              currentUser
            ) {
              const signatureContent = [
                {
                  type: "paragraph",
                  attrs: { textAlign: "left" },
                  content: [
                    {
                      type: "text",
                      text: "Signature",
                      marks: [{ type: "bold" }],
                    },
                  ],
                },
                {
                  type: "paragraph",
                  attrs: { textAlign: "left" },
                  content: [
                    {
                      type: "text",
                      text: `${currentUser.firstName} ${currentUser.lastName}`,
                      marks: [{ type: "italic" }],
                    },
                  ],
                },
              ];

              if (convertedContent.type === "doc" && Array.isArray(convertedContent.content)) {
                // Find the last paragraph that is empty or has "Signature"
                let lastParagraphIndex = -1;
                for (let i = convertedContent.content.length - 1; i >= 0; i--) {
                  const node = convertedContent.content[i];
                  if (node.type === "paragraph") {
                    if (
                      !node.content ||
                      node.content.length === 0 ||
                      (node.content.length === 1 && node.content[0].text === "Signature")
                    ) {
                      lastParagraphIndex = i;
                      break;
                    }
                  }
                }
                if (lastParagraphIndex !== -1) {
                  // Replace the last empty paragraph with signature
                  convertedContent.content.splice(lastParagraphIndex, 1, ...signatureContent);
                } else {
                  // Append to the end
                  convertedContent.content.push(...signatureContent);
                }
              }
            }

            return convertedContent;
          };

          const convertedContent = convertContent(
            templateData.data.content,
            finalVariableValues,
            signatureAccepted,
            currentUser
          );

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
  }, [
    editor,
    templateData?.data,
    isClient,
    instancesLoading,
    instancesData,
    userId,
    signatureAccepted,
    currentUser,
  ]);

  // Event handlers for variable fields
  // Use a callback to prevent unnecessary re-renders and cursor jumps
  const updateVariableField = useCallback((variableName: string, value: string) => {
    setVariableValues((prev) => {
      // Only update if the value actually changed to prevent unnecessary re-renders
      if (prev[variableName] === value) {
        return prev; // Return same object reference to prevent re-render
      }
      return {
        ...prev,
        [variableName]: value,
      };
    });
  }, []);

  // Add CSS styles for signature and apply styling after content loads
  useEffect(() => {
    const styleId = "signature-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .signature-title {
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }
        .signature-name {
          padding-top: 1.5rem;
          margin-top: 0;
          font-family: 'Brush Script MT', 'Lucida Handwriting', 'Comic Sans MS', 'Georgia', 'Times New Roman', serif;
          font-style: italic !important;
          font-size: 1.25rem;
          color: #333;
        }
      `;
      document.head.appendChild(style);
    }

    // Apply signature styling dynamically after content loads
    if (editor && isContentLoaded && existingInstance?.status === "validated" && currentUser) {
      const timeoutId = setTimeout(() => {
        const editorElement = editor.view.dom;
        const paragraphs = editorElement.querySelectorAll("p");

        paragraphs.forEach((p, index) => {
          const paragraph = p as HTMLElement;
          const text = paragraph.textContent?.trim() || "";

          // Find signature title paragraph
          if (text === "Signature" && paragraph.querySelector("strong")) {
            paragraph.classList.add("signature-title");

            // Find the next paragraph which should contain the name
            const nextParagraph = paragraphs[index + 1] as HTMLElement | undefined;
            if (nextParagraph && nextParagraph.querySelector("em")) {
              nextParagraph.classList.add("signature-name");
            }
          }
        });
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [editor, isContentLoaded, signatureAccepted, currentUser]);

  // Set up event listeners for variable fields and placeholder behavior
  useEffect(() => {
    if (!editor || !isContentLoaded || !isClient || isReadonly) return;

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
      if (target && target.classList.contains("variable-field") && !isReadonly) {
        // Mark this field as actively being edited to prevent other effects from updating it
        activeFieldRef.current = target;

        // Save scroll position and current selection before any updates
        const scrollContainer = editor.view.dom.closest(".overflow-auto") || window;
        const scrollTop =
          scrollContainer === window ? window.scrollY : (scrollContainer as HTMLElement).scrollTop;
        const scrollLeft =
          scrollContainer === window ? window.scrollX : (scrollContainer as HTMLElement).scrollLeft;

        // Save cursor position more accurately
        const selection = window.getSelection();
        let savedRange: Range | null = null;
        let cursorOffset = 0;
        if (selection && selection.rangeCount !== undefined && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          savedRange = range.cloneRange();
          // Calculate cursor offset within the field
          if (range.startContainer === target || target.contains(range.startContainer)) {
            const textNode =
              range.startContainer.nodeType === 3 // Node.TEXT_NODE
                ? range.startContainer
                : target.childNodes[0] || target;
            if (textNode && textNode.nodeType === 3) {
              // Node.TEXT_NODE
              cursorOffset = range.startOffset;
            } else {
              // Fallback: count characters before cursor
              const textBefore = range.toString().length;
              cursorOffset = textBefore;
            }
          }
        }

        const wrapper = target.closest("[data-variable]");
        const variableName = wrapper?.getAttribute("data-variable");

        if (variableName) {
          const newValue = target.textContent || "";

          // Update styling based on whether field has value (don't wait for state update)
          const hasValue = newValue.trim().length > 0;
          target.style.backgroundColor = hasValue ? "#fef3c7" : "#fef9e7";
          target.style.borderBottomColor = hasValue ? "#d97706" : "#f59e0b";
          target.style.color = hasValue ? "#78716c" : "#a8a29e";
          target.style.fontStyle = hasValue ? "normal" : "italic";

          // Clean up empty content to ensure placeholder shows
          if (!newValue.trim()) {
            // Don't clear innerHTML if user is typing - preserve cursor
            if (target.innerHTML.trim() === "") {
              target.setAttribute("data-empty", "true");
            }
          } else {
            target.removeAttribute("data-empty");
          }

          updatePlaceholder(target);

          // Use requestAnimationFrame to batch the state update and avoid scroll jumps
          // This ensures the state update happens after the DOM has settled
          requestAnimationFrame(() => {
            updateVariableField(variableName, newValue);

            // Restore cursor position immediately after state update
            requestAnimationFrame(() => {
              // Restore scroll
              if (scrollContainer === window) {
                window.scrollTo(scrollLeft, scrollTop);
              } else {
                (scrollContainer as HTMLElement).scrollTop = scrollTop;
                (scrollContainer as HTMLElement).scrollLeft = scrollLeft;
              }

              // Restore focus and cursor position
              if (document.activeElement !== target) {
                target.focus();
              }

              // Restore cursor position
              if (selection) {
                try {
                  // Try to restore the saved range first
                  if (
                    savedRange &&
                    savedRange.startContainer &&
                    savedRange.startContainer.parentNode
                  ) {
                    selection.removeAllRanges();
                    selection.addRange(savedRange);
                  } else {
                    // Fallback: restore cursor to saved offset
                    const range = document.createRange();
                    const textNode = target.childNodes[0] || target;
                    if (textNode && textNode.nodeType === 3) {
                      // Node.TEXT_NODE
                      const maxOffset = Math.min(cursorOffset, textNode.textContent?.length || 0);
                      range.setStart(textNode, maxOffset);
                      range.setEnd(textNode, maxOffset);
                      selection.removeAllRanges();
                      selection.addRange(range);
                    } else {
                      // Last resort: move to end
                      range.selectNodeContents(target);
                      range.collapse(false);
                      selection.removeAllRanges();
                      selection.addRange(range);
                    }
                  }
                } catch (e) {
                  // If range is invalid, just focus the element and move to end
                  const range = document.createRange();
                  range.selectNodeContents(target);
                  range.collapse(false);
                  selection.removeAllRanges();
                  selection.addRange(range);
                }
              }
            });
          });
        }
      }
    };

    const handleFocus = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && target.classList.contains("variable-field") && !isReadonly) {
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
      if (target && target.classList.contains("variable-field") && !isReadonly) {
        // Clear the active field ref when user leaves the field
        if (activeFieldRef.current === target) {
          activeFieldRef.current = null;
        }

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
      // If clicking on a variable field wrapper and editable, focus the inner field
      if (target.classList.contains("variable-field-wrapper") && !isReadonly) {
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
  }, [editor, updateVariableField, isContentLoaded, isClient, isReadonly]);

  // Update variable fields in DOM when variableValues change (for existing instances)
  // IMPORTANT: Skip updating fields that are currently focused to prevent cursor jumping
  useEffect(() => {
    if (!editor || !isContentLoaded || !isClient || isReadonly) return;

    // Get the currently focused element
    const activeElement = document.activeElement as HTMLElement;
    const isFieldFocused = activeElement?.classList?.contains("variable-field");

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

        // CRITICAL: Skip updating if this field is currently focused/being edited
        // This prevents cursor jumping while the user is typing
        if (
          document.activeElement === fieldEl ||
          fieldEl.contains(document.activeElement) ||
          activeFieldRef.current === fieldEl
        ) {
          return; // Skip this field - user is actively editing it
        }

        const wrapper = fieldEl.closest("[data-variable]") as HTMLElement;
        if (wrapper) {
          const variableName = wrapper.getAttribute("data-variable");

          if (variableName && variableValues.hasOwnProperty(variableName)) {
            const savedValue = variableValues[variableName] || "";
            const currentValue = fieldEl.textContent?.trim() || "";

            // Update if the value is different (including empty string case)
            if (savedValue !== currentValue) {
              // Save and restore selection if needed
              const wasFocused = document.activeElement === fieldEl;

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
  }, [variableValues, editor, isContentLoaded, isClient, isReadonly]);

  // Position the secretary comment similar to Google Docs near the first editable field
  useEffect(() => {
    if (!cardRef.current) return;
    if (!(existingInstance && existingInstance.comment)) {
      setCommentTop(null);
      return;
    }

    const computePosition = () => {
      const container = cardRef.current as HTMLElement;
      const anchor = (container.querySelector(".variable-field") ||
        container.querySelector("[data-variable]") ||
        container.querySelector("p, h1, h2, h3, h4, h5, h6")) as HTMLElement | null;

      const containerRect = container.getBoundingClientRect();
      const anchorRect = (anchor || container).getBoundingClientRect();

      const top = Math.max(16, anchorRect.top - containerRect.top);
      setCommentTop(top);
    };

    computePosition();
    window.addEventListener("resize", computePosition);
    return () => window.removeEventListener("resize", computePosition);
  }, [existingInstance, isContentLoaded]);

  // Save or Update document instance
  const handleSave = useCallback(async () => {
    if (!editor) return;

    // Ensure instances have finished loading before saving
    // This is important to correctly determine if we should create or update
    if (instancesLoading) {
      toast.loading("Vérification de l'instance existante...", { id: "checking-instance" });

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
          data: {
            variableValues,
            is_published: isPublished,
            signature: signatureAccepted ? true : undefined,
          },
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

        // If signature is accepted, update the instance with signature
        if (signatureAccepted && result.data) {
          const updatedResult = await updateDocumentInstance({
            id: result.data.id,
            data: {
              variableValues,
              is_published: isPublished,
              signature: true,
            },
          }).unwrap();
          setExistingInstance(updatedResult.data);
        } else {
          setExistingInstance(result.data);
        }

        if (result.data?.is_published !== undefined) {
          setIsPublished(result.data.is_published);
        }
        toast.success("Document sauvegardé avec succès");
      }
    } catch (error: any) {
      console.error("❌ Error saving document instance:", error);

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
    signatureAccepted,
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
      const editorElement = editor.view.dom;
      let editorContent = editorElement as HTMLElement;

      if (editorElement.classList.contains("ProseMirror")) {
        editorContent = editorElement;
      } else {
        const proseMirror = editorElement.querySelector(".ProseMirror") as HTMLElement;
        if (proseMirror) {
          editorContent = proseMirror;
        }
      }

      if (!editorContent || !editorContent.innerHTML.trim()) {
        toast.error("Le contenu de l'éditeur est vide");
        return null;
      }

      // Clone the editor content
      const tempDiv = editorContent.cloneNode(true) as HTMLElement;

      // Apply base styles
      const originalStyles = window.getComputedStyle(editorContent);
      const styleProps = [
        "fontFamily",
        "fontSize",
        "fontWeight",
        "fontStyle",
        "lineHeight",
        "color",
        "backgroundColor",
        "textAlign",
        "textDecoration",
        "margin",
        "padding",
        "border",
        "display",
      ];

      styleProps.forEach((prop) => {
        const value = originalStyles.getPropertyValue(prop);
        if (value) {
          tempDiv.style.setProperty(prop, value);
        }
      });

      tempDiv.style.fontFamily = "Arial, sans-serif";
      tempDiv.style.fontSize = "12px";
      tempDiv.style.lineHeight = "1.5";
      tempDiv.style.padding = "20px";
      tempDiv.style.width = "fit-content";
      tempDiv.style.minWidth = "794px";
      tempDiv.style.maxWidth = "none";
      tempDiv.style.color = "#000000";
      tempDiv.style.backgroundColor = "#ffffff";
      tempDiv.style.position = "relative";
      tempDiv.style.display = "block";
      tempDiv.style.boxSizing = "border-box";
      tempDiv.style.overflow = "visible";
      tempDiv.style.wordWrap = "break-word";
      tempDiv.style.whiteSpace = "normal";

      // Process tables
      const tables = tempDiv.querySelectorAll("table");
      tables.forEach((table) => {
        const tableEl = table as HTMLElement;
        tableEl.style.width = "auto";
        tableEl.style.maxWidth = "none";
        tableEl.style.minWidth = "100%";
        tableEl.style.tableLayout = "auto";
      });

      // Replace variable fields with plain text
      const variableWrappers = tempDiv.querySelectorAll(".variable-field-wrapper");
      variableWrappers.forEach((wrapper) => {
        const wrapperEl = wrapper as HTMLElement;
        const variableField = wrapperEl.querySelector(".variable-field") as HTMLElement;

        if (variableField) {
          let value = variableField.textContent?.trim() || "";
          if (!value) {
            const variableName = wrapperEl.getAttribute("data-variable");
            if (variableName && variableValues[variableName]) {
              value = variableValues[variableName];
            }
          }
          value = value.replace(/^\{\{[^}]+\}\}$/, "").trim();
          const textNode = document.createTextNode(value || "");
          if (wrapperEl.parentNode) {
            wrapperEl.parentNode.replaceChild(textNode, wrapperEl);
          }
        }
      });

      const remainingFields = tempDiv.querySelectorAll(".variable-field");
      remainingFields.forEach((field) => {
        const fieldEl = field as HTMLElement;
        let value = fieldEl.textContent?.trim() || "";
        const wrapper = fieldEl.closest("[data-variable]") as HTMLElement;
        if (wrapper) {
          const variableName = wrapper.getAttribute("data-variable");
          if (!value && variableName && variableValues[variableName]) {
            value = variableValues[variableName];
          }
        }
        value = value.replace(/^\{\{[^}]+\}\}$/, "").trim();
        const textNode = document.createTextNode(value || "");
        if (fieldEl.parentNode) {
          fieldEl.parentNode.replaceChild(textNode, fieldEl);
        }
      });

      // Attach to DOM temporarily to calculate dimensions
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "0";
      document.body.appendChild(tempDiv);

      // Calculate dimensions
      void tempDiv.offsetWidth;
      void tempDiv.scrollWidth;
      void tempDiv.scrollHeight;

      const boundingRect = tempDiv.getBoundingClientRect();
      const allContentElementsForBounds = tempDiv.querySelectorAll("*");
      let maxRight = boundingRect.right;
      let maxBottom = boundingRect.bottom;
      let minLeft = boundingRect.left;
      let minTop = boundingRect.top;

      allContentElementsForBounds.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.left < minLeft) minLeft = rect.left;
        if (rect.right > maxRight) maxRight = rect.right;
        if (rect.top < minTop) minTop = rect.top;
        if (rect.bottom > maxBottom) maxBottom = rect.bottom;
      });

      const contentLeftOffset = Math.min(0, minLeft - boundingRect.left);
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

      const calculatedWidth = Math.max(contentRightExtent - contentLeftOffset, 794) + 160;

      const calculatedHeight = Math.max(contentBottomExtent - contentTopOffset, 1123) + 160;

      const calculatedOffsetX = contentLeftOffset - 80;
      const calculatedOffsetY = contentTopOffset - 80;

      // Set initial crop settings
      setCropSettings({
        offsetX: -140, // Default to -140px for better left content capture
        offsetY: calculatedOffsetY,
        width: calculatedWidth,
        height: calculatedHeight,
      });

      // Remove from DOM
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error("Error calculating crop settings:", error);
      // Use defaults if calculation fails
      setCropSettings({
        offsetX: -140,
        offsetY: -80,
        width: 954, // 794 + 160
        height: 1283, // 1123 + 160
      });
    }
  }, [editor, variableValues]);

  // Download PDF
  const handleDownloadPDF = useCallback(async () => {
    if (!editor) {
      toast.error("L'éditeur n'est pas prêt");
      return;
    }

    try {
      // Calculate crop settings if not already calculated
      if (cropSettings.width === 0 || cropSettings.height === 0) {
        calculateCropSettings();
        // Wait a bit for state to update
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // First, ensure all variable values are updated in the editor DOM
      // This ensures the HTML we extract has the latest values
      const variableFields = editor.view.dom.querySelectorAll(".variable-field");
      variableFields.forEach((field) => {
        const fieldEl = field as HTMLElement;
        const wrapper = fieldEl.closest(".variable-field-wrapper") as HTMLElement;
        if (wrapper) {
          const variableName = wrapper.getAttribute("data-variable");
          if (variableName && variableValues[variableName]) {
            // Update the text content if it's different
            const currentValue = fieldEl.textContent?.trim() || "";
            const stateValue = variableValues[variableName];
            if (currentValue !== stateValue) {
              fieldEl.textContent = stateValue;
            }
          }
        }
      });

      // Get the editor's DOM element - it might be the ProseMirror element itself or contain it
      const editorElement = editor.view.dom;
      let editorContent = editorElement as HTMLElement;

      // Check if it's the ProseMirror element or if it contains one
      if (editorElement.classList.contains("ProseMirror")) {
        editorContent = editorElement;
      } else {
        const proseMirror = editorElement.querySelector(".ProseMirror") as HTMLElement;
        if (proseMirror) {
          editorContent = proseMirror;
        }
      }

      if (!editorContent || !editorContent.innerHTML.trim()) {
        toast.error("Le contenu de l'éditeur est vide");
        return;
      }

      // Clone the editor content to avoid modifying the original
      const tempDiv = editorContent.cloneNode(true) as HTMLElement;

      // Copy computed styles from the original to ensure all styles are preserved
      const originalStyles = window.getComputedStyle(editorContent);
      const styleProps = [
        "fontFamily",
        "fontSize",
        "fontWeight",
        "fontStyle",
        "lineHeight",
        "color",
        "backgroundColor",
        "textAlign",
        "textDecoration",
        "margin",
        "padding",
        "border",
        "display",
      ];

      styleProps.forEach((prop) => {
        const value = originalStyles.getPropertyValue(prop);
        if (value) {
          tempDiv.style.setProperty(prop, value);
        }
      });

      // Apply base styles to ensure content is visible and properly sized
      tempDiv.style.fontFamily = "Arial, sans-serif";
      tempDiv.style.fontSize = "12px";
      tempDiv.style.lineHeight = "1.5";
      tempDiv.style.padding = "20px";
      // Remove all width constraints - let content determine its natural width
      tempDiv.style.width = "fit-content";
      tempDiv.style.minWidth = "794px"; // Minimum A4 width
      tempDiv.style.maxWidth = "none"; // No maximum width constraint
      tempDiv.style.color = "#000000";
      tempDiv.style.backgroundColor = "#ffffff";
      tempDiv.style.position = "fixed";
      tempDiv.style.left = "0";
      tempDiv.style.top = "0";
      tempDiv.style.zIndex = "9999";
      tempDiv.style.visibility = "visible";
      tempDiv.style.display = "block";
      tempDiv.style.boxSizing = "border-box";
      tempDiv.style.overflow = "visible";
      tempDiv.style.wordWrap = "break-word";
      tempDiv.style.whiteSpace = "normal";

      // Ensure tables don't get constrained
      const tables = tempDiv.querySelectorAll("table");
      tables.forEach((table) => {
        const tableEl = table as HTMLElement;
        tableEl.style.width = "auto";
        tableEl.style.maxWidth = "none";
        tableEl.style.minWidth = "100%";
        tableEl.style.tableLayout = "auto";
      });

      // Ensure all content elements are visible
      const allContentElements = tempDiv.querySelectorAll(
        "p, h1, h2, h3, h4, h5, h6, ul, ol, li, table, tr, td, th, blockquote, pre, code, div, span"
      );
      allContentElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        if (htmlEl.style.display === "none") {
          htmlEl.style.display = "";
        }
        if (htmlEl.style.visibility === "hidden") {
          htmlEl.style.visibility = "visible";
        }
        // Ensure text color is set
        if (!htmlEl.style.color || htmlEl.style.color === "transparent") {
          htmlEl.style.color = "#000000";
        }
        // Remove any positioning that might hide content
        if (htmlEl.style.position === "absolute" && htmlEl.style.left === "-9999px") {
          htmlEl.style.position = "relative";
          htmlEl.style.left = "auto";
        }
      });

      // Attach to DOM immediately so we can query elements and images can load
      document.body.appendChild(tempDiv);

      // Force a reflow to ensure dimensions are calculated
      void tempDiv.offsetHeight;

      // Replace variable fields with plain text for PDF
      // First, find all variable field wrappers
      const variableWrappers = tempDiv.querySelectorAll(".variable-field-wrapper");

      variableWrappers.forEach((wrapper) => {
        const wrapperEl = wrapper as HTMLElement;
        const variableField = wrapperEl.querySelector(".variable-field") as HTMLElement;

        if (variableField) {
          // Get the actual text content (this should be the filled value, not placeholder)
          let value = variableField.textContent?.trim() || "";

          // If empty, try to get from variableValues state using the variable name
          if (!value) {
            const variableName = wrapperEl.getAttribute("data-variable");
            if (variableName && variableValues[variableName]) {
              value = variableValues[variableName];
            }
          }

          // Remove placeholder text patterns
          value = value.replace(/^\{\{[^}]+\}\}$/, "").trim();

          // Create a replacement text node or span with the actual value
          const textNode = document.createTextNode(value || "");

          // Replace the wrapper with just the text
          if (wrapperEl.parentNode) {
            wrapperEl.parentNode.replaceChild(textNode, wrapperEl);
          }
        }
      });

      // Also handle any remaining variable fields that might not be in wrappers
      const remainingFields = tempDiv.querySelectorAll(".variable-field");
      remainingFields.forEach((field) => {
        const fieldEl = field as HTMLElement;
        let value = fieldEl.textContent?.trim() || "";
        const wrapper = fieldEl.closest("[data-variable]") as HTMLElement;

        if (wrapper) {
          const variableName = wrapper.getAttribute("data-variable");
          if (!value && variableName && variableValues[variableName]) {
            value = variableValues[variableName];
          }
        }

        value = value.replace(/^\{\{[^}]+\}\}$/, "").trim();

        const textNode = document.createTextNode(value || "");
        if (fieldEl.parentNode) {
          fieldEl.parentNode.replaceChild(textNode, fieldEl);
        }
      });

      // Clean up any placeholder styles or empty elements
      const placeholderElements = tempDiv.querySelectorAll("[data-show-placeholder]");
      placeholderElements.forEach((elem) => {
        elem.removeAttribute("data-show-placeholder");
      });

      // Ensure signature is included in PDF if signature is required and document is validated
      if (
        templateData?.data?.signature &&
        existingInstance?.status === "validated" &&
        currentUser
      ) {
        // Check if signature already exists in the content
        const paragraphs = tempDiv.querySelectorAll("p");
        let hasSignature = false;
        let hasSignatureName = false;

        paragraphs.forEach((p) => {
          const text = p.textContent?.trim() || "";
          if (text === "Signature" && p.querySelector("strong")) {
            hasSignature = true;
          }
          const paragraphText = p.textContent || "";
          const firstName = currentUser?.firstName;
          const lastName = currentUser?.lastName;
          if (
            firstName &&
            lastName &&
            paragraphText.includes(firstName) &&
            paragraphText.includes(lastName) &&
            p.querySelector("em")
          ) {
            hasSignatureName = true;
          }
        });

        // If signature is missing, add it
        if (!hasSignature || !hasSignatureName) {
          const signatureTitle = document.createElement("p");
          signatureTitle.style.textAlign = "left";
          signatureTitle.style.marginTop = "1.5rem";
          signatureTitle.style.marginBottom = "0.5rem";
          signatureTitle.style.fontWeight = "bold";
          signatureTitle.innerHTML = "<strong>Signature</strong>";

          const signatureName = document.createElement("p");
          signatureName.style.textAlign = "left";
          signatureName.style.paddingTop = "1.5rem";
          signatureName.style.marginTop = "0";
          signatureName.style.fontFamily =
            "'Brush Script MT', 'Lucida Handwriting', 'Comic Sans MS', 'Georgia', 'Times New Roman', serif";
          signatureName.style.fontStyle = "italic";
          signatureName.style.fontSize = "1.25rem";
          signatureName.style.color = "#333";
          const fullName = `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim();
          signatureName.innerHTML = `<em>${fullName}</em>`;

          tempDiv.appendChild(signatureTitle);
          tempDiv.appendChild(signatureName);
        } else {
          // Apply signature styling to existing signature paragraphs
          paragraphs.forEach((p, index) => {
            const paragraph = p as HTMLElement;
            const text = paragraph.textContent?.trim() || "";

            if (text === "Signature" && paragraph.querySelector("strong")) {
              paragraph.classList.add("signature-title");
              paragraph.style.marginTop = "1.5rem";
              paragraph.style.marginBottom = "0.5rem";
              paragraph.style.fontWeight = "bold";

              // Style the next paragraph which should contain the name
              const nextParagraph = paragraphs[index + 1] as HTMLElement | undefined;
              if (nextParagraph && nextParagraph.querySelector("em")) {
                nextParagraph.classList.add("signature-name");
                nextParagraph.style.paddingTop = "1.5rem";
                nextParagraph.style.marginTop = "0";
                nextParagraph.style.fontFamily =
                  "'Brush Script MT', 'Lucida Handwriting', 'Comic Sans MS', 'Georgia', 'Times New Roman', serif";
                nextParagraph.style.fontStyle = "italic";
                nextParagraph.style.fontSize = "1.25rem";
                nextParagraph.style.color = "#333";
              }
            }
          });
        }
      }

      // Ensure all images are properly loaded and visible
      const images = tempDiv.querySelectorAll("img");

      // Wait for all images to load before generating PDF
      const imagePromises = Array.from(images).map((img) => {
        return new Promise<void>((resolve) => {
          const imgElement = img as HTMLImageElement;

          // If image is already loaded, resolve immediately
          if (imgElement.complete && imgElement.naturalWidth > 0) {
            resolve();
            return;
          }

          // Set crossOrigin for CORS images
          if (imgElement.src && !imgElement.src.startsWith("data:")) {
            imgElement.crossOrigin = "anonymous";
          }

          // Wait for image to load
          const handleLoad = () => {
            resolve();
            imgElement.removeEventListener("load", handleLoad);
            imgElement.removeEventListener("error", handleError);
          };

          const handleError = () => {
            console.warn("⚠️ Image failed to load:", imgElement.src);
            resolve(); // Continue even if image fails
            imgElement.removeEventListener("load", handleLoad);
            imgElement.removeEventListener("error", handleError);
          };

          imgElement.addEventListener("load", handleLoad);
          imgElement.addEventListener("error", handleError);

          // Timeout after 5 seconds
          setTimeout(() => {
            resolve();
            imgElement.removeEventListener("load", handleLoad);
            imgElement.removeEventListener("error", handleError);
          }, 5000);
        });
      });

      // Wait for all images to load
      await Promise.all(imagePromises);

      // Ensure images have proper styling for PDF
      images.forEach((img) => {
        const imgElement = img as HTMLImageElement;
        imgElement.style.maxWidth = "100%";
        imgElement.style.height = "auto";
        imgElement.style.display = "block";
        // Ensure image has dimensions
        if (!imgElement.width && !imgElement.style.width) {
          if (imgElement.naturalWidth > 0) {
            imgElement.style.width = `${imgElement.naturalWidth}px`;
          }
        }
        if (!imgElement.height && !imgElement.style.height && imgElement.naturalHeight > 0) {
          imgElement.style.height = `${imgElement.naturalHeight}px`;
        }
      });

      // Sanitize all color styles to convert modern CSS colors (oklch, lab, lch) to rgb/hex

      // Process ALL elements and convert ALL color properties
      const allElementsForColor = tempDiv.querySelectorAll("*");
      const rootElement = tempDiv;
      const allElementsToProcess = [rootElement, ...Array.from(allElementsForColor)];

      allElementsToProcess.forEach((el) => {
        if (el instanceof HTMLElement) {
          try {
            const computedStyle = window.getComputedStyle(el);

            // List of all color-related CSS properties
            const colorProperties = [
              "color",
              "backgroundColor",
              "borderColor",
              "borderTopColor",
              "borderRightColor",
              "borderBottomColor",
              "borderLeftColor",
              "outlineColor",
              "textDecorationColor",
              "columnRuleColor",
              "caretColor",
            ];

            // Process each color property
            colorProperties.forEach((prop) => {
              try {
                const value = computedStyle.getPropertyValue(prop);
                if (
                  value &&
                  value.trim() &&
                  value !== "transparent" &&
                  value !== "rgba(0, 0, 0, 0)"
                ) {
                  // Check if it contains unsupported color formats
                  const lowerValue = value.toLowerCase();
                  if (
                    lowerValue.includes("oklch") ||
                    lowerValue.includes("lch(") ||
                    lowerValue.includes("lab(") ||
                    lowerValue.includes("color-mix")
                  ) {
                    // Create a test element to force browser conversion
                    const testEl = document.createElement("div");
                    testEl.style.setProperty(prop, value, "important");
                    testEl.style.position = "absolute";
                    testEl.style.visibility = "hidden";
                    testEl.style.pointerEvents = "none";
                    document.body.appendChild(testEl);

                    try {
                      const convertedStyle = window.getComputedStyle(testEl);
                      const converted = convertedStyle.getPropertyValue(prop);

                      if (converted && converted.trim()) {
                        const lowerConverted = converted.toLowerCase();
                        // Check if conversion was successful (no oklch/lch/lab in result)
                        if (
                          !lowerConverted.includes("oklch") &&
                          !lowerConverted.includes("lch(") &&
                          !lowerConverted.includes("lab(")
                        ) {
                          el.style.setProperty(prop, converted, "important");
                        } else {
                          // Still has problematic format, use fallback
                          if (prop === "color") {
                            el.style.setProperty(prop, "#000000", "important");
                          } else if (prop.includes("background")) {
                            el.style.setProperty(prop, "#ffffff", "important");
                          } else {
                            el.style.setProperty(prop, "transparent", "important");
                          }
                        }
                      } else {
                        // No conversion value, use fallback
                        if (prop === "color") {
                          el.style.setProperty(prop, "#000000", "important");
                        } else {
                          el.style.setProperty(prop, "transparent", "important");
                        }
                      }
                    } finally {
                      document.body.removeChild(testEl);
                    }
                  } else {
                    // Already safe format, set it inline to override any stylesheet values
                    el.style.setProperty(prop, value, "important");
                  }
                }
              } catch (e) {
                console.warn(`⚠️ Error processing ${prop}:`, e);
              }
            });
          } catch (e) {
            console.warn(`⚠️ Error processing element:`, e);
          }
        }
      });

      // Remove all stylesheets from tempDiv's document (if any)
      // Also remove any style tags that might contain oklch
      const styleTags = tempDiv.querySelectorAll("style");
      styleTags.forEach((style) => {
        const content = style.textContent || "";
        if (content.includes("oklch") || content.includes("lch(") || content.includes("lab(")) {
          style.remove();
        }
      });

      // Final pass: remove any inline styles that still contain oklch
      sanitizeStylesForPDF(tempDiv);

      // Wait a bit for any final rendering and force layout recalculation
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Force multiple layout recalculations to ensure accurate dimensions
      void tempDiv.offsetWidth;
      void tempDiv.scrollWidth;
      void tempDiv.scrollHeight;
      void tempDiv.clientWidth;
      void tempDiv.clientHeight;

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
          windowWidth: contentWidth,
          windowHeight: contentHeight,
          width: contentWidth,
          height: contentHeight,
          // Capture from the leftmost/topmost point to ensure no content is cut off
          x: captureOffsetX,
          y: captureOffsetY,
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
      toast.error("Erreur lors du téléchargement du PDF");
    }
  }, [
    editor,
    title,
    variableValues,
    sanitizeStylesForPDF,
    cropSettings,
    calculateCropSettings,
    templateData,
    signatureAccepted,
    currentUser,
  ]);

  // Debug logging
  useEffect(() => {
    if (open) {
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
          <div
            ref={cardRef}
            className="relative mx-auto bg-white shadow-md rounded-lg border border-gray-300 w-full max-w-[1000px] min-h-[700px]"
          >
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
              <>
                {isReadonly && existingInstance?.signature === true && (
                  <div className="absolute top-4 left-4 right-4 z-10 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-sm">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-yellow-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700 font-medium">
                          Document signé - Ce document ne peut plus être modifié
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <EditorContent editor={editor} ref={editorRef} />
                {existingInstance &&
                  existingInstance.comment &&
                  (() => {
                    const status = existingInstance.status;
                    const styles =
                      status === "validated"
                        ? {
                            box: "bg-green-50 border-green-200",
                            header: "text-green-700",
                            footer: "text-green-700 border-green-200",
                            pointer: "border-r-green-200",
                          }
                        : status === "rejected"
                          ? {
                              box: "bg-red-50 border-red-200",
                              header: "text-red-700",
                              footer: "text-red-700 border-red-200",
                              pointer: "border-r-red-200",
                            }
                          : {
                              box: "bg-yellow-50 border-yellow-200",
                              header: "text-yellow-700",
                              footer: "text-yellow-700 border-yellow-200",
                              pointer: "border-r-yellow-200",
                            };
                    const statusLabel =
                      status === "validated"
                        ? "Validé"
                        : status === "rejected"
                          ? "Rejeté"
                          : "En attente";
                    return (
                      <div
                        className="absolute left-full ml-4 z-30 w-80 max-w-[320px]"
                        style={{ top: commentTop ?? 16 }}
                      >
                        <div className={`relative border rounded-lg shadow-lg ${styles.box}`}>
                          <div className="p-3">
                            <div className={`text-xs font-medium mb-1 ${styles.header}`}>
                              Commentaire
                            </div>
                            <div className="text-sm text-gray-900 whitespace-pre-wrap leading-5">
                              {existingInstance.comment}
                            </div>
                          </div>
                          <div className={`border-t px-3 py-2 text-xs ${styles.footer}`}>
                            Statut: {statusLabel}
                          </div>
                          {/* Small pointer */}
                          <div
                            className={`absolute -left-2 top-3 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent ${styles.pointer}`}
                          />
                          <div className="absolute -left-[7px] top-3 w-0 h-0 border-t-7 border-b-7 border-r-7 border-t-transparent border-b-transparent border-r-white" />
                        </div>
                      </div>
                    );
                  })()}
              </>
            ) : (
              <div className="min-h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-600 text-lg">Initialisation de l'éditeur...</p>
                </div>
              </div>
            )}
          </div>

          {/* Signature Acceptance Checkbox */}
          {templateData?.data?.signature && (
            <div className="mt-6 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="signature-acceptance"
                  checked={signatureAccepted}
                  disabled={isReadonly}
                  onCheckedChange={(checked) => {
                    if (checked && !isReadonly) {
                      setShowSignatureWarning(true);
                    } else if (!isReadonly) {
                      setSignatureAccepted(false);
                    }
                  }}
                />
                <label
                  htmlFor="signature-acceptance"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  J'accepte de signer ce document avec mon nom et prénom
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 px-8 py-5 border-t bg-white">
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${existingInstance ? "bg-green-500" : "bg-amber-400"}`}
            ></div>
            {existingInstance
              ? isReadonly
                ? existingInstance.signature === true
                  ? "Document signé. Lecture seule."
                  : "Document validé. Lecture seule."
                : "Document existant trouvé. Vous pouvez modifier les valeurs."
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
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
            {/* Only show download button if signature is not required, or if signature is required and accepted */}
            {(!templateData?.data?.signature ||
              (templateData?.data?.signature && signatureAccepted)) && (
              <Button
                variant="outline"
                onClick={() => handleDownloadPDF()}
                disabled={!isContentLoaded || !editor}
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger PDF
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={isSaving || !isContentLoaded || !editor || isReadonly}
            >
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

      {/* Signature Warning Dialog */}
      <AlertDialog open={showSignatureWarning} onOpenChange={setShowSignatureWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de signature</AlertDialogTitle>
            <AlertDialogDescription>
              Attention : Après avoir confirmé, vous ne pourrez plus modifier ce document. Êtes-vous
              sûr de vouloir signer ce document ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowSignatureWarning(false);
                setSignatureAccepted(false);
              }}
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setShowSignatureWarning(false);
                setSignatureAccepted(true);

                // Update the document instance with signature: true
                if (existingInstance) {
                  try {
                    const result = await updateDocumentInstance({
                      id: existingInstance.id,
                      data: {
                        variableValues,
                        is_published: isPublished,
                        signature: true,
                      },
                    }).unwrap();

                    // Update the existing instance state with the signature
                    setExistingInstance(result.data);
                    toast.success("Document signé avec succès");
                  } catch (error: any) {
                    console.error("❌ Error updating signature:", error);
                    toast.error("Erreur lors de la signature du document");
                    setSignatureAccepted(false);
                  }
                } else {
                  // If no instance exists yet, we'll save it when the user clicks save
                  // The signature will be saved when handleSave is called
                }
              }}
            >
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
