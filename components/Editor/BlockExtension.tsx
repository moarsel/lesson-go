import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import Block from "./Block";

export default Node.create({
  name: "reactComponent",
  draggable: true,
  group: "block",
  content: "(paragraph|list?)+",

  parseHTML() {
    return [
      {
        tag: "block-component",
      },
    ];
  },

  addKeyboardShortcuts() {
    return {
      "Mod-/": () => {
        return this.editor
          .chain()
          .insertContentAt(this.editor.state.selection.head, {
            type: this.type.name,
            attrs: { title: "Notes" },
          })
          .focus()
          .run();
      },
    };
  },

  addAttributes() {
    // Return an object with attribute configuration
    return {
      title: {
        default: "Notes",
      },
      prompt: {
        default: "Hi",
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ["block-component", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Block);
  },
});
