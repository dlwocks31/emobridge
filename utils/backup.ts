import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { BlockNoteEditor } from "../components/Editor";
import { Database } from "../database.types";

const removeEmojiBlocks = (blocks: any) => {
  return blocks.reduce((acc: any, block: any) => {
    if (block.type === "paragraph") {
      if (block.children) {
        block.children = removeEmojiBlocks(block.children);
      }
      acc.push(block);
    } else if (block.type !== "emoji" && block.type !== "image") {
      if (block.children) {
        block.children = removeEmojiBlocks(block.children);
      }
      acc.push(block);
    }
    return acc;
  }, []);
};

export async function backup(editor: BlockNoteEditor, documentId: number) {
  const originalBlocks = await editor.topLevelBlocks;
  const cleanedBlocks = removeEmojiBlocks(originalBlocks);
  const markdownContent = await editor.blocksToMarkdown(cleanedBlocks);

  const supabase = createClientComponentClient<Database>();
  const { data, error } = await supabase
    .from("backups")
    .insert({
      documentId,
      content: markdownContent,
    })
    .select("id, createdAt");

  if (!data) {
    return { error };
  } else {
    return { data: data[0] };
  }
}
