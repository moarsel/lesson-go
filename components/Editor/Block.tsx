import { NodeViewContent, NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import React from "react";
import {} from "marked";
import { MdDragIndicator, MdBolt } from "react-icons/md";
import { generateFromPrompt } from "../../pages/lessons/new";
export type BlockProps = {
  title: string;
};
export default (props: NodeViewProps) => {
  const title = props.node.attrs.title;
  const prompt = props.node.attrs.prompt;
  console.log(prompt);

  const handleClickSuggest = async () => {
    props.editor
      .chain()
      .deleteRange({
        from: props.getPos() + 1,
        to: props.getPos() + props.node.nodeSize - 1,
      })
      .insertContentAt(props.getPos() + 1, " ")
      .run();

    // document.execCommand('insertText', false, "## OK!")
    //  props.view.pasteText(chunkValue);

    try {
      const data = await generateFromPrompt(prompt);
      if (data) {
        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value);

          props.editor.commands.insertContent(chunkValue);

          // const cursor = document.createElement('span')
          // cursor.classList.add('collaboration-cursor__caret')
          // cursor.setAttribute('style', `border-color: #00aa00`)

          // const label = document.createElement('div')

          // label.classList.add('collaboration-cursor__label')
          // label.setAttribute('style', `background-color: #00aa00`)
          // label.insertBefore(document.createTextNode('hi'), null)
          // cursor.insertBefore(label, null)

          // return cursor
          // props.editor.chain().command((props) => {
          //   props.view.dispatchEvent(
          //     new KeyboardEvent("keydown", { key: chunkValue, bubbles: true })
          //   );

          //   return true;
          // });
        }
      }
    } catch (e) {
      console.warn(e);
    }
  };
  return (
    <NodeViewWrapper className="w-full pb-6">
      <div
        className="flex flex-row items-center gap-2 text-xl font-medium cursor-move hover:bg-slate-50"
        data-drag-handle
      >
        <MdDragIndicator className="w-4" />
        <p className="label" contentEditable={false}>
          {title}
        </p>
        <button
          aria-label="Suggest"
          onClick={handleClickSuggest}
          className="p-3 ml-auto rounded-full bg-slate-100 hover:bg-slate-200"
        >
          <MdBolt />{" "}
        </button>
      </div>

      <NodeViewContent className="px-6" />
    </NodeViewWrapper>
  );
};
