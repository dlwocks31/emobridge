import { Database } from "@/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import dayjs from "dayjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { DocCreate } from "../DocCreate";
export async function CourseShow({
  id,
  at,
}: {
  id: string;
  at: "feedbacker" | "editor";
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", +id)
    .single();

  if (!course) {
    return <div>Class not found</div>;
  }

  const { data: docs } = await supabase
    .from("documents")
    .select()
    .eq("courseId", +id);
  if (!docs) {
    return <div>Document not found</div>;
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xl font-bold">수업: {course.name}</div>
      <div className="flex justify-between items-center">
        <div className="text-lg font-bold">문서:</div>
        <DocCreate courseId={course.id} />
      </div>
      {docs.map((d) => (
        <div key={d.id}>
          <Link
            className="btn w-full flex justify-between px-4 no-animation"
            href={`/${at}/doc/${d.id}`}
          >
            <div>{d.name}</div>
            <div>{dayjs(d.createdAt).format("YYYY-MM-DD HH:mm:ss")}</div>
          </Link>
        </div>
      ))}
    </div>
  );
}
