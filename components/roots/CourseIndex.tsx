import { Database } from "@/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";


export async function CourseIndex({ at }: { at: "editor" | "feedbacker" }) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data } = await supabase.from("courses").select("*");
  if (!data) {
    return <div>Course not found</div>;
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xl font-bold">수업 목록</div>
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
