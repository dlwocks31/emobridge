"use client";
import { BlockNoteEditor, Editor, PartialBlock } from "@/components/Editor";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
const emojis = ["👍", "🤔", "🌟", "👎"]; // Your emoji list

export default function Feedbacker() {
  const supabase = createClientComponentClient();
  const [textCursorPosition, setTextCursorPosition] = useState<{
    blockId: string | null;
    nextBlockId: string | null;
    prevBlockId: string | null;
  }>({
    blockId: null,
    nextBlockId: null,
    prevBlockId: null,
  });

  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);

  const handleEditorReady = (editor: BlockNoteEditor | null) => {
    console.log("handleEditorReady");
    setEditor(editor);
  };

  const handleEmojiClick = (emoji: string) => {
    if (textCursorPosition.blockId) {
      const block = editor?.getBlock(textCursorPosition.blockId);
      const prevBlock = textCursorPosition?.prevBlockId
        ? editor?.getBlock(textCursorPosition.prevBlockId)
        : null;

      if (prevBlock?.type === "emoji") {
        const mergeString = (initial: string, next: string) => {
          const initialLength = Array.from(initial).length;
          if (initial.includes(next) || initialLength >= 3) {
            return initial;
          }
          return initial + next;
        };
        editor?.updateBlock(prevBlock, {
          type: "emoji",
          props: {
            emoji: mergeString(prevBlock.props.emoji, emoji),
          },
        });
        return;
      } else if (block) {
        const blocksToInsert: PartialBlock[] = [
          {
            type: "emoji",
            props: {
              emoji,
            },
          },
        ];
        editor?.insertBlocks(blocksToInsert, block.id);
      }
    }
  };

  const [editable, setEditable] = useState(false);

  return (
    <>
      <div className="w-full">
        <div className="flex justify-center">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleEmojiClick(emoji)}
              className="emoji-button mx-2 rounded-lg p-2 shadow-md"
              style={{ fontSize: "1.5em" }}
            >
              {emoji}
            </button>
          ))}
        </div>
        <div className="flex justify-center items-center mt-2">
          <input
            type="checkbox"
            id="checkbox"
            checked={editable}
            onChange={() => setEditable(!editable)}
            className="h-5 w-5 mr-2"
          />
          <label htmlFor="checkbox">편집 활성화</label>
        </div>
        <div className="p-28">
          <Editor
            editable={editable}
            onEditorReady={handleEditorReady}
            onTextCursorPositionChange={setTextCursorPosition}
          />
        </div>
      </div>
    </>
  );
}
