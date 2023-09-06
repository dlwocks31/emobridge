import { Database } from "@/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DocShowClient } from "./DocShowClient";

export async function DocShow({ id }: { id: string }) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: document } = await supabase
    .from("documents")
    .select("*")
    .eq("id", +id)
    .single();

  if (!document) {
    return <div>Document not found</div>;
  }

  return <DocShowClient user={null} id={id} name={document.name} />;
}
