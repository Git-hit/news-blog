import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { decode } from "he";
import { useEffect, useRef } from "react";

const HTMLSnippetComponent = ({ node }) => {
  const containerRef = useRef(null);
  // const html = node.attrs.content || "";
  const html = decode(node.attrs.content || "");
  const scriptLoadedRef = useRef(false);

  // useEffect(() => {
  //   // Try to run Twitter embed script if it's available
  //   if (window.twttr?.widgets && typeof window.twttr.widgets.load === "function") {
  //     window.twttr.widgets.load(containerRef.current);
  //   }
  // }, [html]);

  useEffect(() => {
    // Only load once
    if (!scriptLoadedRef.current && window.twttr?.widgets?.load) {
      window.twttr.widgets.load(containerRef.current);
      scriptLoadedRef.current = true;
    }
  }, []);

  return (
    <NodeViewWrapper
      as="div"
      ref={containerRef}
      className="html-snippet"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const HTMLSnippet = Node.create({
  name: "htmlSnippet",

  group: "block",

  atom: true,

  // selectable: false, // optional: tweak this depending on UX needs
  draggable: false,  // optional: allow dragging

  addAttributes() {
    return {
      content: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-html-snippet]",
      },
    ];
  },

  // renderHTML({ node, HTMLAttributes }) {
  //   return [
  //     "div",
  //     mergeAttributes(HTMLAttributes, { "data-html-snippet": "true" }),
  //     // node.attrs.content,
  //     // 0,
  //   ];
  // },

  renderHTML({ node }) {
    return [
      "div",
      { "data-html-snippet": "true", content: node.attrs.content },
    ];
  },

  // renderHTML({ node }) {
  //   const wrapper = document.createElement("div");
  //   wrapper.setAttribute("data-html-snippet", "true");

  //   // Inject raw HTML directly
  //   wrapper.innerHTML = node.attrs.content;

  //   return wrapper;
  // },

  addNodeView() {
    return ReactNodeViewRenderer(HTMLSnippetComponent);
  },
});