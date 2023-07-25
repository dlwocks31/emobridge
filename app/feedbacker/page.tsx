"use client";
import { BlockNoteEditor, Editor, PartialBlock } from "@/components/Editor";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useState } from "react";
const emojis = ["👍", "🤔", "🌟"]; // Your emoji list

export default function Feedbacker() {
  const supabase = createClientComponentClient();
  const [channel] = useState<RealtimeChannel>(() =>
    supabase.channel("realtime:test"),
  );
  const [textCursorBlockId, setTextCursorBlockId] = useState<string | null>(
    null,
  );

  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);

  const handleEditorReady = (editor: BlockNoteEditor | null) => {
    console.log("handleEditorReady");
    setEditor(editor);
  };

  const handleEmojiClick = (emoji: string) => {
    channel
      .send({
        type: "broadcast",
        event: "emoji",
        payload: {
          emoji,
        },
      })
      .catch(console.error);
    console.log(`You clicked on ${emoji}`);
    if (textCursorBlockId) {
      const block = editor?.getBlock(textCursorBlockId);
      if (block) {
        const blocksToInsert: PartialBlock[] = [
          {
            type: "emoji",
            props: {
              emoji,
            },
          },
        ];
        editor?.insertBlocks(blocksToInsert, textCursorBlockId);
      }
    }
  };

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
        <div className="p-12">
          <Editor
            onEditorReady={handleEditorReady}
            setTextCursorBlockId={setTextCursorBlockId}
          />
        </div>
      </div>
    </>
  );
}