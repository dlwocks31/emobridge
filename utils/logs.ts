import { InlineContent } from "@blocknote/core";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../database.types";
import { getEmojiClass } from "./emojis";

export async function insertLog(data: {
  logType: "addEmoji" | "deleteEmoji";
  documentId: number;
  emojiType: string;
  targetBlockId?: string;
  blockContent?: string;
}) {
  const emojiClass: "emotion" | "notetaking" = getEmojiClass(data.emojiType);
  const supabase = createClientComponentClient<Database>();
  return supabase.from("editorLogs").insert({ ...data, emojiClass });
}

export function getText(inlineContents: InlineContent[]): string {
  return inlineContents
    .map((content) =>
      content.type === "text" ? content.text : getText(content.content),
    )
    .join("");
}
