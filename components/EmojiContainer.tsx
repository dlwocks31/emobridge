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
const titleList = [
  {
    title: "중요해요",
  },
  {
    title: "고쳐주세요",
  },
  {
    title: "더 자세하게\n써주세요",
  },
  {
    title: "PPT대로\n써주세요",
  },
  {
    title: "궁금해요",
  },
  {
    title: "충분해요",
  },
  {
    title: "쉬워요",
  },
  {
    title: "어려워요",
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
    <div className="fixed z-50 pr-28">
      {emojiContainerOpened ?
        <div className="h-100 rounded-3xl bg-white/30 p-4 border-black border-opacity-10 shadow-xl ring-2 ring-gray-200 bg-opacity-30 backdrop-filter backdrop-blur">
          <div>필기 이모지</div>
          {RowInfo.map((row, index) => (
            <div className="flex">
              {emojiList.slice(row.start, row.end).map((emoji, index) => (
                <div className="flex flex-col justify-center items-center w-16 m-1">
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
                  <div className="text-xs w-20 text-center whitespace-pre-wrap">{titleList[row.start + index].title}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
        : null}

    </div>
  );
};
