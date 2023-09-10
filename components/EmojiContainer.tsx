"use client";
import { BlockNoteEditor, PartialBlock } from "@/components/Editor";
import Image from "next/image";
import { useContext } from "react";
import { GlobalContext } from "../app/providers";
const emojiListF = [
  {
    url: "/importantF.png",
    def: "중요해요",
  },
  {
    url: "/moreF.png",
    def: "더 자세하게\n써주세요",
  },
  {
    url: "/enoughF.png",
    def: "충분해요",
  },
  {
    url: "/pptF.png",
    def: "PPT대로\n써주세요",
  },
  {
    url: "/photoF.png",
    def: "사진찍어서\n넣어주세요",
  },
  {
    url: "/fixF.png",
    def: "고쳐주세요",
  },
  {
    url: "/hardF.png",
    def: "어려워요",
  },
  {
    url: "/curiousF.png",
    def: "제가 맞게\n썼나요?",
  },
  {
    url: "/emptyF.png",
    def: "잠깐 자리\n비울게요",
  },
];
const emojiListE = [
  {
    url: "/importantE.png",
    def: "중요해요",
  },
  {
    url: "/moreE.png",
    def: "더 자세하게\n써주세요",
  },
  {
    url: "/enoughE.png",
    def: "충분해요",
  },
  {
    url: "/pptE.png",
    def: "PPT대로\n써주세요",
  },
  {
    url: "/photoE.png",
    def: "사진찍어서\n넣어주세요",
  },
  {
    url: "/fixE.png",
    def: "고쳐주세요",
  },
  {
    url: "/hardE.png",
    def: "어려워요",
  },
  {
    url: "/curiousE.png",
    def: "제가 맞게\n썼나요?",
  },
  {
    url: "/emptyE.png",
    def: "잠깐 자리\n비울게요",
  },
];
const RowInfo = [
  { start: 0, end: 3 },
  { start: 3, end: 6 },
  { start: 6, end: 9 },
];

export const EmojiContainer = ({ editor, userRole }: { editor: BlockNoteEditor; userRole: string }) => {
  const { emojiContainerOpened, focusedBlockId } = useContext(GlobalContext);
  const emojiList = userRole === "feedbacker" ? emojiListF : emojiListE;
  const containerBackgroundColor = userRole === "feedbacker" ? "bg-yellow-300" : "bg-white/30";

  const handleEmojiClick = (emoji: string) => {
    if (!focusedBlockId) return;
    const textCursorPosition = editor.getTextCursorPosition();
    if (!textCursorPosition.block.id) return;

    if (focusedBlockId && focusedBlockId != textCursorPosition.block.id) {
      console.warn(
        "focusedBlockId is not same with textCursorPosition.block.id",
      );
    }

    const block = editor?.getBlock(textCursorPosition.block.id);
    const prevBlock = textCursorPosition?.prevBlock?.id
      ? editor?.getBlock(textCursorPosition.prevBlock?.id)
      : null;

    if (prevBlock?.type === "emoji") {
      // 이전 블록이 이모지 블록이면, 기존 이모지 블록에 추가
      const mergeString = (initial: string, next: string) => {
        const initialLength = initial.split(",").length;
        if (initial.includes(next) || initialLength >= 3) {
          return initial;
        }
        return initial + "," + next;
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
      // 이전 블록이 이모지 블록이 아니면, 새로운 이모지 블록 생성
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
  };

  return (
    <div className="fixed z-50">
      {emojiContainerOpened ? (
        <div
          className={
            `h-100 rounded-3xl ${containerBackgroundColor} p-4 border-black border-opacity-10 shadow-xl ring-2 ring-gray-200 bg-opacity-30 backdrop-filter backdrop-blur ${focusedBlockId ? "opacity-100" : "opacity-100"}`
          }
        >
          <div className="text-center text-xl mb-1">필기 이모지</div>
          {RowInfo.map((row, index) => (
            <div className="flex">
              {emojiList.slice(row.start, row.end).map((emoji, index) => (
                <div className="flex flex-col justify-start items-center w-16 m-1">
                  <Image
                    src={emoji.url}
                    alt={emoji.def}
                    width="50"
                    height="50"
                    onClick={() => {
                      console.log(emoji.url);
                      handleEmojiClick(emoji.url);
                    }}
                  />
                  <div className="text-xs w-20 text-center whitespace-pre-wrap mt-1">
                    {emoji.def}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
