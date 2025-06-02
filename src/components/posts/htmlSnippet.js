import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

const HTMLSnippetComponent = ({ node }) => {
  const html = node.attrs.content || "";

  return (
    <NodeViewWrapper
      as="div"
      className="html-snippet"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const HTMLSnippet = Node.create({
  name: "htmlSnippet",

  group: "block",

  atom: true,

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

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-html-snippet": "true" }),
      // 0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HTMLSnippetComponent);
  },
});