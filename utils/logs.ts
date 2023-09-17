import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../database.types";

export async function insertLog(data: {
  logType: "addEmoji" | "deleteEmoji";
  documentId: number;
  emojiType: string;
  targetBlockId: string;
}) {
  const supabase = createClientComponentClient<Database>();
  return supabase.from("editorLogs").insert(data);
}
