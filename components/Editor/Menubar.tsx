import type { Editor } from "@tiptap/react";
import clsx from "clsx";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdHorizontalSplit,
  MdRedo,
  MdUndo,
} from "react-icons/md";

type Props = {
  editor: Editor | null;
};

const Menubar = ({ editor }: Props) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-row gap-2 mb-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={clsx(
          "p-1 text-2xl disabled:opacity-30",
          editor.isActive("bold") ? "rounded-sm bg-neutral-300 shadow" : ""
        )}
        aria-label="bold"
      >
        <MdFormatBold />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={clsx(
          "p-1 text-2xl disabled:opacity-30",
          editor.isActive("italic") ? "rounded-sm bg-neutral-300 shadow" : ""
        )}
        aria-label="italic"
      >
        <MdFormatItalic />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={clsx(
          "p-1 text-xl font-medium",
          editor.isActive("heading", { level: 1 })
            ? "rounded-sm bg-neutral-300 shadow"
            : ""
        )}
      >
        h1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={clsx(
          "p-1 text-xl font-medium",
          editor.isActive("heading", { level: 2 })
            ? "rounded-sm bg-neutral-300 shadow"
            : ""
        )}
      >
        h2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={clsx(
          "p-1 text-xl font-medium",
          editor.isActive("heading", { level: 3 })
            ? "rounded-sm bg-neutral-300 shadow"
            : ""
        )}
      >
        h3
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={clsx(
          "p-1 text-2xl",
          editor.isActive("bulletList")
            ? "rounded-sm bg-neutral-300 shadow"
            : ""
        )}
        aria-label="list"
      >
        <MdFormatListBulleted />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={clsx(
          "p-1 text-2xl",
          editor.isActive("orderedList")
            ? "rounded-sm bg-neutral-300 shadow"
            : ""
        )}
        aria-label="ordered list"
      >
        <MdFormatListNumbered />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={clsx(
          "p-1 text-2xl",
          editor.isActive("blockquote")
            ? "rounded-sm bg-neutral-300 shadow"
            : ""
        )}
        aria-label="blockquote"
      >
        <MdFormatQuote />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        aria-label="horizontal rule"
        className={clsx("p-1 text-2xl")}
      >
        <MdHorizontalSplit />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        aria-label="undo"
        className={clsx("p-1 text-2xl disabled:opacity-30")}
      >
        <MdUndo />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        aria-label="redo"
        className={clsx("p-1 text-2xl disabled:opacity-30")}
      >
        <MdRedo />
      </button>
    </div>
  );
};
export default Menubar;
