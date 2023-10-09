import { Database } from "@/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { DocShowClient } from "./DocShowClient";

export async function DocShow({
  id,
  userRole,
}: {
  id: string;
  userRole: string;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }
  const { data: document } = await supabase
    .from("documents")
    .select("*")
    .eq("id", +id)
    .eq("isHidden", false)
    .single();

  if (!document) {
    notFound();
  }

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", document.courseId)
    .single();

  if (!course || !user.email || course.userEmails.indexOf(user.email) === -1) {
    notFound();
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
