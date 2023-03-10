import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Table from "@tiptap/extension-table";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";

import React, { useEffect } from "react";
import { marked } from "marked";

type EditorProps = {
  content: string;
  readOnly?: boolean;
  onChange?: (content: any) => void;
};

export default ({ content, readOnly = false, onChange }: EditorProps) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "prose-sm sm:prose prose-headings:mb-1",
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

  return <EditorContent editor={editor} />;
};
