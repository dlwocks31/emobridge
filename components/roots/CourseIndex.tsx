import { Database } from "@/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export async function CourseIndex({ at }: { at: "editor" | "feedbacker" }) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // TODO should I just redirect??
  if (!user) {
    redirect("/auth/login");
  }

  const { data } = await supabase
    .from("courses")
    .select("*")
    .contains("userEmails", [user?.email]);

  if (!data) {
    return <div>수업이 없습니다.</div>;
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xl font-bold">나의 수업 목록</div>
      {data.length === 0 && <div>수업이 없습니다.</div>}
      {data.map((c) => (
        <div key={c.id}>
          <Link
            className="btn w-full flex justify-start no-animation"
            href={`/${at}/course/${c.id}`}
          >
            <div>{c.name}</div>
          </Link>
        </div>
      ))}
    </div>
  );
}
