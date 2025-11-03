"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useAppDispatch } from "@/store/store";
import { toast } from "react-hot-toast";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link2,
  ImageIcon,
  TableIcon,
  Save,
  X,
  Undo,
  Redo,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Minus,
  Plus,
  Type as StrikeIcon,
  Upload,
  Loader2,
  FileText,
} from "lucide-react";

// Custom extension for font size
import { Extension, Node } from "@tiptap/core";

const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    };
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
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
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
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run();
        },
    };
  },
});

// Custom Image extension with resize capability
import { ReactRenderer } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";

// React component for resizable image
const ResizableImageComponent = ({
  node,
  updateAttributes,
  selected: initialSelected,
  editor,
  getPos,
}: any) => {
  const [width, setWidth] = React.useState(node.attrs.width || null);
  const [height, setHeight] = React.useState(node.attrs.height || null);
  const [isResizing, setIsResizing] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [selected, setSelected] = React.useState(initialSelected || false);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const resizeHandleRef = React.useRef<HTMLDivElement>(null);

  // Update selected state when editor selection changes
  React.useEffect(() => {
    if (!editor || typeof getPos !== "function") return;

    const updateSelection = () => {
      const pos = getPos();
      if (pos === null || pos === undefined) {
        setSelected(false);
        return;
      }
      const { selection } = editor.state;
      // Check if it's a NodeSelection and if the position matches
      const isNodeSelection =
        selection.constructor.name === "NodeSelection" || (selection as any).node;
      const isSelected = isNodeSelection && (selection as any).from === pos;
      setSelected(isSelected);
    };

    updateSelection();
    editor.on("selectionUpdate", updateSelection);

    return () => {
      editor.off("selectionUpdate", updateSelection);
    };
  }, [editor, getPos]);

  // Ensure component only renders on client to avoid hydration issues
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync width/height from node attributes when they change
  React.useEffect(() => {
    if (node.attrs.width) setWidth(node.attrs.width);
    if (node.attrs.height) setHeight(node.attrs.height);
  }, [node.attrs.width, node.attrs.height]);

  React.useEffect(() => {
    if (imgRef.current && !width && !height && !node.attrs.width && !node.attrs.height) {
      const img = imgRef.current;
      if (img.complete && img.naturalWidth > 0) {
        // Image already loaded
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        const maxWidth = 600;
        if (naturalWidth > maxWidth) {
          const ratio = maxWidth / naturalWidth;
          const newWidth = maxWidth;
          const newHeight = naturalHeight * ratio;
          setWidth(newWidth);
          setHeight(newHeight);
          if (updateAttributes) {
            updateAttributes({
              width: newWidth,
              height: newHeight,
            });
          }
        } else {
          setWidth(naturalWidth);
          setHeight(naturalHeight);
          if (updateAttributes) {
            updateAttributes({
              width: naturalWidth,
              height: naturalHeight,
            });
          }
        }
      } else {
        // Wait for image to load
        const handleLoad = () => {
          if (!imgRef.current) return;
          const naturalWidth = imgRef.current.naturalWidth;
          const naturalHeight = imgRef.current.naturalHeight;
          const maxWidth = 600;
          if (naturalWidth > maxWidth) {
            const ratio = maxWidth / naturalWidth;
            const newWidth = maxWidth;
            const newHeight = naturalHeight * ratio;
            setWidth(newWidth);
            setHeight(newHeight);
            if (updateAttributes) {
              updateAttributes({
                width: newWidth,
                height: newHeight,
              });
            }
          } else {
            setWidth(naturalWidth);
            setHeight(naturalHeight);
            if (updateAttributes) {
              updateAttributes({
                width: naturalWidth,
                height: naturalHeight,
              });
            }
          }
        };
        img.addEventListener("load", handleLoad);
        return () => {
          img.removeEventListener("load", handleLoad);
        };
      }
    }
  }, [node.attrs.src, updateAttributes]);

  // Handle resize on corner handle
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = width || imgRef.current.offsetWidth;
    const startHeight = height || imgRef.current.offsetHeight;
    const aspectRatio = startWidth / startHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      // Calculate new dimensions based on diagonal movement
      const newWidth = Math.max(50, startWidth + deltaX);
      const newHeight = Math.max(50, startHeight + deltaY);

      // Maintain aspect ratio
      let finalWidth = newWidth;
      let finalHeight = newHeight;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Resize based on width
        finalHeight = newWidth / aspectRatio;
      } else {
        // Resize based on height
        finalWidth = newHeight * aspectRatio;
      }

      const roundedWidth = Math.round(finalWidth);
      const roundedHeight = Math.round(finalHeight);

      setWidth(roundedWidth);
      setHeight(roundedHeight);

      // Update attributes during resize for real-time feedback
      if (updateAttributes && editor) {
        try {
          updateAttributes({
            width: roundedWidth,
            height: roundedHeight,
          });
        } catch (e) {
          // Silently fail during resize to avoid console spam
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      const finalWidth = width || imgRef.current?.offsetWidth || 0;
      const finalHeight = height || imgRef.current?.offsetHeight || 0;

      // Update attributes using editor commands
      if (editor && updateAttributes) {
        try {
          updateAttributes({
            width: finalWidth,
            height: finalHeight,
          });
        } catch (e) {
          console.error("Error updating image attributes:", e);
        }
      }

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle drag to move when clicking on image (not on resize handle)
  const [isDragging, setIsDragging] = React.useState(false);
  const dragOffsetRef = React.useRef({ x: 0, y: 0 });
  const dragStartPosRef = React.useRef<number | null>(null);

  const handleImageMouseDown = (e: React.MouseEvent) => {
    // Don't start dragging if clicking on resize handle
    if ((e.target as HTMLElement).classList.contains("resize-handle")) {
      return;
    }

    // Don't start dragging if resizing
    if (isResizing) {
      return;
    }

    if (!imgRef.current || !editor || typeof getPos !== "function") return;

    const pos = getPos();
    if (pos === null || pos === undefined) return;

    e.preventDefault();
    e.stopPropagation();

    // Select the image node
    editor.commands.setNodeSelection(pos);
    dragStartPosRef.current = pos;

    // Get initial mouse position relative to image
    const imgRect = imgRef.current.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - imgRect.left,
      y: e.clientY - imgRect.top,
    };

    setIsDragging(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (!imgRef.current || !editor || dragStartPosRef.current === null) return;

      // Create a temporary visual feedback by moving the image visually
      // We'll update the actual position on mouse up
      const editorDOM = editor.view.dom;
      const editorRect = editorDOM.getBoundingClientRect();

      // Calculate where the cursor is relative to the editor
      const relativeX = e.clientX - editorRect.left;
      const relativeY = e.clientY - editorRect.top;

      // Find the position in the document where we should drop
      const posAtCoords = editor.view.posAtCoords({ left: relativeX, top: relativeY });
      if (posAtCoords) {
        // Visual feedback: temporarily update cursor
        editorDOM.style.cursor = "move";
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!editor || !imgRef.current || dragStartPosRef.current === null) {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        return;
      }

      // Find drop position
      const editorDOM = editor.view.dom;
      const editorRect = editorDOM.getBoundingClientRect();
      const relativeX = e.clientX - editorRect.left;
      const relativeY = e.clientY - editorRect.top;

      const posAtCoords = editor.view.posAtCoords({ left: relativeX, top: relativeY });
      const oldPos = dragStartPosRef.current;

      if (posAtCoords && oldPos !== null) {
        const newPos = posAtCoords.pos;

        // Only move if the position actually changed
        if (Math.abs(newPos - oldPos) > 1) {
          const { state, dispatch } = editor.view;
          const tr = state.tr;

          // Get node size
          const $oldPos = state.doc.resolve(oldPos);
          const node = $oldPos.nodeAfter || $oldPos.nodeBefore;

          if (node) {
            const nodeSize = node.nodeSize;

            // Delete node at old position
            if ($oldPos.nodeAfter) {
              tr.delete(oldPos, oldPos + nodeSize);
            } else if ($oldPos.nodeBefore) {
              tr.delete(oldPos - nodeSize, oldPos);
            }

            // Calculate new position after deletion
            let adjustedNewPos = newPos;
            if (newPos > oldPos) {
              adjustedNewPos = newPos - nodeSize;
            }

            // Ensure position is valid
            const $newPos = tr.doc.resolve(adjustedNewPos);
            if ($newPos.parent.canReplaceWith($newPos.index(), $newPos.index(), node.type)) {
              // Insert node at new position
              tr.insert(adjustedNewPos, node);
              dispatch(tr);
            }
          }
        }
      }

      editorDOM.style.cursor = "";
      setIsDragging(false);
      dragStartPosRef.current = null;

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Don't render resize handle during SSR
  if (!isMounted) {
    return (
      <NodeViewWrapper className="image-resizer-wrapper">
        <div
          style={{
            position: "relative",
            display: "inline-block",
            maxWidth: "100%",
          }}
        >
          <img
            ref={imgRef}
            src={node.attrs.src}
            alt={node.attrs.alt || ""}
            style={{
              width: width ? `${width}px` : "auto",
              height: height ? `${height}px` : "auto",
              maxWidth: "100%",
              display: "block",
            }}
          />
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className={`image-resizer-wrapper ${selected ? "selected" : ""}`}>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          maxWidth: "100%",
        }}
      >
        <img
          ref={imgRef}
          src={node.attrs.src}
          alt={node.attrs.alt || ""}
          onMouseDown={handleImageMouseDown}
          draggable={false}
          style={{
            width: width ? `${width}px` : "auto",
            height: height ? `${height}px` : "auto",
            maxWidth: "100%",
            display: "block",
            cursor: selected && !isResizing ? "move" : "pointer",
            userSelect: "none",
            opacity: isDragging ? 0.7 : 1,
          }}
        />
        {selected && isMounted && (
          <div
            ref={resizeHandleRef}
            className="resize-handle"
            onMouseDown={handleResizeMouseDown}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "16px",
              height: "16px",
              backgroundColor: "#3b82f6",
              border: "2px solid white",
              borderRadius: "4px",
              cursor: "nwse-resize",
              zIndex: 10,
            }}
          />
        )}
      </div>
    </NodeViewWrapper>
  );
};

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => {
          const width = element.getAttribute("width");
          return width ? parseInt(width, 10) : null;
        },
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {};
          }
          return {
            width: attributes.width,
          };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const height = element.getAttribute("height");
          return height ? parseInt(height, 10) : null;
        },
        renderHTML: (attributes) => {
          if (!attributes.height) {
            return {};
          }
          return {
            height: attributes.height,
          };
        },
      },
    };
  },

  addNodeView() {
    return ({ editor, node, getPos, decorations, extension }) => {
      // Check if node is selected by comparing editor selection with node position
      const checkSelected = () => {
        if (!editor || typeof getPos !== "function") return false;
        const pos = getPos();
        if (pos === null || pos === undefined) return false;
        const { selection } = editor.state;
        // Check if it's a NodeSelection and if the position matches
        const isNodeSelection =
          selection.constructor.name === "NodeSelection" || (selection as any).node;
        return isNodeSelection && (selection as any).from === pos;
      };

      return new ReactRenderer(ResizableImageComponent, {
        props: {
          node,
          updateAttributes: (attrs: any) => {
            if (typeof getPos === "function") {
              const pos = getPos();
              if (pos !== null && pos !== undefined && editor) {
                editor.chain().focus().setNodeSelection(pos).updateAttributes("image", attrs).run();
              }
            }
          },
          selected: checkSelected(),
          editor,
          getPos,
        },
        editor,
      });
    };
  },
}).configure({
  HTMLAttributes: {
    class: "max-w-full h-auto",
  },
  inline: false,
  allowBase64: true,
});

// Custom extension for variables
const Variable = Node.create({
  name: "variable",

  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      name: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-variable"),
        renderHTML: (attributes) => {
          return {
            "data-variable": attributes.name,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-variable]",
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      {
        ...HTMLAttributes,
        class: "variable-placeholder",
        style:
          "background-color: #fef3c7; padding: 2px 6px; border-radius: 4px; font-weight: 500; color: #92400e;",
      },
      `{{${node.attrs.name}}}`,
    ];
  },

  addCommands() {
    return {};
  },
});

interface DocumentTemplateBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (template: {
    title: string;
    content: any;
    variables: string[];
    sessionId: string;
    type: "before" | "during" | "after";
  }) => void;
  templateData?: any;
  isLoading?: boolean;
  isEditing?: boolean;
  sessionId: string;
  type: "before" | "during" | "after";
  templates?: any[];
}

export default function DocumentTemplateBuilder({
  open,
  onOpenChange,
  onSave,
  templateData,
  isLoading = false,
  isEditing = false,
  sessionId,
  type,
  templates = [],
}: DocumentTemplateBuilderProps) {
  const [title, setTitle] = useState(templateData?.title || "");
  const [showVariableDialog, setShowVariableDialog] = useState(false);
  const [variableName, setVariableName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      TextStyle,
      Color,
      FontFamily.configure({
        types: ["textStyle"],
      }),
      FontSize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Underline,
      Subscript,
      Superscript,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      ResizableImage.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto",
        },
        inline: false,
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse border border-gray-300",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-gray-300 bg-gray-100 p-2",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-300 p-2",
        },
      }),
      HorizontalRule,
      Variable,
    ],
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Start writing your document template here...",
            },
          ],
        },
      ],
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[500px] p-8 bg-white",
      },
    },
  });

  // Update title when templateData changes
  useEffect(() => {
    if (templateData?.data) {
      setTitle(templateData.data.title || "");
    } else {
      setTitle("");
    }
  }, [templateData]);

  // Handle content loading when editor and template data are available
  useEffect(() => {
    if (!editor) return;

    if (open) {
      if (isEditing && templateData?.data) {
        setTitle(templateData.data.title || "");
        try {
          if (templateData.data.content) {
            editor.commands.setContent(templateData.data.content);
          } else {
            editor.commands.clearContent();
          }
        } catch (error) {
          console.error("Failed to load template content:", error);
          editor.commands.clearContent();
        }
      } else if (!isEditing) {
        // Clear for new template
        setTitle("");
        editor.commands.clearContent();
      }
    }
  }, [open, editor, templateData, isEditing]);

  const extractVariables = useCallback((jsonContent: any): string[] => {
    const variables: string[] = [];
    const traverse = (node: any) => {
      if (node.type === "variable" && node.attrs?.name) {
        variables.push(node.attrs.name);
      }
      if (node.content) {
        node.content.forEach(traverse);
      }
    };
    traverse(jsonContent);
    return [...new Set(variables)]; // Remove duplicates
  }, []);

  const handleSave = useCallback(async () => {
    if (editor && title.trim()) {
      try {
        const jsonContent = editor.getJSON();
        const variables = extractVariables(jsonContent);

        toast.success("Document saved successfully");
        onSave({
          title: title.trim(),
          content: jsonContent,
          variables,
          sessionId,
          type,
        });
        onOpenChange(false);
      } catch (error) {
        toast.error("Failed to save document");
        console.error("Save error:", error);
      }
    }
  }, [editor, title, onSave, onOpenChange, sessionId, type, extractVariables]);

  const addImage = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const resizeImage = useCallback((file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      img.onload = () => {
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 200;
        let { width, height } = img;

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = (width * MAX_HEIGHT) / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw the resized image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create new file with original name but resized
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              reject(new Error("Failed to create image blob"));
            }
          },
          file.type,
          0.8 // Quality 80%
        );
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !editor) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setIsUploading(true);

      try {
        // Resize image before upload
        let uploadFile = file;
        if (file.type.startsWith("image/")) {
          uploadFile = await resizeImage(file);
        }

        const formData = new FormData();
        formData.append("image", uploadFile);

        // Get token from cookies
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          throw new Error("No authentication token found");
        }

        // Use XMLHttpRequest to upload the image
        const xhr = new XMLHttpRequest();

        xhr.open("POST", `${process.env.NEXT_PUBLIC_BASE_URL}uploads/image`, true);

        // Set authorization header
        xhr.setRequestHeader("x-connexion-tantor", `Bearer ${decodeURIComponent(token)}`);

        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const result = JSON.parse(xhr.responseText);
              // Access the URL from the data object
              const imageUrl = result.data?.url || result.url;
              if (imageUrl) {
                editor.chain().focus().setImage({ src: imageUrl }).run();
                toast.success("Image uploaded successfully");
              } else {
                toast.error("No image URL in response");
              }
            } catch (parseError) {
              toast.error("Failed to parse upload response");
              console.error("Parse error:", parseError);
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              toast.error(errorData.message || "Failed to upload image");
            } catch {
              toast.error("Failed to upload image");
            }
          }
          setIsUploading(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        };

        xhr.onerror = function () {
          toast.error("Network error occurred during upload");
          setIsUploading(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        };

        xhr.upload.onprogress = function (event) {
          if (event.lengthComputable) {
            // You can add progress tracking here if needed
            console.log(`Upload progress: ${Math.round((event.loaded / event.total) * 100)}%`);
          }
        };

        xhr.send(formData);
      } catch (error) {
        toast.error("Failed to upload image");
        console.error("Upload error:", error);
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [editor, resizeImage]
  );

  const addLink = useCallback(() => {
    const url = window.prompt("Link URL:");
    if (url && editor) {
      if (editor.state.selection.empty) {
        const text = window.prompt("Link text:");
        if (text) {
          editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
        }
      } else {
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
      }
    }
  }, [editor]);

  const addTable = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  }, [editor]);

  const addVariable = useCallback(() => {
    if (variableName.trim() && editor) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "variable",
          attrs: { name: variableName.trim() },
        })
        .run();
      setVariableName("");
      setShowVariableDialog(false);
    }
  }, [editor, variableName]);

  const setColor = useCallback(
    (color: string) => {
      if (editor) {
        editor.chain().focus().setColor(color).run();
      }
    },
    [editor]
  );

  const setHighlight = useCallback(
    (color: string) => {
      if (editor) {
        editor.chain().focus().toggleHighlight({ color }).run();
      }
    },
    [editor]
  );

  if (!open) return null;

  const fontSizes = [
    "8pt",
    "9pt",
    "10pt",
    "11pt",
    "12pt",
    "14pt",
    "16pt",
    "18pt",
    "20pt",
    "24pt",
    "28pt",
    "32pt",
    "36pt",
    "48pt",
    "72pt",
  ];
  const fontFamilies = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Helvetica",
    "Palatino",
    "Garamond",
    "Comic Sans MS",
    "Trebuchet MS",
    "Impact",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded shadow-xl w-full max-w-7xl h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            {isEditing ? "Edit Document Template" : "Create Document Template"}
          </h2>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Title Input */}
          <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="template-title" className="text-sm font-medium">
                Template Title
              </Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full mt-1" />
              ) : (
                <Input
                  id="template-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter template title..."
                  className="mt-1"
                />
              )}
            </div>
          </div>

          {/* Toolbar */}
          <div className="p-3 border-b bg-gray-50 overflow-x-auto">
            {isLoading ? (
              <div className="flex flex-wrap items-center gap-1 min-w-max">
                {Array.from({ length: 15 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-20" />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-1 min-w-max">
                {/* Undo/Redo */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().undo().run()}
                  disabled={!editor?.can().undo()}
                  title="Undo"
                >
                  <Undo className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().redo().run()}
                  disabled={!editor?.can().redo()}
                  title="Redo"
                >
                  <Redo className="w-4 h-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Font Family */}
                <Select
                  onValueChange={(value) => editor?.chain().focus().setFontFamily(value).run()}
                >
                  <SelectTrigger className="w-36 h-8 text-sm">
                    <SelectValue placeholder="Font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Font Size */}
                <Select onValueChange={(value) => editor?.chain().focus().setFontSize(value).run()}>
                  <SelectTrigger className="w-24 h-8 text-sm">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Text Formatting */}
                <Button
                  variant={editor?.isActive("bold") ? "default" : "outline"}
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  variant={editor?.isActive("italic") ? "default" : "outline"}
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  variant={editor?.isActive("underline") ? "default" : "outline"}
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  title="Underline"
                >
                  <UnderlineIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant={editor?.isActive("strike") ? "default" : "outline"}
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleStrike().run()}
                  title="Strikethrough"
                >
                  <StrikeIcon className="w-4 h-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Text Color */}
                <div className="flex items-center gap-1">
                  <input
                    type="color"
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border"
                    title="Text Color"
                  />
                  <input
                    type="color"
                    onChange={(e) => setHighlight(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border"
                    title="Highlight Color"
                  />
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Subscript/Superscript */}
                <Button
                  variant={editor?.isActive("subscript") ? "default" : "outline"}
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleSubscript().run()}
                  title="Subscript"
                >
                  <SubscriptIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant={editor?.isActive("superscript") ? "default" : "outline"}
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleSuperscript().run()}
                  title="Superscript"
                >
                  <SuperscriptIcon className="w-4 h-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Headings */}
                <Select
                  onValueChange={(value) => {
                    if (value === "0") {
                      editor?.chain().focus().setParagraph().run();
                    } else {
                      editor
                        ?.chain()
                        .focus()
                        .toggleHeading({ level: parseInt(value) as any })
                        .run();
                    }
                  }}
                >
                  <SelectTrigger className="w-28 h-8 text-sm">
                    <SelectValue placeholder="Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Normal</SelectItem>
                    <SelectItem value="1">Heading 1</SelectItem>
                    <SelectItem value="2">Heading 2</SelectItem>
                    <SelectItem value="3">Heading 3</SelectItem>
                    <SelectItem value="4">Heading 4</SelectItem>
                    <SelectItem value="5">Heading 5</SelectItem>
                    <SelectItem value="6">Heading 6</SelectItem>
                  </SelectContent>
                </Select>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Alignment */}
                <Button
                  variant={editor?.isActive({ textAlign: "left" }) ? "default" : "outline"}
                  size="sm"
                  onClick={() => editor?.chain().focus().setTextAlign("left").run()}
                  title="Align Left"
                >
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant={editor?.isActive({ textAlign: "center" }) ? "default" : "outline"}
                  size="sm"
                  onClick={() => editor?.chain().focus().setTextAlign("center").run()}
                  title="Align Center"
                >
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button
                  variant={editor?.isActive({ textAlign: "right" }) ? "default" : "outline"}
                  size="sm"
                  onClick={() => editor?.chain().focus().setTextAlign("right").run()}
                  title="Align Right"
                >
                  <AlignRight className="w-4 h-4" />
                </Button>
                <Button
                  variant={editor?.isActive({ textAlign: "justify" }) ? "default" : "outline"}
                  size="sm"
                  onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
                  title="Justify"
                >
                  <AlignJustify className="w-4 h-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Lists */}
                <Button
                  variant={editor?.isActive("bulletList") ? "default" : "outline"}
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={editor?.isActive("orderedList") ? "default" : "outline"}
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Insert Elements */}
                <Button variant="outline" size="sm" onClick={addLink} title="Insert Link">
                  <Link2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addImage}
                  title="Insert Image"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />
                <Button variant="outline" size="sm" onClick={addTable} title="Insert Table">
                  <TableIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                  title="Insert Horizontal Rule"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVariableDialog(true)}
                  title="Insert Variable"
                  className="bg-yellow-50 hover:bg-yellow-100"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Variable
                </Button>
              </div>
            )}
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-auto bg-gray-100 p-4">
            <div className="max-w-4xl mx-auto bg-white shadow-sm rounded">
              {isLoading ? (
                <div className="min-h-[500px] p-8 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="pt-8">
                    <Skeleton className="h-6 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ) : (
                <EditorContent editor={editor} />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Use <span className="font-mono bg-gray-200 px-1 rounded">{"{{variableName}}"}</span> for
            dynamic content
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim() || isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isLoading ? "Loading..." : "Save Template"}
            </Button>
          </div>
        </div>
      </div>

      {/* Variable Dialog */}
      {showVariableDialog && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Insert Variable</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="variable-name">Variable Name</Label>
                <Input
                  id="variable-name"
                  value={variableName}
                  onChange={(e) => setVariableName(e.target.value)}
                  placeholder="e.g., customerName, date, amount"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addVariable();
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will appear as {variableName ? `{{${variableName}}}` : "{{variableName}}"} in
                  the document
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowVariableDialog(false);
                    setVariableName("");
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={addVariable} disabled={!variableName.trim()}>
                  Insert Variable
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
