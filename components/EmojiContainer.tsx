import { BlockNoteEditor, Editor, PartialBlock } from "@/components/Editor";
import { EmojiType } from "next/dist/compiled/@vercel/og/emoji";
import { Emoji } from "./Emoji"
const emojis = ["👍", "🤔", "🌟", "👎"]; // Your emoji list

export const EmojiContainer = ({
  editor,
}: {
  editor: BlockNoteEditor;
}) => {
  const handleEmojiClick = (emoji: string) => {
    const textCursorPosition = editor.getTextCursorPosition();
    if (textCursorPosition.block.id) {
      const block = editor?.getBlock(textCursorPosition.block.id);
      const prevBlock = textCursorPosition?.prevBlock?.id
        ? editor?.getBlock(textCursorPosition.prevBlock?.id)
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

  return <div className="">
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
}