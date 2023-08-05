"use client";
import { useContext } from "react";
import { GlobalContext } from "../app/providers"
import { BlockNoteEditor, PartialBlock } from "@/components/Editor";
import Image from "next/image";
// const emojis = ["👍", "🤔", "🌟", "👎"]; // Your emoji list
const emojiList = [
  {
    url: "/important.png",
  },
  {
    url: "/fix.png",
  },
  {
    url: "/more.png",
  },
  {
    url: "/ppt.png",
  },
  {
    url: "/curious.png",
  },
  {
    url: "/enough.png",
  },
  {
    url: "/easy.png",
  },
  {
    url: "/hard.png",
  },
];
const RowInfo = [
  { start: 0, end: 3 },
  { start: 3, end: 6 },
  { start: 6, end: 8 },
];

export const EmojiContainer = ({ editor }: { editor: BlockNoteEditor }) => {
  const { emojiContainerOpened, setEmojiContainerOpened } = useContext(GlobalContext);
  const handleEmojiClick = (emoji: string) => {
    const textCursorPosition = editor.getTextCursorPosition();
    if (textCursorPosition.block.id) {
      const block = editor?.getBlock(textCursorPosition.block.id);
      const prevBlock = textCursorPosition?.prevBlock?.id
        ? editor?.getBlock(textCursorPosition.prevBlock?.id)
        : null;

      if (prevBlock?.type === "emoji") {
        const mergeString = (initial: string, next: string) => {
          const initialLength = initial.split(',').length;
          if (initial.includes(next) || initialLength >= 3) {
            return initial;
          }
          return initial + ',' + next;
        };
        editor?.updateBlock(prevBlock, {
          type: "emoji",
          props: {
            emoji: mergeString(prevBlock.props.emoji, emoji),
          },
        });
        if (block) {
          editor?.updateBlock(block, {
            props: { backgroundColor: "gray" },
          });
        }
        return;
      } else if (block) {
        const blocksToInsert: PartialBlock[] = [
          {
            type: "emoji",
            props: {
              emoji,
              textBlockId: block.id,
            },
          },
        ];
        editor?.insertBlocks(blocksToInsert, block.id);
        editor?.updateBlock(block, {
          props: { backgroundColor: "gray" },
        });
      }
    }
  };

  return (
    <div className="">
      {emojiContainerOpened ?
        <div className="w-40 h-100 bg-gray-100">
          <div>필기 이모지</div>
          {RowInfo.map((row, index) => (
            <div className="flex">
              {emojiList.slice(row.start, row.end).map((emoji, index) => (
                <Image
                  src={emoji.url}
                  alt="me"
                  width="50"
                  height="50"
                  onClick={() => {
                    console.log(emoji.url);
                    handleEmojiClick(emoji.url)
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        : null}

    </div>
  );
};
