import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Table from "@tiptap/extension-table";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";

import React, { useEffect, useId } from "react";
import { marked } from "marked";
import Menubar from "./Menubar";

type EditorProps = {
  content: string;
  className?: string;
  readOnly?: boolean;
  onChange?: (content: any) => void;
};

export default ({
  content,
  className = "",
  readOnly = false,
  onChange,
}: EditorProps) => {
  const id = useId();
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: `prose p-4 ${className}`,
      },
    },
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
      }),
      TableHeader,
      TableRow,
      TableCell,
    ],
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getJSON());
    },
    editable: !readOnly,
    content: content,
  });

  useEffect(() => {
    if (typeof content === "string") {
      const parsed = marked.parse(content);
      editor?.commands.setContent(parsed);
    }
  }, [editor, content]);

  return (
    <div className="relative">
      {!readOnly && (
        <>
          <div className="absolute">
            <a
              href={`#${id}`}
              className="hover:bg-grey-lightest focus:bg-grey-lightest focus:shadow-outline sr-only flex select-none justify-center rounded-md border border-transparent bg-white !px-4 !py-2 leading-tight text-black no-underline focus:not-sr-only"
            >
              Skip formatting toolbar
            </a>
          </div>
          <Menubar editor={editor} />
        </>
      )}
      <EditorContent editor={editor} id={id} />
    </div>
  );
};
