import { Database } from "@/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";

export async function GET(request: NextRequest, response: NextResponse) {
  const docId = +request.url.split("/")[5];
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const columns = [
    "documentId",
    "logType",
    "emojiType",
    "emojiClass",
    "targetBlockId",
    "blockContent",
    "createdBy",
    "createdAt",
  ] as const;

  const { data, error } = await supabase
    .from("editorLogs")
    .select("*")
    .eq("documentId", docId);

  if (error) {
    // Handle the error appropriately
    throw error;
  }

  const csvData = data?.map((row) => {
    return columns.reduce((acc, column) => {
      acc[column] = row[column];
      return acc;
    }, {} as any);
  });

  const csv = Papa.unparse({
    fields: [...columns],
    data: csvData,
  });

  const BOM = "\uFEFF";
  const csvWithBOM = BOM + csv; // Add BOM to the beginning of the csv string to make it work on Excel (encoding issue)

  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault("Asia/Seoul");
  const fileName = `logs-${docId}-${dayjs().format("YYYYMMDD-HHmmss")}.csv`;

  return new Response(csvWithBOM, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${fileName}"`,
    },
  });
}
