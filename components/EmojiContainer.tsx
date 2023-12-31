"use client";
import { BlockNoteEditor, PartialBlock } from "@/components/Editor";
import Image from "next/image";
import { useContext } from "react";
import Draggable from "react-draggable";
import { GlobalContext } from "../app/providers";
import {
  notetakingEditorEmojis,
  notetakingFeedbackerEmojis,
} from "../utils/emojis";
import { getText, insertLog } from "../utils/logs";

const RowInfo = [
  { start: 0, end: 3 },
  { start: 3, end: 6 },
  { start: 6, end: 9 },
];

export const EmojiContainer = ({
  documentId,
  editor,
  userRole,
}: {
  documentId: number;
  editor: BlockNoteEditor;
  userRole: string;
}) => {
  const { emojiContainerOpened, focusedBlockId } = useContext(GlobalContext);
  const emojiList =
    userRole === "feedbacker"
      ? notetakingFeedbackerEmojis
      : notetakingEditorEmojis;
  const containerBackgroundColor =
    userRole === "feedbacker" ? "bg-yellow-300" : "bg-white/30";

  const handleEmojiClick = async (emoji: string) => {
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
        const { error } = await insertLog({
          logType: "addEmoji",
          documentId: documentId,
          emojiType: emoji,
          targetBlockId: block.id,
          blockContent: getText(block.content),
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
    const blockId = block?.id;
    if (blockId) {
      const { error } = await insertLog({
        logType: "addEmoji",
        documentId: documentId,
        emojiType: emoji,
        targetBlockId: blockId,
        blockContent: getText(block.content),
      });
      if (error) {
        console.error("error inserting log", error);
      }
    } else {
      console.error("blockId is undefined");
    }
  };

  return (
    <Draggable defaultPosition={{ x: 0, y: 105 }}>
      <div className="fixed z-50">
        {emojiContainerOpened ? (
          <div
            className={`h-100 rounded-3xl ${containerBackgroundColor} p-2 border-black border-opacity-10 shadow-xl ring-2 ring-gray-200 bg-opacity-30 backdrop-filter backdrop-blur ${
              focusedBlockId ? "opacity-100" : "opacity-100"
            }`}
          >
            <div className="text-center text-lg font-bold mb-1 m-1">
              필기 이모지
            </div>
            {RowInfo.map((row, index) => (
              <div className="flex">
                {emojiList.slice(row.start, row.end).map((emoji, index) => (
                  <div className="flex flex-col justify-start items-center w-14 m-1">
                    <Image
                      src={emoji.url}
                      alt={emoji.def}
                      width="44"
                      height="44"
                      onClick={() => {
                        console.log(emoji.url);
                        handleEmojiClick(emoji.url);
                      }}
                    />
                    <div className="text-xs w-16 text-center whitespace-pre-wrap mt-1">
                      {emoji.def}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Draggable>
  );
};
