"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Database } from "../database.types";
import { BlockNoteView } from "@blocknote/react";
import { BlockNoteEditor } from "./Editor";
import "@blocknote/core/style.css";
import { cn } from "../utils/cn";

export function DocSave({ editor }: { editor: BlockNoteEditor }) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const removeEmojiBlocks = (blocks: any) => {
    return blocks.reduce((acc: any, block: any) => {
      if (block.type === "paragraph") {
        if (block.children) {
          block.children = removeEmojiBlocks(block.children);
        }
        acc.push(block);
      } else if (block.type !== "emoji") {
        if (block.children) {
          block.children = removeEmojiBlocks(block.children);
        }
        acc.push(block);
      }
      return acc;
    }, []);
  };

  const saveToFile = async () => {
    try {
      const originalBlocks = await editor.topLevelBlocks; // original blocks를 가져옵니다.
      const cleanedBlocks = removeEmojiBlocks(originalBlocks); // "emoji" 블록들을 제거합니다.
      const htmlContent = await editor.blocksToHTML(cleanedBlocks); // 새로운 블록 리스트로 마크다운을 생성합니다.

      const blob = new Blob([htmlContent], { type: "text/html" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "content.md";
      link.click();
    } catch (error) {
      console.error("Error generating html:", error);
    }
  };

  return (
    <div className={"btn btn-ghost px-1 w-10"}>
      <img src={"/save.png"} alt="save" onClick={saveToFile} />
    </div>
  );
}
