import { Database } from "@/database.types";
import {
  User,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { DocShowClient } from "./DocShowClient";

export async function DocShow({
  id,
  userRole,
  user,
}: {
  id: string;
  userRole: string;
  user: User;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

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
