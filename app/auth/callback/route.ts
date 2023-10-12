import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  console.log("code", code);
  if (code) {
    const response = await supabase.auth.exchangeCodeForSession(code);
    console.log("response", response);
  }

  return NextResponse.redirect(new URL("/feedbacker/course", req.url));
}
