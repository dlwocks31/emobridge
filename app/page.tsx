"use client";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { P, match } from "ts-pattern";
import Editor, { MyBlockSchema } from "../components/Editor";
export const dynamic = "force-dynamic";
const emojis = ["👍", "🤔", "🌟"]; // Your emoji list

export default function Index() {
  const supabase = createClientComponentClient();
  const [channel] = useState<RealtimeChannel>(() =>
    supabase.channel("realtime:test"),
  );
  const [selectedEmoji, setSelectedEmoji] = useState(""); // New state variable for the selected emoji
  const [textCursorBlockId, setTextCursorBlockId] = useState<string | null>(
    null,
  );
  const [emojiBlockId, setEmojiBlockId] = useState<string | null>();

  const [editor, setEditor] = useState<BlockNoteEditor<MyBlockSchema> | null>(
    null,
  );

  const handleEditorReady = (editor: BlockNoteEditor<MyBlockSchema> | null) => {
    console.log("handleEditorReady");
    setEditor(editor);
  };

  useEffect(() => {
    channel
      .on("broadcast", { event: "emoji" }, (payload) => {
        match(payload)
          .with({ event: "emoji", payload: { emoji: P.string } }, (payload) => {
            console.log("broadcast", payload);
            setSelectedEmoji(payload.payload.emoji);
          })
          .otherwise(() => console.log("otherwise"));
      })
      .subscribe();
  }, []);

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
    setSelectedEmoji(emoji); // update the selectedEmoji when an emoji is clicked
    setEmojiBlockId(textCursorBlockId);
    if (textCursorBlockId) {
      const block = editor?.getBlock(textCursorBlockId);
      if (block) {
        const blocksToInsert: PartialBlock<MyBlockSchema>[] = [
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
            selectedEmoji={selectedEmoji}
            onEditorReady={handleEditorReady}
            setTextCursorBlockId={setTextCursorBlockId}
          />
        </div>
        <div className="mt-4">Received emoji: {selectedEmoji}</div>{" "}
        <div>textCursorBlockId: {textCursorBlockId}</div>
        <div>emojiBlockId: {emojiBlockId}</div>
      </div>
    </>
  );
}
