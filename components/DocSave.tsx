"use client";

import "@blocknote/core/style.css";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { GlobalContext } from "../app/providers";

export function DocSave() {
  const pathname = usePathname();
  const { editor } = useContext(GlobalContext);
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
      const originalBlocks = await editor!.topLevelBlocks; // original blocks를 가져옵니다.
      const cleanedBlocks = removeEmojiBlocks(originalBlocks); // "emoji" 블록들을 제거합니다.
      const htmlContent = await editor!.blocksToMarkdown(cleanedBlocks); // 새로운 블록 리스트로 마크다운을 생성합니다.

      const blob = new Blob([htmlContent], { type: "text/markdown" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "content.md";
      link.click();
    } catch (error) {
      console.error("Error generating html:", error);
    }
  };

  const isTargetPage =
    /^\/editor\/doc\/\d+$/.test(pathname) ||
    /^\/feedbacker\/doc\/\d+$/.test(pathname);

  return (
    isTargetPage && (
      <div className={"btn btn-ghost px-1"}>
        <Image
          src="/save.png"
          alt="save"
          onClick={saveToFile}
          width="24"
          height="24"
        />
      </div>
    )
  );
}
