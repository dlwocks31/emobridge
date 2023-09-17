import { Database } from "@/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// download csv
export async function GET(request: NextRequest, response: NextResponse) {
  const docId = +request.url.split("/")[5];
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const columns = [
    "documentId",
    "logType",
    "emojiType",
    "targetBlockId",
    "createdBy",
    "createdAt",
  ] as const;

  const { data, error } = await supabase
    .from("editorLogs")
    .select("*")
    .eq("documentId", docId);

  const headers = columns.join(",");
  const values = data
    ?.map((row) => {
      return columns.map((column) => {
        return row[column];
      });
    })
    .join("\n");

  const csv = `${headers}\n${values}`;

  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault("Asia/Seoul");
  const fileName = `logs-${docId}-${dayjs().format("YYYYMMDD-HHmmss")}.csv`;
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${fileName}"`,
    },
  });
}
