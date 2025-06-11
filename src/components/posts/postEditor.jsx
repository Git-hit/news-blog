import { Node, mergeAttributes } from "@tiptap/core";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  useEditor,
  EditorContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
// import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { TextSelection } from "prosemirror-state";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  Image as ImageIcon,
  Eraser,
  UnderlineIcon,
  Heading3,
  Heading4,
} from "lucide-react";
import { useRef, useState } from "react";
import { HTMLSnippet } from "./htmlSnippet";

const MIN_SIZE = 50;

const ResizableImageComponent = ({ node, updateAttributes }) => {
  const { src, width = 300, height = 200, alt = "" } = node.attrs;
  // Ensure width/height are numbers (in px)
  const initialWidth = typeof width === "string" ? parseInt(width, 10) : width;
  const initialHeight =
    typeof height === "string" ? parseInt(height, 10) : height;

  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight,
  });
  const [showAltDialog, setShowAltDialog] = useState(false);
  const [altText, setAltText] = useState(alt);
  const [dialogPosition, setDialogPosition] = useState({ top: 0, left: 0 });
  const dragging = useRef(null);

  const startDrag = (e, direction) => {
    e.preventDefault();
    dragging.current = {
      direction,
      startX: e.clientX,
      startY: e.clientY,
      ...dimensions,
    };
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);
  };

  const onDrag = (e) => {
    if (!dragging.current) return;

    const { direction, startX, startY, width, height } = dragging.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let newWidth = width;
    let newHeight = height;

    // Handle horizontal resizing
    if (direction.includes("right")) {
      newWidth = Math.max(MIN_SIZE, width + dx);
    }
    if (direction.includes("left")) {
      newWidth = Math.max(MIN_SIZE, width - dx);
    }

    // Handle vertical resizing
    if (direction.includes("bottom")) {
      newHeight = Math.max(MIN_SIZE, height + dy);
    }
    if (direction.includes("top")) {
      newHeight = Math.max(MIN_SIZE, height - dy);
    }

    setDimensions({ width: newWidth, height: newHeight });
    updateAttributes({ width: newWidth + "px", height: newHeight + "px" });
  };

  const stopDrag = () => {
    dragging.current = null;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", stopDrag);
  };

  const handleClickImage = (e) => {
    const rect = e.target.getBoundingClientRect();
    const editorRect = e.target.closest(".ProseMirror").getBoundingClientRect(); // Assuming '.ProseMirror' is your editor's class

    // Adjust position relative to the editor's content area
    setDialogPosition({
      top: rect.top - editorRect.top + rect.height + -100, // 10px below the image
      left: rect.left - editorRect.left, // Align with left of the image
    });

    setShowAltDialog(true);
  };

  const handleAltChange = (e) => setAltText(e.target.value);

  const handleAltSubmit = () => {
    updateAttributes({ alt: altText });
    setShowAltDialog(false);
  };

  return (
    <NodeViewWrapper
      style={{
        position: "relative",
        width: dimensions.width + "px",
        height: dimensions.height + "px",
        userSelect: "none",
      }}
    >
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        style={{ width: "100%", height: "100%", display: "block" }}
        draggable={false}
        onClick={handleClickImage}
      />

      {/* Alt text dialog */}
      {showAltDialog && (
        <div
          className="absolute bg-white p-4 shadow-lg rounded"
          style={{
            top: dialogPosition.top + "px",
            left: dialogPosition.left + "px",
            zIndex: 999,
            width: "400px",
          }}
        >
          <div className="text-sm font-medium">Set Alt Text</div>
          <input
            type="text"
            value={altText}
            onChange={handleAltChange}
            className="w-full border p-2 my-2 rounded"
            placeholder="Enter alt text"
          />
          <button
            onClick={handleAltSubmit}
            className="w-full p-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      )}

      {/* Resize handles */}
      {/* Right */}
      <div
        onMouseDown={(e) => startDrag(e, "right")}
        style={handleStyle("right", "center")}
      />

      {/* Left */}
      <div
        onMouseDown={(e) => startDrag(e, "left")}
        style={handleStyle("left", "center")}
      />

      {/* Top */}
      <div
        onMouseDown={(e) => startDrag(e, "top")}
        style={handleStyle("center", "top")}
      />

      {/* Bottom */}
      <div
        onMouseDown={(e) => startDrag(e, "bottom")}
        style={handleStyle("center", "bottom")}
      />

      {/* Top-left corner */}
      <div
        onMouseDown={(e) => startDrag(e, "top-left")}
        style={cornerHandleStyle("left", "top")}
      />

      {/* Top-right corner */}
      <div
        onMouseDown={(e) => startDrag(e, "top-right")}
        style={cornerHandleStyle("right", "top")}
      />

      {/* Bottom-left corner */}
      <div
        onMouseDown={(e) => startDrag(e, "bottom-left")}
        style={cornerHandleStyle("left", "bottom")}
      />

      {/* Bottom-right corner */}
      <div
        onMouseDown={(e) => startDrag(e, "bottom-right")}
        style={cornerHandleStyle("right", "bottom")}
      />
    </NodeViewWrapper>
  );
};

// Styles for side handles (thin rectangles)
const handleStyle = (horizontal, vertical) => {
  const style = {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 10,
  };

  if (horizontal === "left" || horizontal === "right") {
    style[horizontal] = 0;
    style.top = 0;
    style.height = "100%";
    style.width = 8;
    style.cursor = "ew-resize";
  } else if (vertical === "top" || vertical === "bottom") {
    style[vertical] = 0;
    style.left = 0;
    style.width = "100%";
    style.height = 8;
    style.cursor = "ns-resize";
  }

  return style;
};

// Styles for corner handles (small squares)
const cornerHandleStyle = (horizontal, vertical) => ({
  position: "absolute",
  width: 12,
  height: 12,
  backgroundColor: "rgba(0,0,0,0.4)",
  zIndex: 20,
  cursor: `${vertical === "top" ? "n" : "s"}${
    horizontal === "left" ? "w" : "e"
  }-resize`,
  [horizontal]: 0,
  [vertical]: 0,
});

export const ResizableImage = Node.create({
  name: "resizableImage",

  group: "inline",

  inline: true,

  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: 300 },
      height: { default: 200 },
      alt: { default: null },
      "referrer-policy": { default: "no-referrer" }
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[src]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});

const MenuBar = ({
  editor,
  onShowLinkModal,
  onShowImageModal,
  onShowHtmlModal,
}) => {
  if (!editor) return null;

  const btnClass =
    "p-2 border border-white text-gray-700 hover:text-blue-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded";
  const activeClass = "text-blue-600 !border-blue-600 bg-blue-50";

  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-200 px-4 py-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`${btnClass} ${editor.isActive("bold") ? activeClass : ""}`}
        type="button"
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${btnClass} ${
          editor.isActive("italic") ? activeClass : ""
        }`}
        type="button"
      >
        <Italic size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`${btnClass} ${
          editor.isActive("underline") ? activeClass : ""
        }`}
        type="button"
      >
        <UnderlineIcon size={18} /> {/* Import a proper icon for underline */}
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`${btnClass} ${
          editor.isActive("strike") ? activeClass : ""
        }`}
        type="button"
      >
        <Strikethrough size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${btnClass} ${
          editor.isActive("heading", { level: 1 }) ? activeClass : ""
        }`}
        type="button"
      >
        <Heading1 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${btnClass} ${
          editor.isActive("heading", { level: 2 }) ? activeClass : ""
        }`}
        type="button"
      >
        <Heading2 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${btnClass} ${
          editor.isActive("heading", { level: 3 }) ? activeClass : ""
        }`}
        type="button"
      >
        <Heading3 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`${btnClass} ${
          editor.isActive("heading", { level: 4 }) ? activeClass : ""
        }`}
        type="button"
      >
        <Heading4 size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${btnClass} ${
          editor.isActive("bulletList") ? activeClass : ""
        }`}
        type="button"
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${btnClass} ${
          editor.isActive("orderedList") ? activeClass : ""
        }`}
        type="button"
      >
        <ListOrdered size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`${btnClass} ${
          editor.isActive("paragraph", { textAlign: "left" }) ? activeClass : ""
        }`}
        type="button"
      >
        <AlignLeft size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`${btnClass} ${
          editor.isActive("paragraph", { textAlign: "center" })
            ? activeClass
            : ""
        }`}
        type="button"
      >
        <AlignCenter size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`${btnClass} ${
          editor.isActive("paragraph", { textAlign: "right" })
            ? activeClass
            : ""
        }`}
        type="button"
      >
        <AlignRight size={18} />
      </button>

      <button
        onClick={onShowLinkModal}
        className={`${btnClass} ${editor.isActive("link") ? activeClass : ""}`}
        type="button"
      >
        <Link2 size={18} />
      </button>
      <button onClick={onShowImageModal} className={btnClass} type="button">
        <ImageIcon size={18} />
      </button>
      <button onClick={onShowHtmlModal} className={btnClass} type="button">
        Embed HTML
      </button>
      <button
        onClick={() =>
          editor.chain().focus().unsetAllMarks().clearNodes().run()
        }
        className={btnClass}
        type="button"
      >
        <Eraser size={18} />
      </button>
    </div>
  );
};

export default function PostEditor({
  title,
  onTitleChange,
  content,
  onChange,
}) {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [showHtmlModal, setShowHtmlModal] = useState(false);
  const [customHtml, setCustomHtml] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Underline,
      Link.configure({
        openOnClick: true, // or your config
        autolink: true,
        linkOnPaste: true,
      }),
      ResizableImage,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      HTMLSnippet,
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "flex-1 min-h-[350px] max-w-none focus:outline-none text-gray-900",
      },
    },
  });

  const insertImage = (src) => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: "resizableImage",
        attrs: { src },
      })
      .run();
    setShowImageModal(false);
    setImageUrl("");
  };

  const insertCustomHtml = () => {
    editor
      ?.chain()
      .focus()
      .insertContent({
        type: "htmlSnippet",
        attrs: { content: customHtml }
      })
      .run();
    // editor.commands.insertContentAt(editor.state.selection.anchor, customHtml);
    setShowHtmlModal(false);
    setCustomHtml("");
  };

  const isLinkActive = editor?.isActive("link");

  const setLink = (url) => {
    const { state, view, schema } = editor;
    const { selection, tr } = state;
    const { from, to } = selection;
    const isTextSelected = !selection.empty;

    // Ensure URL has protocol
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    if (isTextSelected) {
      // Apply link to selection
      editor.chain().focus().setLink({ href: url }).run();

      // ✅ Move cursor to end of selection, outside the link
      const endPos = to;
      const newSelection = TextSelection.create(view.state.doc, endPos);
      view.dispatch(view.state.tr.setSelection(newSelection));
      view.focus();
    } else {
      // Insert "Link" text and apply link mark
      const linkText = "Link";
      const linkMark = schema.marks.link.create({ href: url });
      const insertFrom = selection.from;
      const insertTo = insertFrom + linkText.length;

      let transaction = tr.insertText(linkText, insertFrom);
      transaction = transaction.addMark(insertFrom, insertTo, linkMark);

      // ✅ Set selection right after the inserted link
      transaction = transaction.setSelection(
        TextSelection.create(transaction.doc, insertTo)
      );

      view.dispatch(transaction);
      view.focus();
    }

    setShowLinkModal(false);
    setLinkUrl("");
  };

  return (
    <div className="border rounded shadow-md w-full max-w-4xl mx-auto bg-white">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Title..."
        className="w-full text-2xl font-semibold px-4 py-3 border-b outline-none text-gray-900 placeholder-gray-400"
      />
      <MenuBar
        editor={editor}
        onShowLinkModal={() => {
          if (isLinkActive) {
            editor.chain().focus().unsetLink().run();
          } else {
            setShowLinkModal(true);
          }
        }}
        onShowImageModal={() => setShowImageModal(true)}
        onShowHtmlModal={() => setShowHtmlModal(true)}
      />
      <div className="px-4 py-6 min-h-[440px] max-h-[440px] overflow-y-auto h-full border-t border-gray-200 prose prose-base max-w-none">
        <EditorContent editor={editor} />
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 text-slate-900 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-2">Insert Link</h2>
            <input
              type="url"
              className="w-full border px-3 py-2 mb-4"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              autoFocus
            />
            <div className="flex justify-between items-center">
              <button
                onClick={() => setLink(linkUrl)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
                type="button"
              >
                Done
              </button>
              <button
                onClick={() => {
                  setShowLinkModal(false);
                  setLinkUrl("");
                }}
                className="text-sm text-red-500"
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 text-slate-900 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4">
            <h2 className="text-lg font-semibold">Insert Image</h2>

            <div className="space-y-2">
              <label className="block text-sm font-medium">From URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full border px-3 py-2"
                placeholder="https://example.com/image.png"
              />
              <button
                onClick={() => insertImage(imageUrl)}
                disabled={!imageUrl}
                className="bg-blue-600 disabled:bg-blue-300 text-white px-3 py-1 rounded"
                type="button"
              >
                Insert
              </button>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium">
                Or Upload from Device
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      insertImage(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>

            <button
              onClick={() => setShowImageModal(false)}
              className="text-sm text-red-500"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* HTML Snippet Model */}
      {showHtmlModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-md w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-2">Insert Custom HTML</h2>
            <textarea
              className="w-full border p-2 rounded h-40"
              value={customHtml}
              onChange={(e) => setCustomHtml(e.target.value)}
              placeholder='<iframe src="..." />'
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowHtmlModal(false)}
                className="px-3 py-1 rounded bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertCustomHtml}
                className="px-3 py-1 rounded bg-blue-600 text-white"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}