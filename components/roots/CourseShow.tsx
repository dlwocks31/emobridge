import { Database } from "@/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import dayjs from "dayjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DirectoryNavigation } from "../DirectoryNavigation";
import { DocCreate } from "../DocCreate";
import { DocDelete } from "../DocDelete";

export async function CourseShow({
  id,
  at,
}: {
  id: string;
  at: "feedbacker" | "editor";
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", +id)
    .single();
  if (!course || !user.email || course.userEmails.indexOf(user.email) === -1) {
    notFound();
  }

  const { data: docs, error } = await supabase
    .from("documents")
    .select()
    .eq("courseId", +id)
    .eq("isHidden", false);

  if (error) {
    console.error(error);
    throw error;
  }
  return (
    <div className="flex flex-col gap-2">
      <DirectoryNavigation
        directories={[
          { name: "나의 수업", href: `/${at}/course` },
          { name: course.name },
        ]}
      />
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">{course.name}: 수업 문서</div>
        <DocCreate courseId={course.id} />
      </div>

      {docs.map((d) => (
        <div key={d.id} className="flex justify-between items-center">
          <Link
            className="btn w-full text-base flex justify-between px-4 no-animation"
            href={`/${at}/doc/${d.id}`}
          >
            <div>{d.name}</div>
            <div>{dayjs(d.createdAt).format("YYYY-MM-DD HH:mm:ss")}</div>
          </Link>
          <DocDelete documentId={d.id} />
        </div>
      ))}
    </div>
  );
}
