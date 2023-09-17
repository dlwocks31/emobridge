import { Database } from "@/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DocShowClient } from "./DocShowClient";

export async function DocShow({
  id,
  userRole,
}: {
  id: string;
  userRole: string;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: document } = await supabase
    .from("documents")
    .select("*")
    .eq("id", +id)
    .single();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", document?.courseId)
    .single();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!document || !course) {
    return <div>Document not found</div>;
  }

  return (
    <DocShowClient
      user={user}
      id={id}
      name={document.name}
      course={course}
      userRole={userRole}
    />
  );
}
